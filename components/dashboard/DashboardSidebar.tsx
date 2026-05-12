"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  UtensilsCrossed,
  Paintbrush,
  Settings,
  BarChart2,
  ExternalLink,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { selectRestaurant } from "@/lib/actions/dashboard";
import type { Restaurant } from "@/types/database";

const NAV = [
  { href: "/dashboard/menu", label: "Menú", Icon: UtensilsCrossed },
  { href: "/dashboard/branding", label: "Branding", Icon: Paintbrush },
  { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart2 },
  { href: "/dashboard/settings", label: "Configuración", Icon: Settings },
];

interface DashboardSidebarProps {
  restaurant: Restaurant;
  restaurants: Restaurant[];
}

export function DashboardSidebar({ restaurant, restaurants }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [switching, startTransition] = useTransition();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleRestaurantChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await selectRestaurant(e.target.value);
    });
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[#0A0A0A]/20 bg-[#FAFAF7]">
      {/* Restaurant selector */}
      <div className="border-b border-[#0A0A0A]/20 p-3">
        {restaurants.length > 1 ? (
          <div className="relative">
            <select
              value={restaurant.id}
              onChange={handleRestaurantChange}
              disabled={switching}
              className="w-full appearance-none rounded-md border border-input bg-background py-1.5 pl-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        ) : (
          <p className="truncate text-sm font-semibold">{restaurant.name}</p>
        )}

        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              restaurant.is_published ? "bg-green-500" : "bg-amber-400",
            )}
          />
          <span className="text-xs text-muted-foreground">
            {restaurant.is_published ? "Publicado" : "Borrador"}
          </span>
          <Link
            href={`/r/${restaurant.slug}`}
            target="_blank"
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-2">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100",
                active
                  ? "bg-[#D4F000] text-[#0A0A0A]"
                  : "text-[#0A0A0A]/50 hover:bg-[#0A0A0A]/8 hover:text-[#0A0A0A]",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#0A0A0A]/20 p-2">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-[#0A0A0A]/50 transition-colors duration-100 hover:bg-[#0A0A0A]/8 hover:text-[#0A0A0A]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
