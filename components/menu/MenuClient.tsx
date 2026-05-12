"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { BookmarkCheck } from "lucide-react";
import { CategoryTabs } from "./CategoryTabs";
import { FilterButton } from "./FilterButton";
import { ViewToggle } from "./ViewToggle";
import { ItemCard } from "./ItemCard";
import { ItemDrawer } from "./ItemDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { CategoryWithItems } from "@/app/(public)/r/[slug]/menu/page";
import type { DietaryTag, SupportedLanguage } from "@/types/menu";
import { getLocalizedText } from "@/types/menu";
import type { MenuItem } from "@/types/database";

interface MenuClientProps {
  categories: CategoryWithItems[];
  supportedLanguages: string[];
}

export function MenuClient({ categories, supportedLanguages }: MenuClientProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<DietaryTag[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>(
    (supportedLanguages[0] as SupportedLanguage) ?? "es",
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const toggleWishlist = useCallback((itemId: string) => {
    setWishlist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  }, []);

  // Used to prevent scroll-spy from overriding a tab click
  const isClickScrolling = useRef(false);
  // Ref map for category sections
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }, []);

  // Scroll-spy: IntersectionObserver watching all category sections
  useEffect(() => {
    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section-id");
          if (id) ratioMap.set(id, entry.intersectionRatio);
        });

        // Pick the section with the highest intersection ratio
        let topId: string | null = null;
        let topRatio = 0;
        ratioMap.forEach((ratio, id) => {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        });

        if (topId && topRatio > 0) {
          setActiveCategoryId(topId);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] },
    );

    sectionRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [categories]);

  const handleTabSelect = (id: string | null) => {
    setActiveCategoryId(id);
    if (!id) return;

    // Prevent scroll-spy from fighting the tab click
    isClickScrolling.current = true;
    const el = sectionRefs.current.get(id);
    if (el) {
      // 14px for collapsed header + 48px for sticky tabs bar
      const offset = 14 + 48 + 8;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const allItems = useMemo(() => categories.flatMap((c) => c.items), [categories]);

  const availableTags = useMemo(() => {
    const tags = new Set<DietaryTag>();
    categories.forEach((cat) =>
      cat.items.forEach((item) =>
        (item.dietary_tags as DietaryTag[]).forEach((t) => tags.add(t)),
      ),
    );
    return Array.from(tags);
  }, [categories]);

  const visibleCategories = useMemo(() => {
    if (activeFilters.length === 0) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          activeFilters.every((tag) => item.dietary_tags.includes(tag)),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, activeFilters]);

  const toggleFilter = (tag: DietaryTag) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="mt-0">
      {/* Sticky controls bar: tabs + filter + view toggle */}
      <div className="sticky top-14 z-10 -mx-4 bg-background/95 backdrop-blur-sm px-4 pb-2 pt-2 border-b border-border">
        <div className="flex items-center gap-2">
          <CategoryTabs
            categories={categories}
            activeId={activeCategoryId}
            onSelect={handleTabSelect}
            language={language}
          />
          {supportedLanguages.length > 1 && (
            <LanguageSwitcher
              languages={supportedLanguages as SupportedLanguage[]}
              current={language}
              onChange={setLanguage}
            />
          )}
          <FilterButton activeFilters={activeFilters} onToggle={toggleFilter} availableTags={availableTags} />
          <ViewToggle
            viewMode={viewMode}
            onToggle={() => setViewMode((v) => (v === "list" ? "grid" : "list"))}
          />
        </div>
      </div>

      {/* Items */}
      {visibleCategories.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-sm">No hay platos que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-8">
          {visibleCategories.map((cat) => (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              data-section-id={cat.id}
              ref={setSectionRef(cat.id)}
            >
              <h2
                className="mb-3 text-lg font-semibold"
                style={{ fontFamily: "var(--menu-font-heading)" }}
              >
                {getLocalizedText(cat.name, language)}
              </h2>
              <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
                {cat.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    language={language}
                    viewMode={viewMode}
                    onSelect={setSelectedItem}
                    inWishlist={wishlist.includes(item.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Floating wishlist button */}
      {wishlist.length > 0 && (
        <button
          onClick={() => setWishlistOpen(true)}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-background shadow-lg transition-transform active:scale-95"
        >
          <BookmarkCheck className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">{wishlist.length} guardados</span>
        </button>
      )}

      {/* Wishlist drawer */}
      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={allItems}
        wishlist={wishlist}
        onRemove={(id) => setWishlist((prev) => prev.filter((i) => i !== id))}
        language={language}
      />

      {/* Item detail drawer */}
      <ItemDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        language={language}
      />
    </div>
  );
}
