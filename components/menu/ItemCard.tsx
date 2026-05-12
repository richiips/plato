"use client";

import Image from "next/image";
import { Leaf, WheatOff, MilkOff, Flame, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface ItemCardProps {
  item: MenuItem;
  language: SupportedLanguage;
}

export function ItemCard({ item, language }: ItemCardProps) {
  const name = getLocalizedText(item.name, language);
  const description = getLocalizedText(item.description ?? undefined, language);
  const tags = item.dietary_tags as DietaryTag[];

  return (
    <article
      className={cn(
        "flex gap-3 rounded-xl bg-card p-3 transition-shadow hover:shadow-sm",
        !item.is_available && "opacity-60",
      )}
      style={{ border: "var(--card-stroke)" }}
    >
      {/* Text content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-card-foreground">{name}</h3>
            {!item.is_available && (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Agotado
              </span>
            )}
          </div>

          {description && (
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-semibold" style={{ color: "var(--menu-primary)" }}>
              {formatPrice(item.price, item.currency)}
            </span>
            {item.compare_at_price && item.compare_at_price > item.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(item.compare_at_price, item.currency)}
              </span>
            )}
          </div>

          {/* Dietary badges */}
          {tags.length > 0 && (
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              {tags.slice(0, 3).map((tag) => {
                const badge = DIETARY_BADGE[tag];
                if (!badge) return null;
                const { Icon } = badge;
                return (
                  <span
                    key={tag}
                    title={badge.label}
                    className="flex items-center justify-center rounded-full bg-muted p-1"
                  >
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Item image */}
      {item.main_image_url && (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.main_image_url}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}
    </article>
  );
}
