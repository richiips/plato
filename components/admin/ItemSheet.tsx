"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMenuItem, updateMenuItem } from "@/lib/actions/menu";
import type { MenuCategory, MenuItem } from "@/types/database";
import type { DietaryTag } from "@/types/menu";
import { getLocalizedText } from "@/types/menu";
import { ImageUploader } from "./ImageUploader";

const DIETARY_OPTIONS: { value: DietaryTag; label: string }[] = [
  { value: "vegan", label: "Vegano" },
  { value: "vegetarian", label: "Vegetariano" },
  { value: "gluten_free", label: "Sin gluten" },
  { value: "lactose_free", label: "Sin lactosa" },
  { value: "spicy", label: "Picante" },
  { value: "signature", label: "Firma del chef" },
  { value: "new", label: "Nuevo" },
];

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-destructive">{messages[0]}</p>;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

interface ItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  categories: MenuCategory[];
  item: MenuItem | null;
}

export function ItemSheet({
  open,
  onOpenChange,
  restaurantId,
  categories,
  item,
}: ItemSheetProps) {
  const isEdit = !!item;

  const action = isEdit
    ? updateMenuItem.bind(null, restaurantId, item.id)
    : createMenuItem.bind(null, restaurantId);

  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.message === "ok") {
      toast.success(isEdit ? "Ítem actualizado" : "Ítem creado");
      onOpenChange(false);
    }
  }, [state.message, isEdit, onOpenChange]);

  const currentDietaryTags = (item?.dietary_tags as DietaryTag[]) ?? [];
  const itemName = item ? ((item.name as Record<string, string>)["es"] ?? "") : "";
  const itemNameEn = item ? ((item.name as Record<string, string>)["en"] ?? "") : "";
  const itemDesc = item
    ? ((item.description as Record<string, string> | null)?.["es"] ?? "")
    : "";
  const itemDescEn = item
    ? ((item.description as Record<string, string> | null)?.["en"] ?? "")
    : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar ítem" : "Nuevo ítem"}</SheetTitle>
        </SheetHeader>

        <form action={formAction} className="mt-6 space-y-5">
          {state.message && state.message !== "ok" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          {/* Category */}
          <div>
            <Label htmlFor="category_id">Categoría *</Label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={item?.category_id ?? categories[0]?.id}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getLocalizedText(cat.name, "es")}
                </option>
              ))}
            </select>
            <FieldError messages={state.errors?.category_id} />
          </div>

          {/* Name ES + EN */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="name_es">Nombre (ES) *</Label>
              <Input id="name_es" name="name_es" defaultValue={itemName} className="mt-1" />
              <FieldError messages={state.errors?.name_es} />
            </div>
            <div>
              <Label htmlFor="name_en">Nombre (EN)</Label>
              <Input id="name_en" name="name_en" defaultValue={itemNameEn} className="mt-1" />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="description_es">Descripción (ES)</Label>
              <Textarea
                id="description_es"
                name="description_es"
                defaultValue={itemDesc}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description_en">Descripción (EN)</Label>
              <Textarea
                id="description_en"
                name="description_en"
                defaultValue={itemDescEn}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Price */}
          <PriceFields
            defaultPrice={item?.price ?? 0}
            defaultCompareAtPrice={item?.compare_at_price ?? null}
            priceErrors={state.errors?.price}
          />

          {/* Image upload */}
          <div>
            <Label>Imagen del ítem</Label>
            <div className="mt-2">
              <ImageUploader
                name="main_image_url"
                defaultValue={item?.main_image_url}
                label="Subir imagen"
              />
            </div>
          </div>

          {/* Dietary tags */}
          <div>
            <Label>Etiquetas dietéticas</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="checkbox"
                    name="dietary_tags_check"
                    value={value}
                    defaultChecked={currentDietaryTags.includes(value)}
                    className="rounded"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            {/* Hidden field with joined tags — populated via JS */}
            <DietaryTagsHidden defaultTags={currentDietaryTags} />
          </div>

          <SubmitButton label={isEdit ? "Guardar cambios" : "Crear ítem"} />
        </form>
      </SheetContent>
    </Sheet>
  );
}

function formatCLP(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function PriceFields({
  defaultPrice,
  defaultCompareAtPrice,
  priceErrors,
}: {
  defaultPrice: number;
  defaultCompareAtPrice: number | null;
  priceErrors?: string[];
}) {
  const [priceDisplay, setPriceDisplay] = useState(
    defaultPrice > 0 ? String(defaultPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "",
  );
  const [compareDisplay, setCompareDisplay] = useState(
    defaultCompareAtPrice != null
      ? String(defaultCompareAtPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "",
  );

  // The actual numeric values submitted to the server action
  const priceNumeric = priceDisplay.replace(/\./g, "");
  const compareNumeric = compareDisplay.replace(/\./g, "");

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="price_display">Precio CLP *</Label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <Input
            id="price_display"
            value={priceDisplay}
            onFocus={(e) => {
              if (e.target.value === "0") setPriceDisplay("");
            }}
            onChange={(e) => setPriceDisplay(formatCLP(e.target.value))}
            className="mt-0 pl-6 font-mono"
            inputMode="numeric"
            placeholder="0"
          />
        </div>
        <input type="hidden" name="price" value={priceNumeric} />
        <FieldError messages={priceErrors} />
      </div>
      <div>
        <Label htmlFor="compare_display">Precio tachado CLP</Label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <Input
            id="compare_display"
            value={compareDisplay}
            onFocus={(e) => {
              if (e.target.value === "0") setCompareDisplay("");
            }}
            onChange={(e) => setCompareDisplay(formatCLP(e.target.value))}
            className="mt-0 pl-6 font-mono"
            inputMode="numeric"
            placeholder="Opcional"
          />
        </div>
        <input type="hidden" name="compare_at_price" value={compareNumeric} />
      </div>
      {/* Always submit CLP */}
      <input type="hidden" name="currency" value="CLP" />
    </div>
  );
}

function DietaryTagsHidden({ defaultTags }: { defaultTags: DietaryTag[] }) {
  return (
    <input
      type="hidden"
      name="dietary_tags"
      defaultValue={defaultTags.join(",")}
      data-dietary-hidden
    />
  );
}
