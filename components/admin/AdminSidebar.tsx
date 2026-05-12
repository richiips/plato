"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/restaurants", label: "Restaurantes", Icon: Store },
  { href: "/admin/users", label: "Usuarios", Icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[#0A0A0A]/20 bg-[#FAFAF7]">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[#0A0A0A]/20 px-4">
        <span className="font-['Space_Grotesk',sans-serif] text-base font-bold tracking-tight text-[#0A0A0A]">Teist·admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-2">
        {NAV.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
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

      {/* Sign out */}
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
