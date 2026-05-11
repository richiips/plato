"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "./ImageUploader";
import { updateBranding } from "@/lib/actions/restaurants";
import type { Restaurant } from "@/types/database";

const FONTS = [
  "Inter",
  "Playfair Display",
  "Montserrat",
  "Lora",
  "Raleway",
  "Poppins",
  "Merriweather",
  "system-ui",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Guardar branding
    </Button>
  );
}

interface BrandingEditorProps {
  restaurant: Restaurant;
}

export function BrandingEditor({ restaurant }: BrandingEditorProps) {
  const [primary, setPrimary] = useState(restaurant.primary_color);
  const [secondary, setSecondary] = useState(restaurant.secondary_color);
  const [accent, setAccent] = useState(restaurant.accent_color);
  const [fontHeading, setFontHeading] = useState(restaurant.font_heading);
  const [fontBody, setFontBody] = useState(restaurant.font_body);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateBranding(restaurant.id, formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        toast.success("Branding guardado");
      } catch {
        toast.error("Error al guardar");
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {saved && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Cambios guardados.
          </div>
        )}

        {/* Images */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Imágenes
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Logo</Label>
              <div className="mt-2">
                <ImageUploader
                  name="logo_url"
                  defaultValue={restaurant.logo_url}
                  label="Subir logo"
                />
              </div>
            </div>
            <div>
              <Label>Imagen de portada</Label>
              <div className="mt-2">
                <ImageUploader
                  name="cover_image_url"
                  defaultValue={restaurant.cover_image_url}
                  label="Subir portada"
                />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Colors */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Colores
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { id: "primary_color", label: "Primario", value: primary, set: setPrimary },
              { id: "secondary_color", label: "Secundario", value: secondary, set: setSecondary },
              { id: "accent_color", label: "Acento", value: accent, set: setAccent },
            ].map(({ id, label, value, set }) => (
              <div key={id}>
                <Label htmlFor={id}>{label}</Label>
                <div className="mt-1 flex gap-2">
                  <input
                    id={id}
                    name={id}
                    type="color"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded-md border border-input p-1"
                  />
                  <Input
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="font-mono"
                    maxLength={7}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Fonts */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tipografía
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { id: "font_heading", label: "Fuente títulos", value: fontHeading, set: setFontHeading },
              { id: "font_body", label: "Fuente cuerpo", value: fontBody, set: setFontBody },
            ].map(({ id, label, value, set }) => (
              <div key={id}>
                <Label htmlFor={id}>{label}</Label>
                <select
                  id={id}
                  name={id}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f} style={{ fontFamily: f }}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        <SubmitButton />
      </form>

      {/* Live preview */}
      <div className="sticky top-6 self-start">
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Preview</p>
        <div
          className="overflow-hidden rounded-2xl border border-border shadow-sm"
          style={
            {
              "--menu-primary": primary,
              "--menu-secondary": secondary,
              "--menu-accent": accent,
              fontFamily: fontBody,
            } as React.CSSProperties
          }
        >
          {/* Cover strip */}
          <div
            className="h-24 flex items-end px-4 pb-3"
            style={{ backgroundColor: primary }}
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: secondary, color: primary }}
            >
              {restaurant.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Content area */}
          <div className="p-4 space-y-3" style={{ backgroundColor: secondary }}>
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: fontHeading, color: primary }}
            >
              {restaurant.name}
            </h3>

            {/* Fake category tabs */}
            <div className="flex gap-2">
              {["Entrantes", "Principales", "Postres"].map((cat, i) => (
                <span
                  key={cat}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={
                    i === 0
                      ? { backgroundColor: accent, color: "#fff" }
                      : { backgroundColor: primary + "15", color: primary }
                  }
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Fake item card */}
            <div
              className="rounded-xl p-3 flex justify-between items-center"
              style={{ backgroundColor: primary + "08" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: primary }}>
                  Plato de ejemplo
                </p>
                <p className="text-xs mt-0.5" style={{ color: primary + "99" }}>
                  Descripción del plato
                </p>
              </div>
              <span className="text-sm font-semibold" style={{ color: accent }}>
                $12.000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
