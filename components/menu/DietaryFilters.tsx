"use client";

import { Leaf, WheatOff, MilkOff, Flame, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DietaryTag } from "@/types/menu";

const FILTERS: { tag: DietaryTag; label: string; Icon: React.ElementType }[] = [
  { tag: "vegan", label: "Vegano", Icon: Leaf },
  { tag: "gluten_free", label: "Sin gluten", Icon: WheatOff },
  { tag: "lactose_free", label: "Sin lactosa", Icon: MilkOff },
  { tag: "spicy", label: "Picante", Icon: Flame },
  { tag: "signature", label: "Firma del chef", Icon: Star },
  { tag: "new", label: "Nuevo", Icon: Sparkles },
];

interface DietaryFiltersProps {
  activeFilters: DietaryTag[];
  onToggle: (tag: DietaryTag) => void;
}

export function DietaryFilters({ activeFilters, onToggle }: DietaryFiltersProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {FILTERS.map(({ tag, label, Icon }) => {
        const isActive = activeFilters.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "border-transparent text-white"
                : "border-border bg-background text-muted-foreground hover:border-muted-foreground",
            )}
            style={isActive ? { backgroundColor: "var(--menu-accent)" } : undefined}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
