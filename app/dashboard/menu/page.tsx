import { getDashboardContext } from "@/lib/actions/dashboard";
import { createClient } from "@/lib/supabase/server";
import { MenuEditor } from "@/components/admin/MenuEditor";
import type { MenuCategory, MenuItem } from "@/types/database";

export default async function DashboardMenuPage() {
  const { restaurant } = await getDashboardContext();
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("position")
      .returns<MenuCategory[]>(),
    supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("position")
      .returns<MenuItem[]>(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Editor
        </p>
        <h1 className="mt-1 text-2xl font-bold">Menú</h1>
      </div>
      <MenuEditor
        restaurantId={restaurant.id}
        categories={categories ?? []}
        items={items ?? []}
      />
    </div>
  );
}
