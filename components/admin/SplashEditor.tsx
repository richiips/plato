"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateSplash } from "@/lib/actions/restaurants";
import type { Restaurant } from "@/types/database";

const BG_TYPES = [
  { id: "color", label: "Color sólido" },
  { id: "gradient", label: "Degradado" },
  { id: "pattern", label: "Patrón" },
  { id: "image", label: "Imagen" },
] as const;

const PATTERNS = [
  { id: "dots", label: "Puntos" },
  { id: "lines", label: "Líneas" },
  { id: "grid", label: "Grilla" },
  { id: "waves", label: "Ondas" },
  { id: "diagonal", label: "Diagonal" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Guardar
    </Button>
  );
}

export function SplashEditor({ restaurant }: { restaurant: Restaurant }) {
  const bound = updateSplash.bind(null, restaurant.id);
  const [, formAction] = useActionState(async (_: unknown, formData: FormData) => {
    await bound(formData);
    return null;
  }, null);

  return (
    <form action={formAction} className="space-y-8">

      {/* Toggle */}
      <section className="flex items-center justify-between rounded-xl border border-border bg-background p-5">
        <div>
          <p className="font-medium">Activar pantalla de entrada</p>
          <p className="text-sm text-muted-foreground">
            Si está desactivada, la carta abre directo sin splash.
          </p>
        </div>
        <input
          type="hidden"
          name="splash_enabled"
          id="splash_enabled_hidden"
          defaultValue={restaurant.splash_enabled ? "true" : "false"}
        />
        <Switch
          defaultChecked={restaurant.splash_enabled}
          onCheckedChange={(checked) => {
            const el = document.getElementById("splash_enabled_hidden") as HTMLInputElement;
            if (el) el.value = checked ? "true" : "false";
          }}
        />
      </section>

      {/* Fondo */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Fondo
        </h2>

        <div>
          <Label>Tipo de fondo</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BG_TYPES.map((t) => (
              <label
                key={t.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="splash_bg_type"
                  value={t.id}
                  defaultChecked={restaurant.splash_bg_type === t.id}
                  className="accent-primary"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Patrón (solo si elegiste "Patrón")</Label>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {PATTERNS.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="splash_pattern_id"
                  value={p.id}
                  defaultChecked={restaurant.splash_pattern_id === p.id}
                  className="accent-primary"
                />
                {p.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Imagen de fondo (solo si elegiste "Imagen")</Label>
          <div className="mt-2">
            <ImageUploader name="cover_image_url" defaultValue={restaurant.cover_image_url ?? ""} />
          </div>
        </div>
      </section>

      <Separator />

      {/* Contenido */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Contenido
        </h2>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            defaultValue={restaurant.tagline ?? ""}
            placeholder="Ej: Cocina de autor · Santiago"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="hours">Horarios</Label>
          <Input
            id="hours"
            name="hours"
            defaultValue={restaurant.hours ?? ""}
            placeholder="Ej: Mar–Dom 13:00–23:00"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Logo</Label>
          <div className="mt-2">
            <ImageUploader name="logo_url" defaultValue={restaurant.logo_url ?? ""} />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
