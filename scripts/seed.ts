/**
 * Seed script: creates (or resets) the "demo" restaurant used by the landing page.
 * Run with:  pnpm seed
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false }, realtime: { transport: ws } },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ---------------------------------------------------------------------------

async function upsertRestaurant() {
  const { data, error } = await db.from("restaurants").upsert(
    {
      slug: "demo",
      name: "Restaurante Demo",
      description: "Carta digital de ejemplo — explora todas las funciones de Plato.",
      address: "Calle Ejemplo 123, Santiago",
      phone: "+56 9 1234 5678",
      email: "hola@plato.menu",
      instagram_handle: "plato.menu",
      primary_color: "#1a1a2e",
      accent_color: "#e94560",
      is_published: true,
      default_currency: "CLP",
    },
    { onConflict: "slug", ignoreDuplicates: false },
  );

  if (error) throw new Error(`upsert restaurant: ${error.message}`);

  // upsert may return null with service role — fetch by slug to get the id
  const { data: fetched, error: fetchError } = await db
    .from("restaurants")
    .select("id")
    .eq("slug", "demo")
    .single();

  if (fetchError) throw new Error(`fetch restaurant: ${fetchError.message}`);
  return fetched as { id: string };
}

async function clearMenu(restaurantId: string) {
  await db.from("menu_items").delete().eq("restaurant_id", restaurantId);
  await db.from("menu_categories").delete().eq("restaurant_id", restaurantId);
}

interface CategorySeed {
  name: Record<string, string>;
  items: ItemSeed[];
}

interface ItemSeed {
  name: Record<string, string>;
  description?: Record<string, string>;
  price: number;
  is_available: boolean;
  allergens?: string[];
  tags?: string[];
}

const MENU: CategorySeed[] = [
  {
    name: { es: "Entradas", en: "Starters" },
    items: [
      {
        name: { es: "Bruschetta de tomate", en: "Tomato bruschetta" },
        description: { es: "Pan artesanal con tomate cherry, albahaca y AOVE.", en: "Artisan bread with cherry tomato, basil and EVOO." },
        price: 4900,
        is_available: true,
        tags: ["vegetariano"],
      },
      {
        name: { es: "Tabla de quesos", en: "Cheese board" },
        description: { es: "Selección de quesos artesanales con mermelada y frutos secos.", en: "Artisan cheese selection with jam and nuts." },
        price: 8900,
        is_available: true,
        tags: ["vegetariano"],
      },
      {
        name: { es: "Ceviche de corvina", en: "Sea bass ceviche" },
        description: { es: "Corvina marinada en limón, con cebolla morada y cilantro.", en: "Lemon-marinated sea bass with red onion and cilantro." },
        price: 9900,
        is_available: true,
        allergens: ["pescado", "marisco"],
      },
    ],
  },
  {
    name: { es: "Principales", en: "Mains" },
    items: [
      {
        name: { es: "Risotto al funghi porcini", en: "Porcini mushroom risotto" },
        description: { es: "Arroz arborio cremoso con hongos porcini y parmesano.", en: "Creamy arborio rice with porcini mushrooms and parmesan." },
        price: 13900,
        is_available: true,
        tags: ["vegetariano"],
      },
      {
        name: { es: "Salmón a la plancha", en: "Grilled salmon" },
        description: { es: "Filete de salmón con puré de papas y salsa de alcaparras.", en: "Salmon fillet with mashed potato and caper sauce." },
        price: 15900,
        is_available: true,
        allergens: ["pescado"],
      },
      {
        name: { es: "Lomo saltado", en: "Stir-fried beef" },
        description: { es: "Carne salteada con tomate, cebolla y papas fritas. Servido con arroz.", en: "Sautéed beef with tomato, onion and fries. Served with rice." },
        price: 14900,
        is_available: true,
      },
      {
        name: { es: "Ravioles de ricotta", en: "Ricotta ravioli" },
        description: { es: "Pasta fresca rellena de ricotta y espinacas, salsa de mantequilla y salvia.", en: "Fresh pasta filled with ricotta and spinach, butter-sage sauce." },
        price: 12900,
        is_available: false,
        tags: ["vegetariano"],
        allergens: ["gluten", "lacteos", "huevo"],
      },
    ],
  },
  {
    name: { es: "Postres", en: "Desserts" },
    items: [
      {
        name: { es: "Tiramisú clásico", en: "Classic tiramisù" },
        description: { es: "Capas de mascarpone, café y bizcocho de soletilla.", en: "Layers of mascarpone, coffee and ladyfinger biscuits." },
        price: 5900,
        is_available: true,
        allergens: ["lacteos", "huevo", "gluten"],
      },
      {
        name: { es: "Panna cotta de vainilla", en: "Vanilla panna cotta" },
        description: { es: "Con coulis de frutos rojos.", en: "With red berry coulis." },
        price: 4900,
        is_available: true,
        allergens: ["lacteos"],
      },
    ],
  },
  {
    name: { es: "Bebidas", en: "Drinks" },
    items: [
      {
        name: { es: "Agua mineral", en: "Mineral water" },
        price: 1500,
        is_available: true,
        tags: ["vegano"],
      },
      {
        name: { es: "Limonada de la casa", en: "House lemonade" },
        description: { es: "Exprimida al momento con menta fresca.", en: "Freshly squeezed with fresh mint." },
        price: 3200,
        is_available: true,
        tags: ["vegano"],
      },
      {
        name: { es: "Copa de vino tinto", en: "Glass of red wine" },
        description: { es: "Carménère reserva del valle del Maipo.", en: "Carménère reserva from Maipo valley." },
        price: 4500,
        is_available: true,
      },
    ],
  },
];

async function seedMenu(restaurantId: string) {
  for (let catIndex = 0; catIndex < MENU.length; catIndex++) {
    const cat = MENU[catIndex];

    const { data: catData, error: catError } = await db
      .from("menu_categories")
      .insert({
        restaurant_id: restaurantId,
        name: cat.name,
        position: catIndex,
        is_active: true,
      })
      .select("id")
      .single();

    if (catError) throw new Error(`insert category "${JSON.stringify(cat.name)}": ${catError.message}`);

    const categoryId: string = catData.id;

    for (let itemIndex = 0; itemIndex < cat.items.length; itemIndex++) {
      const item = cat.items[itemIndex];
      const { error: itemError } = await db.from("menu_items").insert({
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: item.name,
        description: item.description ?? null,
        price: item.price,
        currency: "CLP",
        is_available: item.is_available,
        allergens: item.allergens ?? [],
        dietary_tags: item.tags ?? [],
        position: itemIndex,
      });

      if (itemError) throw new Error(`insert item "${JSON.stringify(item.name)}": ${itemError.message}`);
    }

    console.log(`  ✓ ${JSON.stringify(cat.name)} (${cat.items.length} items)`);
  }
}

// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding demo restaurant…");

  const restaurant = await upsertRestaurant();
  console.log(`  ✓ restaurant id: ${restaurant.id}`);

  await clearMenu(restaurant.id);
  console.log("  ✓ cleared existing menu");

  await seedMenu(restaurant.id);

  console.log("\nDone. Visit /r/demo to see the result.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
