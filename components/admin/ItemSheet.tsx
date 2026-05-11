"use client";

import { useActionState, useEffect } from "react";
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
import type { MenuCategory, MenuItem, CurrencyCode } from "@/types/database";
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
  defaultCurrency: CurrencyCode;
  categories: MenuCategory[];
  item: MenuItem | null;
}

export function ItemSheet({
  open,
  onOpenChange,
  restaurantId,
  defaultCurrency,
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
      toast.success(isEdit ? "Plato actualizado" : "Plato creado");
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
          <SheetTitle>{isEdit ? "Editar plato" : "Nuevo plato"}</SheetTitle>
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
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                defaultValue={item?.price ?? 0}
                className="mt-1"
              />
              <FieldError messages={state.errors?.price} />
            </div>
            <div>
              <Label htmlFor="compare_at_price">Precio tachado</Label>
              <Input
                id="compare_at_price"
                name="compare_at_price"
                type="number"
                min={0}
                defaultValue={item?.compare_at_price ?? ""}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="currency">Moneda</Label>
              <select
                id="currency"
                name="currency"
                defaultValue={item?.currency ?? defaultCurrency}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {["CLP", "USD", "EUR", "PEN", "ARS", "MXN"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <Label>Imagen del plato</Label>
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

          {/* Extra */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="prep_time_minutes">Tiempo de preparación (min)</Label>
              <Input
                id="prep_time_minutes"
                name="prep_time_minutes"
                type="number"
                min={0}
                defaultValue={item?.prep_time_minutes ?? ""}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="calories">Calorías</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                min={0}
                defaultValue={item?.calories ?? ""}
                className="mt-1"
              />
            </div>
          </div>

          <SubmitButton label={isEdit ? "Guardar cambios" : "Crear plato"} />
        </form>
      </SheetContent>
    </Sheet>
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
