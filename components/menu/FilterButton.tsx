"use client";

import { SlidersHorizontal, Leaf, WheatOff, MilkOff, Flame, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { DietaryTag } from "@/types/menu";

const FILTERS: { tag: DietaryTag; label: string; Icon: React.ElementType }[] = [
  { tag: "vegan", label: "Vegano", Icon: Leaf },
  { tag: "gluten_free", label: "Sin gluten", Icon: WheatOff },
  { tag: "lactose_free", label: "Sin lactosa", Icon: MilkOff },
  { tag: "spicy", label: "Picante", Icon: Flame },
  { tag: "signature", label: "Firma del chef", Icon: Star },
  { tag: "new", label: "Nuevo", Icon: Sparkles },
];

interface FilterButtonProps {
  activeFilters: DietaryTag[];
  onToggle: (tag: DietaryTag) => void;
  availableTags: DietaryTag[];
}

export function FilterButton({ activeFilters, onToggle, availableTags }: FilterButtonProps) {
  const hasActive = activeFilters.length > 0;
  const visibleFilters = FILTERS.filter((f) => availableTags.includes(f.tag));

  if (visibleFilters.length === 0) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Filtros"
          className={cn(
            "relative shrink-0 flex items-center justify-center rounded-full border p-2 transition-colors",
            hasActive
              ? "border-foreground text-foreground"
              : "border-border text-muted-foreground hover:border-muted-foreground",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {hasActive && (
            <span
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: "var(--menu-accent)" }}
            >
              {activeFilters.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="flex flex-wrap gap-2">
          {visibleFilters.map(({ tag, label, Icon }) => {
            const isActive = activeFilters.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onToggle(tag)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-transparent text-white"
                    : "border-border bg-background text-muted-foreground hover:border-muted-foreground",
                )}
                style={isActive ? { backgroundColor: "var(--menu-accent)" } : undefined}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
