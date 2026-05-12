"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { CategoryWithItems } from "@/app/(public)/r/[slug]/menu/page";
import type { SupportedLanguage } from "@/types/menu";
import { getLocalizedText } from "@/types/menu";

interface CategoryTabsProps {
  categories: CategoryWithItems[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  language: SupportedLanguage;
  onScrollSpy?: (id: string) => void;
}

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
  language,
  onScrollSpy: _onScrollSpy,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId || !scrollRef.current) return;
    const activeBtn = scrollRef.current.querySelector(`[data-cat-id="${activeId}"]`);
    if (activeBtn) {
      (activeBtn as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  if (categories.length <= 1) return null;

  return (
    <div
      ref={scrollRef}
      className="flex min-w-0 flex-1 gap-1 overflow-x-auto scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {categories.map((cat) => {
        const isActive = activeId === cat.id;
        return (
          <button
            key={cat.id}
            data-cat-id={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-white"
                : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            style={
              isActive
                ? { backgroundColor: "var(--menu-primary)", color: "var(--menu-secondary)" }
                : undefined
            }
          >
            {cat.icon && <span className="mr-1">{cat.icon}</span>}
            {getLocalizedText(cat.name, language)}
          </button>
        );
      })}
    </div>
  );
}
