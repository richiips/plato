"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateSplash } from "@/lib/actions/restaurants";
import type { Restaurant } from "@/types/database";
import Link from "next/link";

type BgType = "color" | "gradient" | "pattern" | "image";

const BG_TYPES: { id: BgType; label: string }[] = [
  { id: "color", label: "Color sólido" },
  { id: "gradient", label: "Degradado" },
  { id: "image", label: "Imagen" },
];

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

/** Synced native colour picker + hex text input */
function ColorInput({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue || "#000000");

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value.match(/^#[0-9a-fA-F]{6}$/) ? value : "#000000"}
          onChange={handleColorChange}
          className="h-9 w-10 cursor-pointer rounded-md border border-input p-0.5"
          aria-label={`Selector de color: ${label}`}
        />
        <Input
          name={name}
          value={value}
          onChange={handleTextChange}
          className="font-mono"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function SplashEditor({ restaurant }: { restaurant: Restaurant }) {
  const [bgType, setBgType] = useState<BgType>(
    (restaurant.splash_bg_type as BgType) === "pattern" ? "color" : (restaurant.splash_bg_type as BgType) ?? "gradient",
  );
  const [patternEnabled, setPatternEnabled] = useState(
    restaurant.splash_bg_type === "pattern",
  );
  const [patternId, setPatternId] = useState(restaurant.splash_pattern_id ?? "dots");
  const [saved, setSaved] = useState(false);

  const bound = updateSplash.bind(null, restaurant.id);
  const [, formAction] = useActionState(async (_: unknown, formData: FormData) => {
    // Inject the resolved bg type (pattern = overlay, not a separate type)
    formData.set("splash_bg_type", patternEnabled ? "pattern" : bgType);
    formData.set("splash_pattern_id", patternId);
    await bound(formData);
    toast.success("Splash guardado");
    setSaved(true);
    setTimeout(() => setSaved(false), 5000);
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

        {/* Tipo de fondo (sin "Patrón" — es overlay separado) */}
        <div>
          <Label>Tipo de fondo</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {BG_TYPES.map((t) => (
              <label
                key={t.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-checked:border-primary has-checked:bg-primary/5"
              >
                <input
                  type="radio"
                  name="_bg_type_ui"
                  value={t.id}
                  checked={bgType === t.id}
                  onChange={() => setBgType(t.id)}
                  className="accent-primary"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* Conditional controls per type */}
        {bgType === "color" && (
          <div className="rounded-lg border border-border bg-background p-4">
            <ColorInput
              name="splash_color"
              label="Color de fondo"
              defaultValue={restaurant.splash_color ?? "#000000"}
            />
          </div>
        )}

        {bgType === "gradient" && (
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorInput
                name="splash_gradient_from"
                label="Color inicio"
                defaultValue={restaurant.splash_gradient_from ?? "#000000"}
              />
              <ColorInput
                name="splash_gradient_to"
                label="Color fin"
                defaultValue={restaurant.splash_gradient_to ?? "#333333"}
              />
            </div>
          </div>
        )}

        {bgType === "image" && (
          <div className="rounded-lg border border-border bg-background p-4 space-y-3">
            <ImageUploader
              name="cover_image_url"
              defaultValue={restaurant.cover_image_url ?? ""}
              label="Subir imagen de fondo"
            />
            <p className="text-xs text-muted-foreground">
              Recomendamos imagen vertical, mínimo 1080×1920px.
            </p>
          </div>
        )}

        {/* Pattern overlay — separate from the background type */}
        <Separator />
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-5">
          <div>
            <p className="font-medium text-sm">Aplicar patrón encima del fondo</p>
            <p className="text-sm text-muted-foreground">
              El patrón se superpone sobre cualquier tipo de fondo.
            </p>
          </div>
          <Switch
            checked={patternEnabled}
            onCheckedChange={setPatternEnabled}
          />
        </div>

        {patternEnabled && (
          <div>
            <Label>Patrón</Label>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {PATTERNS.map((p) => (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm has-checked:border-primary has-checked:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="_pattern_id_ui"
                    value={p.id}
                    checked={patternId === p.id}
                    onChange={() => setPatternId(p.id)}
                    className="accent-primary"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
        )}
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

      <div className="flex items-center justify-between gap-4">
        <SubmitButton />
        {saved && (
          <Link
            href={`/r/${restaurant.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Ver splash
          </Link>
        )}
      </div>
    </form>
  );
}
