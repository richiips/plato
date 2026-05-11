"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRestaurantAccess } from "@/lib/auth";
import type { Restaurant, RestaurantMember } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export type DashboardContext = {
  restaurant: Restaurant;
  restaurants: Restaurant[];
  member: RestaurantMember;
};

export async function getDashboardContext(): Promise<DashboardContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all member records for this user
  const { data: members } = await supabase
    .from("restaurant_members")
    .select("*")
    .eq("profile_id", user.id)
    .returns<RestaurantMember[]>();

  if (!members?.length) redirect("/login");

  // Fetch all associated restaurants
  const restaurantIds = members.map((m) => m.restaurant_id);
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .in("id", restaurantIds)
    .order("name")
    .returns<Restaurant[]>();

  if (!restaurants?.length) redirect("/login");

  // Select restaurant from cookie, fall back to first
  const cookieStore = await cookies();
  const savedRid = cookieStore.get("dashboard_rid")?.value;
  const restaurant = restaurants.find((r) => r.id === savedRid) ?? restaurants[0];
  const member = members.find((m) => m.restaurant_id === restaurant.id)!;

  return { restaurant, restaurants, member };
}

export async function selectRestaurant(restaurantId: string) {
  const cookieStore = await cookies();
  cookieStore.set("dashboard_rid", restaurantId, {
    path: "/dashboard",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/dashboard");
}

const SettingsSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  instagram_handle: z.string().optional(),
  website_url: z.string().url("URL inválida").optional().or(z.literal("")),
  google_maps_url: z.string().url("URL inválida").optional().or(z.literal("")),
  reservation_url: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type SettingsFormState = {
  errors?: Partial<Record<keyof z.infer<typeof SettingsSchema>, string[]>>;
  message?: string;
};

export async function updateRestaurantSettings(
  restaurantId: string,
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireRestaurantAccess(restaurantId);

  const raw = Object.fromEntries(formData.entries());
  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { error } = await (supabase as AnyClient)
    .from("restaurants")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      address: parsed.data.address || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      instagram_handle: parsed.data.instagram_handle || null,
      website_url: parsed.data.website_url || null,
      google_maps_url: parsed.data.google_maps_url || null,
      reservation_url: parsed.data.reservation_url || null,
    })
    .eq("id", restaurantId);

  if (error) return { message: "Error al guardar. Intenta de nuevo." };

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", restaurantId)
    .single<{ slug: string }>();

  if (restaurant) revalidatePath(`/r/${restaurant.slug}`);
  revalidatePath("/dashboard/settings");

  return { message: "ok" };
}
