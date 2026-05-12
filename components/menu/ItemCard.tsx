"use client";

import Image from "next/image";
import { Plus, Check, Leaf, WheatOff, MilkOff, Flame, Star, Sparkles } from "lucide-react";
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
  viewMode: "list" | "grid";
  onSelect: (item: MenuItem) => void;
  inWishlist: boolean;
  onToggleWishlist: (itemId: string) => void;
}

export function ItemCard({ item, language, viewMode, onSelect, inWishlist, onToggleWishlist }: ItemCardProps) {
  const name = getLocalizedText(item.name, language);
  const description = getLocalizedText(item.description ?? undefined, language);
  const tags = item.dietary_tags as DietaryTag[];

  if (viewMode === "grid") {
    return (
      <article
        onClick={() => onSelect(item)}
        className={cn(
          "cursor-pointer overflow-hidden rounded-xl bg-card transition-all hover:shadow-sm active:scale-[0.98]",
          !item.is_available && "opacity-60",
        )}
        style={{ border: "var(--card-stroke)" }}
      >
        {/* Photo — square, full card width */}
        <div className="relative aspect-square w-full bg-muted">
          {item.main_image_url ? (
            <Image
              src={item.main_image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-3xl text-muted-foreground opacity-30">
              🍽
            </div>
          )}
          {!item.is_available && (
            <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
              Agotado
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="truncate text-sm font-semibold leading-snug text-card-foreground"
            style={{ fontFamily: "var(--menu-font-heading)" }}
          >
            {name}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-1">
            <span className="text-sm font-semibold" style={{ color: "var(--menu-accent)" }}>
              {formatPrice(item.price, item.currency)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(item.id); }}
              aria-label={inWishlist ? `Quitar ${name} de guardados` : `Guardar ${name}`}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-all hover:opacity-80 active:scale-95",
                inWishlist && "scale-90",
              )}
              style={{ backgroundColor: inWishlist ? "var(--foreground)" : "var(--menu-accent)" }}
            >
              {inWishlist ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (viewMode === "list") {
    return (
      <article
        onClick={() => onSelect(item)}
        className={cn(
          "flex cursor-pointer gap-3 rounded-xl bg-card p-3 transition-all hover:shadow-sm active:scale-[0.99]",
          !item.is_available && "opacity-60",
        )}
        style={{ border: "var(--card-stroke)" }}
      >
        {/* Photo */}
        {item.main_image_url && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={item.main_image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}

        {/* Text + price row */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
          <div>
            <h3
              className="font-semibold text-sm leading-snug text-card-foreground"
              style={{ fontFamily: "var(--menu-font-heading)" }}
            >
              {name}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            {!item.is_available && (
              <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                Agotado
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold" style={{ color: "var(--menu-accent)" }}>
              {formatPrice(item.price, item.currency)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(item.id); }}
              aria-label={inWishlist ? `Quitar ${name} de guardados` : `Guardar ${name}`}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-90",
                inWishlist && "scale-90",
              )}
              style={{ backgroundColor: inWishlist ? "var(--foreground)" : "var(--menu-accent)" }}
            >
              {inWishlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return null;
}
