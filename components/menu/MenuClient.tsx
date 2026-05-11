"use client";

import { useState, useMemo } from "react";
import { CategoryTabs } from "./CategoryTabs";
import { DietaryFilters } from "./DietaryFilters";
import { ItemCard } from "./ItemCard";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { CategoryWithItems } from "@/app/(public)/r/[slug]/menu/page";
import type { DietaryTag, SupportedLanguage } from "@/types/menu";
import { getLocalizedText } from "@/types/menu";

interface MenuClientProps {
  categories: CategoryWithItems[];
  supportedLanguages: string[];
}

export function MenuClient({ categories, supportedLanguages }: MenuClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const [activeFilters, setActiveFilters] = useState<DietaryTag[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>(
    (supportedLanguages[0] as SupportedLanguage) ?? "es",
  );

  const visibleCategories = useMemo(() => {
    const cats =
      activeCategoryId === null
        ? categories
        : categories.filter((c) => c.id === activeCategoryId);

    if (activeFilters.length === 0) return cats;

    return cats
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          activeFilters.every((tag) => item.dietary_tags.includes(tag)),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, activeCategoryId, activeFilters]);

  const toggleFilter = (tag: DietaryTag) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="mt-4">
      {/* Sticky nav: tabs + language switcher */}
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-2 pt-1 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <CategoryTabs
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
            language={language}
          />
          {supportedLanguages.length > 1 && (
            <LanguageSwitcher
              languages={supportedLanguages as SupportedLanguage[]}
              current={language}
              onChange={setLanguage}
            />
          )}
        </div>
      </div>

      {/* Dietary filters */}
      <DietaryFilters activeFilters={activeFilters} onToggle={toggleFilter} />

      {/* Items */}
      {visibleCategories.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-sm">No hay platos que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-8">
          {visibleCategories.map((cat) => (
            <section key={cat.id}>
              {/* Show category heading when viewing "all" */}
              {activeCategoryId === null && (
                <h2
                  className="mb-3 text-lg font-semibold"
                  style={{ fontFamily: "var(--menu-font-heading)" }}
                >
                  {getLocalizedText(cat.name, language)}
                </h2>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.items.map((item) => (
                  <ItemCard key={item.id} item={item} language={language} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
