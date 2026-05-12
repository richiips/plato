"use client";

import { LayoutList, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onToggle: () => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={viewMode === "grid" ? "Cambiar a vista lista" : "Cambiar a vista cuadrícula"}
      className={cn(
        "shrink-0 flex items-center justify-center rounded-full border p-2 transition-colors",
        "border-border text-muted-foreground hover:border-muted-foreground",
      )}
    >
      {viewMode === "grid" ? (
        <LayoutList className="h-4 w-4" />
      ) : (
        <LayoutGrid className="h-4 w-4" />
      )}
    </button>
  );
}
