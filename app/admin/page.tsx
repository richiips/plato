import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Store, Users, Eye, TrendingUp } from "lucide-react";

async function getMetrics() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const [
    { count: totalRestaurants },
    { count: publishedRestaurants },
    { count: totalItems },
    { data: analytics },
    { data: authUsers },
  ] = await Promise.all([
    supabase.from("restaurants").select("*", { count: "exact", head: true }),
    supabase
      .from("restaurants")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("menu_items").select("*", { count: "exact", head: true }),
    supabase
      .from("analytics_events")
      .select("created_at")
      .eq("event_type", "page_view")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  return {
    totalRestaurants: totalRestaurants ?? 0,
    publishedRestaurants: publishedRestaurants ?? 0,
    totalItems: totalItems ?? 0,
    viewsLast30: analytics?.length ?? 0,
    totalUsers: authUsers?.users?.length ?? 0,
  };
}

function StatCard({
  label,
  value,
  sub,
  Icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="rounded border border-[#0A0A0A]/15 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-[#0A0A0A]/40" />
      </div>
      <p className="mt-3 text-3xl font-medium tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const metrics = await getMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general de la plataforma</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Restaurantes"
          value={metrics.totalRestaurants}
          sub={`${metrics.publishedRestaurants} publicados`}
          Icon={Store}
        />
        <StatCard
          label="Usuarios"
          value={metrics.totalUsers}
          Icon={Users}
        />
        <StatCard
          label="Ítems en menús"
          value={metrics.totalItems}
          Icon={TrendingUp}
        />
        <StatCard
          label="Vistas (30 días)"
          value={metrics.viewsLast30}
          sub="page_view events"
          Icon={Eye}
        />
      </div>
    </div>
  );
}
