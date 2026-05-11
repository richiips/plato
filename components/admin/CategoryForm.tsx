"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/lib/actions/menu";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Crear categoría
    </Button>
  );
}

export function CategoryForm({ restaurantId }: { restaurantId: string }) {
  const bound = createCategory.bind(null, restaurantId);
  const [, formAction] = useActionState(async (_: unknown, formData: FormData) => {
    await bound(formData);
    return null;
  }, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-48">
        <Label htmlFor="name_es">Nombre (español) *</Label>
        <Input id="name_es" name="name_es" placeholder="Ej: Entradas" required className="mt-1" />
      </div>
      <div className="flex-1 min-w-48">
        <Label htmlFor="name_en">Nombre (inglés)</Label>
        <Input id="name_en" name="name_en" placeholder="Ej: Starters" className="mt-1" />
      </div>
      <SubmitButton />
    </form>
  );
}
