import Link from "next/link";
import { ExternalLink, UtensilsCrossed, Paintbrush, Settings } from "lucide-react";
import { getDashboardContext } from "@/lib/actions/dashboard";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const { restaurant, member } = await getDashboardContext();
  const supabase = await createClient();

  // Stats
  const [{ count: categoryCount }, { count: itemCount }, { count: availableCount }] =
    await Promise.all([
      supabase
        .from("menu_categories")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id),
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id),
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id)
        .eq("is_available", true),
    ]);

  const QUICK_LINKS = [
    { href: "/dashboard/menu", label: "Editor de menú", Icon: UtensilsCrossed, desc: "Agregar y editar ítems" },
    { href: "/dashboard/branding", label: "Branding", Icon: Paintbrush, desc: "Colores, fuentes e imágenes" },
    { href: "/dashboard/settings", label: "Configuración", Icon: Settings, desc: "Datos del restaurante" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">/r/{restaurant.slug}</span>
            <Badge variant={restaurant.is_published ? "default" : "secondary"}>
              {restaurant.is_published ? "Publicado" : "Borrador"}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {member.role}
            </Badge>
          </div>
        </div>
        <Link
          href={`/r/${restaurant.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver carta
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Categorías", value: categoryCount ?? 0 },
          { label: "Ítems en total", value: itemCount ?? 0 },
          { label: "Ítems disponibles", value: availableCount ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-background p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-3">
        {QUICK_LINKS.map(({ href, label, Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary"
          >
            <div className="rounded-lg bg-muted p-2 group-hover:bg-primary/10">
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
