"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRestaurantAccess } from "@/lib/auth";

const CategorySchema = z.object({
  name_es: z.string().min(1, "Nombre requerido"),
  name_en: z.string().optional(),
  description_es: z.string().optional(),
  icon: z.string().optional(),
  available_from: z.string().optional(),
  available_until: z.string().optional(),
});

const ItemSchema = z.object({
  category_id: z.string().uuid("Categoría inválida"),
  name_es: z.string().min(1, "Nombre requerido"),
  name_en: z.string().optional(),
  description_es: z.string().optional(),
  description_en: z.string().optional(),
  price: z.coerce.number().int().min(0, "Precio inválido"),
  compare_at_price: z.coerce.number().int().min(0).optional().nullable(),
  currency: z.enum(["CLP", "USD", "EUR", "PEN", "ARS", "MXN"]),
  main_image_url: z.string().url().optional().or(z.literal("")),
  dietary_tags: z.string().optional(),
  allergens: z.string().optional(),
  is_chef_recommendation: z.coerce.boolean().optional(),
  prep_time_minutes: z.coerce.number().int().min(0).optional().nullable(),
  calories: z.coerce.number().int().min(0).optional().nullable(),
});

export type MenuItemFormState = {
  errors?: Partial<Record<string, string[]>>;
  message?: string;
};

async function getRestaurantSlug(restaurantId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", restaurantId)
    .single<{ slug: string }>();
  return data?.slug;
}

function revalidateMenuPaths(restaurantId: string, slug?: string) {
  if (slug) revalidatePath(`/r/${slug}`);
  revalidatePath(`/admin/restaurants/${restaurantId}/menu`);
  revalidatePath(`/dashboard/menu`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export async function createCategory(restaurantId: string, formData: FormData) {
  await requireRestaurantAccess(restaurantId);
  const raw = Object.fromEntries(formData.entries());
  const parsed = CategorySchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: lastCat } = await supabase
    .from("menu_categories")
    .select("position")
    .eq("restaurant_id", restaurantId)
    .order("position", { ascending: false })
    .limit(1)
    .returns<{ position: number }[]>();

  const position = (lastCat?.[0]?.position ?? -1) + 1;

  // Cast needed: hand-written Database type doesn't satisfy Supabase GenericSchema constraint
  await (supabase as AnyClient).from("menu_categories").insert({
    restaurant_id: restaurantId,
    name: { es: parsed.data.name_es, ...(parsed.data.name_en ? { en: parsed.data.name_en } : {}) },
    description: parsed.data.description_es ? { es: parsed.data.description_es } : null,
    icon: parsed.data.icon || null,
    available_from: parsed.data.available_from || null,
    available_until: parsed.data.available_until || null,
    position,
  });

  const slug = await getRestaurantSlug(restaurantId);
  revalidateMenuPaths(restaurantId, slug);
}

export async function reorderCategories(restaurantId: string, orderedIds: string[]) {
  await requireRestaurantAccess(restaurantId);
  const supabase = await createClient();

  await Promise.all(
    orderedIds.map((id, position) =>
      (supabase as AnyClient).from("menu_categories").update({ position }).eq("id", id),
    ),
  );

  const slug = await getRestaurantSlug(restaurantId);
  revalidateMenuPaths(restaurantId, slug);
}

export async function createMenuItem(
  restaurantId: string,
  _prev: MenuItemFormState,
  formData: FormData,
): Promise<MenuItemFormState> {
  await requireRestaurantAccess(restaurantId);
  const raw = Object.fromEntries(formData.entries());
  const parsed = ItemSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: lastItem } = await supabase
    .from("menu_items")
    .select("position")
    .eq("category_id", parsed.data.category_id)
    .order("position", { ascending: false })
    .limit(1)
    .returns<{ position: number }[]>();

  const position = (lastItem?.[0]?.position ?? -1) + 1;
  const dietary_tags = parsed.data.dietary_tags
    ? parsed.data.dietary_tags.split(",").filter(Boolean)
    : [];
  const allergens = parsed.data.allergens
    ? parsed.data.allergens.split(",").filter(Boolean)
    : [];

  const { error } = await (supabase as AnyClient).from("menu_items").insert({
    restaurant_id: restaurantId,
    category_id: parsed.data.category_id,
    name: { es: parsed.data.name_es, ...(parsed.data.name_en ? { en: parsed.data.name_en } : {}) },
    description:
      parsed.data.description_es
        ? {
            es: parsed.data.description_es,
            ...(parsed.data.description_en ? { en: parsed.data.description_en } : {}),
          }
        : null,
    price: parsed.data.price,
    compare_at_price: parsed.data.compare_at_price ?? null,
    currency: parsed.data.currency,
    main_image_url: parsed.data.main_image_url || null,
    dietary_tags,
    allergens,
    is_chef_recommendation: parsed.data.is_chef_recommendation ?? false,
    prep_time_minutes: parsed.data.prep_time_minutes ?? null,
    calories: parsed.data.calories ?? null,
    position,
  });

  if (error) return { message: "Error al crear el plato." };

  const slug = await getRestaurantSlug(restaurantId);
  revalidateMenuPaths(restaurantId, slug);
  return { message: "ok" };
}

export async function updateMenuItem(
  restaurantId: string,
  itemId: string,
  _prev: MenuItemFormState,
  formData: FormData,
): Promise<MenuItemFormState> {
  await requireRestaurantAccess(restaurantId);
  const raw = Object.fromEntries(formData.entries());
  const parsed = ItemSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const dietary_tags = parsed.data.dietary_tags
    ? parsed.data.dietary_tags.split(",").filter(Boolean)
    : [];
  const allergens = parsed.data.allergens
    ? parsed.data.allergens.split(",").filter(Boolean)
    : [];

  const supabase = await createClient();
  const { error } = await (supabase as AnyClient)
    .from("menu_items")
    .update({
      category_id: parsed.data.category_id,
      name: { es: parsed.data.name_es, ...(parsed.data.name_en ? { en: parsed.data.name_en } : {}) },
      description:
        parsed.data.description_es
          ? {
              es: parsed.data.description_es,
              ...(parsed.data.description_en ? { en: parsed.data.description_en } : {}),
            }
          : null,
      price: parsed.data.price,
      compare_at_price: parsed.data.compare_at_price ?? null,
      currency: parsed.data.currency,
      main_image_url: parsed.data.main_image_url || null,
      dietary_tags,
      allergens,
      is_chef_recommendation: parsed.data.is_chef_recommendation ?? false,
      prep_time_minutes: parsed.data.prep_time_minutes ?? null,
      calories: parsed.data.calories ?? null,
    })
    .eq("id", itemId);

  if (error) return { message: "Error al actualizar el plato." };

  const slug = await getRestaurantSlug(restaurantId);
  revalidateMenuPaths(restaurantId, slug);
  return { message: "ok" };
}

export async function toggleItemAvailable(
  restaurantId: string,
  itemId: string,
  isAvailable: boolean,
) {
  await requireRestaurantAccess(restaurantId);
  const supabase = await createClient();
  await (supabase as AnyClient)
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", itemId);

  const slug = await getRestaurantSlug(restaurantId);
  if (slug) revalidatePath(`/r/${slug}`);
}

export async function reorderItems(restaurantId: string, orderedIds: string[]) {
  await requireRestaurantAccess(restaurantId);
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, position) =>
      (supabase as AnyClient).from("menu_items").update({ position }).eq("id", id),
    ),
  );

  const slug = await getRestaurantSlug(restaurantId);
  if (slug) revalidatePath(`/r/${slug}`);
}

export async function updateItemPrice(itemId: string, price: number) {
  const supabase = await createClient();

  // Fetch restaurant_id to check access
  const { data: item } = await supabase
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", itemId)
    .single<{ restaurant_id: string }>();

  if (!item) return;
  await requireRestaurantAccess(item.restaurant_id);

  await (supabase as AnyClient).from("menu_items").update({ price }).eq("id", itemId);

  const slug = await getRestaurantSlug(item.restaurant_id);
  if (slug) revalidatePath(`/r/${slug}`);
}

const ImportSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(1),
      items: z.array(
        z.object({
          name: z.string().min(1),
          description: z.string().optional().default(""),
          price: z.number().int().min(0),
        }),
      ),
    }),
  ),
});

export type ImportMenuState = { message?: string; error?: string };

export async function importMenu(
  restaurantId: string,
  currency: string,
  _prev: ImportMenuState,
  formData: FormData,
): Promise<ImportMenuState> {
  await requireRestaurantAccess(restaurantId);

  const raw = formData.get("json") as string;
  let parsed: z.infer<typeof ImportSchema>;
  try {
    parsed = ImportSchema.parse(JSON.parse(raw));
  } catch {
    return { error: "JSON inválido. Verifica el formato e intenta de nuevo." };
  }

  const supabase = await createClient();

  const { data: lastCatRow } = await supabase
    .from("menu_categories")
    .select("position")
    .eq("restaurant_id", restaurantId)
    .order("position", { ascending: false })
    .limit(1)
    .returns<{ position: number }[]>();

  let catPosition = (lastCatRow?.[0]?.position ?? -1) + 1;
  let totalItems = 0;

  for (const cat of parsed.categories) {
    const { data: newCat, error: catErr } = await (supabase as AnyClient)
      .from("menu_categories")
      .insert({
        restaurant_id: restaurantId,
        name: { es: cat.name },
        position: catPosition++,
      })
      .select("id")
      .single();

    if (catErr || !newCat) continue;

    const itemRows = cat.items.map((item, idx) => ({
      restaurant_id: restaurantId,
      category_id: newCat.id,
      name: { es: item.name },
      description: item.description ? { es: item.description } : null,
      price: item.price,
      currency,
      position: idx,
    }));

    if (itemRows.length) {
      await (supabase as AnyClient).from("menu_items").insert(itemRows);
      totalItems += itemRows.length;
    }
  }

  const slug = await getRestaurantSlug(restaurantId);
  revalidateMenuPaths(restaurantId, slug);

  return {
    message: `Importación completa: ${parsed.categories.length} categorías y ${totalItems} platos añadidos.`,
  };
}

export async function deleteMenuItem(restaurantId: string, itemId: string) {
  await requireRestaurantAccess(restaurantId);
  const supabase = await createClient();
  await (supabase as AnyClient).from("menu_items").delete().eq("id", itemId);

  const slug = await getRestaurantSlug(restaurantId);
  revalidateMenuPaths(restaurantId, slug);
}
