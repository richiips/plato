"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/auth";
import type { RestaurantMember, Profile, MemberRole } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export type MemberWithProfile = RestaurantMember & { profile: Profile };

export type InviteFormState = { errors?: { email?: string[] }; message?: string };

const InviteSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["owner", "manager", "staff"]).default("manager"),
});

export async function getMembers(restaurantId: string): Promise<MemberWithProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurant_members")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .returns<RestaurantMember[]>();

  if (!data?.length) return [];

  // Fetch profiles for all members
  const profileIds = data.map((m) => m.profile_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("id", profileIds)
    .returns<Profile[]>();

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  return data
    .filter((m) => profileMap[m.profile_id])
    .map((m) => ({ ...m, profile: profileMap[m.profile_id] }));
}

export async function inviteMember(
  restaurantId: string,
  _prev: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  const caller = await requireSuperAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = InviteSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  // Find the user by email using the admin client
  const admin = createAdminClient();
  const { data: users, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) return { message: "Error al buscar usuario." };

  const user = users.users.find((u) => u.email === parsed.data.email);
  if (!user) {
    return { errors: { email: ["No hay ningún usuario con ese email. Debe registrarse primero."] } };
  }

  const supabase = await createClient();
  const { error } = await (supabase as AnyClient).from("restaurant_members").insert({
    restaurant_id: restaurantId,
    profile_id: user.id,
    role: parsed.data.role as MemberRole,
    invited_by: caller.id,
  });

  if (error) {
    if (error.code === "23505") return { message: "Este usuario ya es miembro." };
    return { message: "Error al agregar miembro." };
  }

  revalidatePath(`/admin/restaurants/${restaurantId}/members`);
  return { message: "ok" };
}

export async function removeMember(restaurantId: string, memberId: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  await (supabase as AnyClient)
    .from("restaurant_members")
    .delete()
    .eq("id", memberId)
    .eq("restaurant_id", restaurantId);

  revalidatePath(`/admin/restaurants/${restaurantId}/members`);
}

export async function updateMemberRole(
  restaurantId: string,
  memberId: string,
  role: MemberRole,
) {
  await requireSuperAdmin();
  const supabase = await createClient();
  await (supabase as AnyClient)
    .from("restaurant_members")
    .update({ role })
    .eq("id", memberId)
    .eq("restaurant_id", restaurantId);

  revalidatePath(`/admin/restaurants/${restaurantId}/members`);
}
