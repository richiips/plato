import { getDashboardContext } from "@/lib/actions/dashboard";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsEvent } from "@/types/database";

const EVENT_LABELS: Record<string, string> = {
  page_view: "Vista de carta",
  item_view: "Vista de ítem",
  filter_applied: "Filtro aplicado",
  language_changed: "Idioma cambiado",
};

export default async function DashboardAnalyticsPage() {
  const { restaurant } = await getDashboardContext();
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<AnalyticsEvent[]>();

  // Aggregate counts by event type
  const counts = (events ?? []).reduce<Record<string, number>>((acc, ev) => {
    acc[ev.event_type] = (acc[ev.event_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Analytics</h1>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(counts).map(([type, count]) => (
          <div key={type} className="rounded-xl border border-border bg-background p-5">
            <p className="text-xs text-muted-foreground">{EVENT_LABELS[type] ?? type}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{count}</p>
          </div>
        ))}
        {Object.keys(counts).length === 0 && (
          <p className="col-span-4 py-10 text-center text-sm text-muted-foreground">
            Aún no hay eventos registrados.
          </p>
        )}
      </div>

      {/* Recent events */}
      {(events?.length ?? 0) > 0 && (
        <div className="rounded-xl border border-border bg-background">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Últimos 100 eventos</h2>
          </div>
          <div className="divide-y divide-border">
            {events!.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {EVENT_LABELS[ev.event_type] ?? ev.event_type}
                  </span>
                  {ev.session_id && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {ev.session_id.slice(0, 8)}…
                    </span>
                  )}
                </div>
                <time className="text-xs text-muted-foreground">
                  {new Date(ev.created_at).toLocaleString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
