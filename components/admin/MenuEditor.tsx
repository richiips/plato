"use client";

import { useState, useOptimistic, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SortableItemRow } from "./SortableItemRow";
import { ItemSheet } from "./ItemSheet";
import { reorderItems, toggleItemAvailable, deleteMenuItem } from "@/lib/actions/menu";
import type { MenuCategory, MenuItem, CurrencyCode } from "@/types/database";
import { getLocalizedText } from "@/types/menu";

interface MenuEditorProps {
  restaurantId: string;
  defaultCurrency: CurrencyCode;
  categories: MenuCategory[];
  items: MenuItem[];
}

export function MenuEditor({
  restaurantId,
  defaultCurrency,
  categories,
  items: initialItems,
}: MenuEditorProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id ?? "",
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [, startTransition] = useTransition();

  const [items, setOptimisticItems] = useOptimistic(
    initialItems,
    (state, update: { type: "reorder"; ids: string[] } | { type: "toggle"; id: string; val: boolean } | { type: "delete"; id: string }) => {
      if (update.type === "reorder") {
        const catItems = state.filter((i) => i.category_id === selectedCategoryId);
        const others = state.filter((i) => i.category_id !== selectedCategoryId);
        const reordered = update.ids.map((id) => catItems.find((i) => i.id === id)!);
        return [...others, ...reordered];
      }
      if (update.type === "toggle") {
        return state.map((i) => (i.id === update.id ? { ...i, is_available: update.val } : i));
      }
      if (update.type === "delete") {
        return state.filter((i) => i.id !== update.id);
      }
      return state;
    },
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const categoryItems = items.filter((i) => i.category_id === selectedCategoryId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categoryItems.findIndex((i) => i.id === active.id);
    const newIndex = categoryItems.findIndex((i) => i.id === over.id);
    const newOrder = arrayMove(categoryItems, oldIndex, newIndex);
    const newIds = newOrder.map((i) => i.id);

    startTransition(async () => {
      setOptimisticItems({ type: "reorder", ids: newIds });
      try {
        await reorderItems(restaurantId, newIds);
      } catch {
        toast.error("Error al reordenar");
      }
    });
  }

  async function handleToggle(item: MenuItem) {
    startTransition(async () => {
      setOptimisticItems({ type: "toggle", id: item.id, val: !item.is_available });
      try {
        await toggleItemAvailable(restaurantId, item.id, !item.is_available);
      } catch {
        setOptimisticItems({ type: "toggle", id: item.id, val: item.is_available });
        toast.error("Error al cambiar disponibilidad");
      }
    });
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`¿Eliminar "${getLocalizedText(item.name, "es")}"?`)) return;
    startTransition(async () => {
      setOptimisticItems({ type: "delete", id: item.id });
      try {
        await deleteMenuItem(restaurantId, item.id);
        toast.success("Plato eliminado");
      } catch {
        toast.error("Error al eliminar");
      }
    });
  }

  function openCreate() {
    setEditingItem(null);
    setSheetOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item);
    setSheetOpen(true);
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        <p className="text-sm font-medium text-foreground">No hay categorías todavía</p>
        <p className="mt-1 text-sm">Creá una categoría para empezar a armar la carta.</p>
        <Button className="mt-4" onClick={() => {
          const form = document.getElementById("new-category-form");
          form?.scrollIntoView({ behavior: "smooth" });
        }}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Crear primera categoría
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              cat.id === selectedCategoryId
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-muted"
            }`}
          >
            {getLocalizedText(cat.name, "es")}
            <span className="ml-1.5 text-xs opacity-60">
              {items.filter((i) => i.category_id === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium">
            {categoryItems.length} platos
          </span>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Agregar plato
          </Button>
        </div>

        {categoryItems.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No hay platos en esta categoría.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categoryItems.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-border">
                {categoryItems.map((item) => (
                  <SortableItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => handleToggle(item)}
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ItemSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        restaurantId={restaurantId}
        defaultCurrency={defaultCurrency}
        categories={categories}
        item={editingItem}
      />
    </div>
  );
}
