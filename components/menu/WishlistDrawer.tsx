"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MenuItem } from "@/types/database";
import type { SupportedLanguage } from "@/types/menu";
import { getLocalizedText } from "@/types/menu";

function formatPrice(amount: number, currency: string): string {
  const noCents = ["CLP", "ARS", "PEN", "MXN"];
  const divisor = noCents.includes(currency) ? 1 : 100;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: divisor === 1 ? 0 : 2,
  }).format(amount / divisor);
}

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  wishlist: string[];
  onRemove: (id: string) => void;
  language: SupportedLanguage;
}

export function WishlistDrawer({
  open,
  onClose,
  items,
  wishlist,
  onRemove,
  language,
}: WishlistDrawerProps) {
  const savedItems = items.filter((i) => wishlist.includes(i.id));

  // Auto-close when list becomes empty
  useEffect(() => {
    if (savedItems.length === 0 && open) {
      onClose();
    }
  }, [savedItems.length, open, onClose]);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[70vh] overflow-y-auto rounded-t-2xl p-0"
      >
        <div className="p-5">
          <SheetTitle className="mb-4 text-base font-semibold text-foreground">
            Mis guardados
          </SheetTitle>

          {savedItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nada guardado aún
            </p>
          ) : (
            <ul className="space-y-3">
              {savedItems.map((item) => {
                const name = getLocalizedText(item.name, language);
                return (
                  <li key={item.id} className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.main_image_url ? (
                        <Image
                          src={item.main_image_url}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-lg text-muted-foreground opacity-30">
                          🍽
                        </div>
                      )}
                    </div>

                    {/* Name + price */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {name}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--menu-accent)" }}
                      >
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      aria-label={`Quitar ${name}`}
                      className="shrink-0 p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
