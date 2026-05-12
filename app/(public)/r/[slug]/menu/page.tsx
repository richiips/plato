import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MenuCategory, MenuItem, Restaurant } from "@/types/database";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { MenuClient } from "@/components/menu/MenuClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("restaurants")
      .select("slug")
      .eq("is_published", true)
      .eq("is_active", true)
      .returns<{ slug: string }[]>();

    return (data ?? []).map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export type CategoryWithItems = MenuCategory & { items: MenuItem[] };

async function getPageData(slug: string) {
  const supabase = createAdminClient();

  const [{ data: restaurant }, { data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .eq("is_active", true)
      .single<Restaurant>(),
    supabase
      .from("menu_categories")
      .select("*")
      .eq("is_active", true)
      .order("position")
      .returns<MenuCategory[]>(),
    supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("position")
      .returns<MenuItem[]>(),
  ]);

  return { restaurant, categories, items };
}

const FONT_CATALOG: Record<string, { googleName: string }> = {
  "cormorant-garamond": { googleName: "Cormorant+Garamond" },
  "playfair-display": { googleName: "Playfair+Display" },
  "dm-sans": { googleName: "DM+Sans" },
  "plus-jakarta-sans": { googleName: "Plus+Jakarta+Sans" },
  "lora": { googleName: "Lora" },
  "merriweather": { googleName: "Merriweather" },
  "space-grotesk": { googleName: "Space+Grotesk" },
  "bebas-neue": { googleName: "Bebas+Neue" },
};

function buildFontUrl(heading: string, body: string): string {
  const families = [...new Set([heading, body])]
    .filter((f) => f !== "system-ui")
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`)
    .join("&");
  return families ? `https://fonts.googleapis.com/css2?${families}&display=swap` : "";
}

function buildCatalogFontUrl(fontId: string | null, theme?: string | null): string {
  const resolvedId = !fontId && theme === "noir" ? "cormorant-garamond" : fontId;
  if (!resolvedId) return "";
  const entry = FONT_CATALOG[resolvedId];
  if (!entry) return "";
  return `https://fonts.googleapis.com/css2?family=${entry.googleName}:wght@400;500;600;700&display=swap`;
}

function resolveCardStroke(cardStroke: string | null): string | null {
  if (!cardStroke || cardStroke === "subtle") return null; // use CSS theme default
  if (cardStroke === "none") return "none";
  if (cardStroke === "bold") return "2px solid currentColor";
  return null;
}

export default async function CartaPublicaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { restaurant, categories, items } = await getPageData(slug);

  if (!restaurant) notFound();

  const categoriesWithItems: CategoryWithItems[] = (categories ?? [])
    .filter((c) => c.restaurant_id === restaurant.id)
    .map((cat) => ({
      ...cat,
      items: (items ?? []).filter((i) => i.category_id === cat.id),
    }))
    .filter((c) => c.items.length > 0);

  const theme = restaurant.theme ?? null;
  const fontUrl = buildFontUrl(restaurant.font_heading, restaurant.font_body);
  const catalogFontUrl = buildCatalogFontUrl(restaurant.font_family ?? null, theme);
  const cardStrokeOverride = resolveCardStroke(restaurant.card_stroke ?? null);

  // Resolved heading font: catalog font takes precedence, falls back to noir default, then font_heading column
  const resolvedFontHeading = restaurant.font_family
    ? (FONT_CATALOG[restaurant.font_family]?.googleName.replace(/\+/g, " ") ?? restaurant.font_heading)
    : theme === "noir"
      ? "Cormorant Garamond"
      : restaurant.font_heading;

  const cssVars = [
    `:root {`,
    `  --menu-primary: ${restaurant.primary_color};`,
    `  --menu-secondary: ${restaurant.secondary_color};`,
    `  --menu-accent: ${restaurant.accent_color};`,
    `  --menu-font-heading: '${resolvedFontHeading}', system-ui, sans-serif;`,
    `  --menu-font-body: '${restaurant.font_body}', system-ui, sans-serif;`,
    cardStrokeOverride ? `  --card-stroke: ${cardStrokeOverride};` : "",
    `}`,
  ].filter(Boolean).join("\n");

  return (
    <>
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}
      {catalogFontUrl && <link rel="stylesheet" href={catalogFontUrl} />}
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />

      <div
        className="min-h-screen bg-background"
        data-menu-theme={theme ?? undefined}
        style={{ fontFamily: "var(--menu-font-body)" }}
      >
        <MenuHeader restaurant={restaurant} />

        <main className="mx-auto max-w-3xl px-4 pb-16">
          <MenuClient
            categories={categoriesWithItems}
            supportedLanguages={restaurant.supported_languages}
          />
        </main>
      </div>
    </>
  );
}
