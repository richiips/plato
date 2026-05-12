"use client";

import Image from "next/image";
import { Leaf, WheatOff, MilkOff, Flame, Star, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { MenuItem } from "@/types/database";
import type { DietaryTag, SupportedLanguage } from "@/types/menu";
import { getLocalizedText } from "@/types/menu";

const DIETARY_BADGE: Record<DietaryTag, { label: string; Icon: React.ElementType }> = {
  vegan: { label: "Vegano", Icon: Leaf },
  vegetarian: { label: "Vegetariano", Icon: Leaf },
  gluten_free: { label: "Sin gluten", Icon: WheatOff },
  lactose_free: { label: "Sin lactosa", Icon: MilkOff },
  spicy: { label: "Picante", Icon: Flame },
  signature: { label: "Firma del chef", Icon: Star },
  new: { label: "Nuevo", Icon: Sparkles },
};

function formatPrice(amount: number, currency: string): string {
  const noCents = ["CLP", "ARS", "PEN", "MXN"];
  const divisor = noCents.includes(currency) ? 1 : 100;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: divisor === 1 ? 0 : 2,
  }).format(amount / divisor);
}

interface ItemDrawerProps {
  item: MenuItem | null;
  onClose: () => void;
  language?: SupportedLanguage;
}

export function ItemDrawer({ item, onClose, language = "es" }: ItemDrawerProps) {
  const name = item ? getLocalizedText(item.name, language) : "";
  const description = item ? getLocalizedText(item.description ?? undefined, language) : "";
  const tags = (item?.dietary_tags ?? []) as DietaryTag[];
  const allergens = item?.allergens ?? [];

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[75vh] overflow-y-auto rounded-t-2xl p-0"
      >
        <SheetTitle className="sr-only">{item?.name ? getLocalizedText(item.name, language) : "Detalle"}</SheetTitle>
        {item && (
          <>
            {/* Image */}
            {item.main_image_url && (
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.main_image_url}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Name + price */}
              <div className="flex items-start justify-between gap-3">
                <h2
                  className="text-2xl font-bold leading-snug text-foreground"
                  style={{ fontFamily: "var(--menu-font-heading)" }}
                >
                  {name}
                </h2>
                <span
                  className="shrink-0 text-xl font-semibold"
                  style={{ color: "var(--menu-accent)" }}
                >
                  {formatPrice(item.price, item.currency)}
                </span>
              </div>

              {/* Compare at price */}
              {item.compare_at_price && item.compare_at_price > item.price && (
                <p className="mt-1 text-sm text-muted-foreground line-through">
                  {formatPrice(item.compare_at_price, item.currency)}
                </p>
              )}

              {/* Availability */}
              {!item.is_available && (
                <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  Agotado
                </span>
              )}

              {/* Description */}
              {description && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}

              {/* Dietary tags */}
              {tags.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Características
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const badge = DIETARY_BADGE[tag];
                      if (!badge) return null;
                      const { Icon } = badge;
                      return (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-foreground"
                        >
                          <Icon className="h-3 w-3" />
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {allergens.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Alérgenos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
