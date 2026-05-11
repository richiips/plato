import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MenuEditor } from "@/components/admin/MenuEditor";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { MenuImporter } from "@/components/admin/MenuImporter";
import type { Restaurant, MenuCategory, MenuItem } from "@/types/database";

export default async function MenuEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: restaurant }, { data: categories }, { data: items }] = await Promise.all([
    supabase.from("restaurants").select("*").eq("id", id).single<Restaurant>(),
    supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", id)
      .order("position")
      .returns<MenuCategory[]>(),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", id)
      .order("position")
      .returns<MenuItem[]>(),
  ]);

  if (!restaurant) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/restaurants/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {restaurant.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editor de menú</h1>
      </div>

      <MenuEditor
        restaurantId={id}
        defaultCurrency={restaurant.default_currency}
        categories={categories ?? []}
        items={items ?? []}
      />

      <div id="new-category-form" className="rounded-xl border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-semibold">Nueva categoría</h2>
        <CategoryForm restaurantId={id} />
      </div>

      <MenuImporter restaurantId={id} currency={restaurant.default_currency} />
    </div>
  );
}
