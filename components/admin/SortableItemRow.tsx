"use client";

import { useRef, useState, useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateItemPrice } from "@/lib/actions/menu";
import type { MenuItem } from "@/types/database";
import { getLocalizedText } from "@/types/menu";

interface SortableItemRowProps {
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatPrice(price: number, currency: string) {
  const noDecimals = ["CLP", "ARS", "PEN", "MXN"].includes(currency);
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(noDecimals ? price : price / 100);
}

export function SortableItemRow({ item, onToggle, onEdit, onDelete }: SortableItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [editingPrice, setEditingPrice] = useState(false);
  const [optimisticPrice, setOptimisticPrice] = useState(item.price);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const name = getLocalizedText(item.name, "es") || "Sin nombre";
  const priceFormatted = formatPrice(optimisticPrice, item.currency);

  function openPriceEdit() {
    setEditingPrice(true);
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  }

  function commitPrice() {
    const rawVal = Number(inputRef.current?.value ?? optimisticPrice);
    if (isNaN(rawVal) || rawVal < 0) {
      setEditingPrice(false);
      return;
    }
    const newPrice = Math.round(rawVal);
    if (newPrice === optimisticPrice) {
      setEditingPrice(false);
      return;
    }
    setEditingPrice(false);
    startTransition(async () => {
      const prev = optimisticPrice;
      setOptimisticPrice(newPrice);
      try {
        await updateItemPrice(item.id, newPrice);
      } catch {
        setOptimisticPrice(prev);
        toast.error("Error al actualizar el precio");
      }
    });
  }

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 px-4 py-3">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Name + inline price */}
      <div className="min-w-0 flex-1 flex items-center gap-3">
        <span className={`text-sm font-medium truncate ${!item.is_available ? "text-muted-foreground line-through" : ""}`}>
          {name}
        </span>

        {editingPrice ? (
          <input
            ref={inputRef}
            type="number"
            min={0}
            step={1}
            defaultValue={optimisticPrice}
            onBlur={commitPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitPrice();
              if (e.key === "Escape") setEditingPrice(false);
            }}
            className="w-24 rounded border border-primary bg-background px-2 py-0.5 text-sm font-mono focus:outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={openPriceEdit}
            title="Click para editar precio"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-2 tabular-nums"
          >
            {priceFormatted}
          </button>
        )}
      </div>

      {/* Sold-out toggle */}
      <div className="flex items-center gap-1.5">
        <Switch
          checked={item.is_available}
          onCheckedChange={onToggle}
          aria-label="Disponible"
        />
        <span className="w-16 text-right text-xs text-muted-foreground">
          {item.is_available ? "Disponible" : "Agotado"}
        </span>
      </div>

      {/* Actions */}
      <button
        onClick={onEdit}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Editar"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="text-muted-foreground hover:text-destructive"
        aria-label="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
