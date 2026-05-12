"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireSuperAdmin, requireRestaurantAccess } from "@/lib/auth";

const RestaurantSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z
    .string()
    .min(1, "Slug requerido")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string().optional(),
  legal_name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  instagram_handle: z.string().optional(),
  website_url: z.string().url("URL inválida").optional().or(z.literal("")),
  google_maps_url: z.string().url("URL inválida").optional().or(z.literal("")),
  reservation_url: z.string().url("URL inválida").optional().or(z.literal("")),
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color hexadecimal inválido"),
  secondary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color hexadecimal inválido"),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color hexadecimal inválido"),
  font_heading: z.string().min(1),
  font_body: z.string().min(1),
  default_currency: z.enum(["CLP", "USD", "EUR", "PEN", "ARS", "MXN"]),
  timezone: z.string().min(1),
  default_language: z.string().min(2),
});

export type RestaurantFormState = {
  errors?: Partial<Record<keyof z.infer<typeof RestaurantSchema>, string[]>>;
  message?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export async function createRestaurant(
  _prev: RestaurantFormState,
  formData: FormData,
): Promise<RestaurantFormState> {
  await requireSuperAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = RestaurantSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  // Cast needed: hand-written Database type doesn't satisfy Supabase GenericSchema constraint
  const { data, error } = await (supabase as AnyClient)
    .from("restaurants")
    .insert({
      ...parsed.data,
      email: parsed.data.email || null,
      website_url: parsed.data.website_url || null,
      google_maps_url: parsed.data.google_maps_url || null,
      reservation_url: parsed.data.reservation_url || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { message: "El slug ya está en uso. Elige otro." };
    return { message: "Error al crear el restaurante. Intenta de nuevo." };
  }

  redirect(`/admin/restaurants/${data.id}`);
}

export async function updateRestaurant(
  id: string,
  _prev: RestaurantFormState,
  formData: FormData,
): Promise<RestaurantFormState> {
  await requireSuperAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = RestaurantSchema.safeParse(raw);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await (supabase as AnyClient)
    .from("restaurants")
    .update({
      ...parsed.data,
      email: parsed.data.email || null,
      website_url: parsed.data.website_url || null,
      google_maps_url: parsed.data.google_maps_url || null,
      reservation_url: parsed.data.reservation_url || null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { message: "El slug ya está en uso. Elige otro." };
    return { message: "Error al actualizar. Intenta de nuevo." };
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", id)
    .single<{ slug: string }>();

  if (restaurant) revalidatePath(`/r/${restaurant.slug}`);
  revalidatePath(`/admin/restaurants/${id}`);

  return { message: "ok" };
}

export async function updateBranding(id: string, formData: FormData) {
  await requireRestaurantAccess(id);
  const supabase = await createClient();

  const data = {
    accent_color: (formData.get("accent_color") as string) || "#FF6B35",
    font_family: (formData.get("font_family") as string) || null,
    logo_url: (formData.get("logo_url") as string) || null,
    card_stroke: (formData.get("card_stroke") as string) || null,
    theme: (formData.get("theme") as string) || null,
  };

  await (supabase as AnyClient).from("restaurants").update(data).eq("id", id);

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", id)
    .single<{ slug: string }>();

  if (restaurant) revalidatePath(`/r/${restaurant.slug}`);
  revalidatePath(`/admin/restaurants/${id}/branding`);
}

export async function updateSplash(id: string, formData: FormData) {
  await requireRestaurantAccess(id);
  const supabase = await createClient();

  const data = {
    splash_enabled: formData.get("splash_enabled") === "true",
    tagline: (formData.get("tagline") as string) || null,
    hours: (formData.get("hours") as string) || null,
    splash_bg_type: (formData.get("splash_bg_type") as string) || "gradient",
    splash_pattern_id: (formData.get("splash_pattern_id") as string) || "dots",
    splash_color: (formData.get("splash_color") as string) || "#000000",
    splash_gradient_from: (formData.get("splash_gradient_from") as string) || "#000000",
    splash_gradient_to: (formData.get("splash_gradient_to") as string) || "#333333",
    cover_image_url: (formData.get("cover_image_url") as string) || null,
    logo_url: (formData.get("logo_url") as string) || null,
  };

  await (supabase as AnyClient).from("restaurants").update(data).eq("id", id);

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", id)
    .single<{ slug: string }>();

  if (restaurant) revalidatePath(`/r/${restaurant.slug}`);
  revalidatePath(`/admin/restaurants/${id}/splash`);
}

export async function deactivateRestaurant(id: string) {
  await requireSuperAdmin();
  const supabase = await createClient();

  await (supabase as AnyClient)
    .from("restaurants")
    .update({ is_active: false, is_published: false })
    .eq("id", id);

  revalidatePath("/admin/restaurants");
}

export async function togglePublished(id: string, isPublished: boolean) {
  await requireSuperAdmin();
  const supabase = await createClient();

  await (supabase as AnyClient)
    .from("restaurants")
    .update({ is_published: isPublished })
    .eq("id", id);

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", id)
    .single<{ slug: string }>();

  if (restaurant) revalidatePath(`/r/${restaurant.slug}`);
  revalidatePath("/admin/restaurants");
}
