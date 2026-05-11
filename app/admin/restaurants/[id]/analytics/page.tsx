import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Restaurant } from "@/types/database";

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name")
    .eq("id", id)
    .single<Pick<Restaurant, "name">>();

  if (!restaurant) notFound();

  // Total views (all time)
  const { count: totalViews } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", id)
    .eq("event_type", "menu_view");

  // Views last 7 days
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: views7d } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", id)
    .eq("event_type", "menu_view")
    .gte("created_at", since7d);

  // Most viewed items
  const { data: itemEvents } = await supabase
    .from("analytics_events")
    .select("event_data")
    .eq("restaurant_id", id)
    .eq("event_type", "item_view")
    .limit(200);

  const stats = [
    { label: "Vistas totales", value: totalViews ?? 0 },
    { label: "Vistas últimos 7 días", value: views7d ?? 0 },
    { label: "Eventos registrados", value: (totalViews ?? 0) + (itemEvents?.length ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics — {restaurant.name}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-background p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value.toLocaleString("es-CL")}</p>
          </div>
        ))}
      </div>

      {(totalViews ?? 0) === 0 && (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          Aún no hay datos. Los eventos se registran cuando alguien visita la carta pública.
        </div>
      )}
    </div>
  );
}
