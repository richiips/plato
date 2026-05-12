"use client";

import { useState, useEffect, useTransition } from "react";
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

// ── Font catalog ────────────────────────────────────────────────────────────

const FONT_CATALOG = [
  { id: "cormorant-garamond", name: "Cormorant Garamond", theme: "Noir", googleName: "Cormorant+Garamond" },
  { id: "playfair-display", name: "Playfair Display", theme: "Noir", googleName: "Playfair+Display" },
  { id: "dm-sans", name: "DM Sans", theme: "Blanco", googleName: "DM+Sans" },
  { id: "plus-jakarta-sans", name: "Plus Jakarta Sans", theme: "Blanco", googleName: "Plus+Jakarta+Sans" },
  { id: "lora", name: "Lora", theme: "Cálido", googleName: "Lora" },
  { id: "merriweather", name: "Merriweather", theme: "Cálido", googleName: "Merriweather" },
  { id: "space-grotesk", name: "Space Grotesk", theme: "Gráfico", googleName: "Space+Grotesk" },
  { id: "bebas-neue", name: "Bebas Neue", theme: "Gráfico", googleName: "Bebas+Neue" },
] as const;

type FontId = typeof FONT_CATALOG[number]["id"];
const FONT_THEMES = ["Noir", "Blanco", "Cálido", "Gráfico"] as const;

// ── WCAG contrast check ─────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const L1 = relativeLuminance(...rgb1);
  const L2 = relativeLuminance(...rgb2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Submit button ───────────────────────────────────────────────────────────

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

// ── Theme options ────────────────────────────────────────────────────────────

type ThemeId = "noir" | "blanco" | "calido" | "grafico";

const THEME_OPTIONS: {
  id: ThemeId;
  label: string;
  bg: string;
  fg: string;
  fontFamily: string;
}[] = [
  { id: "noir", label: "Noir", bg: "#0D0C0C", fg: "#EDE9DF", fontFamily: "Georgia, serif" },
  { id: "blanco", label: "Blanco", bg: "#FAFAF7", fg: "#0A0A0A", fontFamily: "system-ui, sans-serif" },
  { id: "calido", label: "Cálido", bg: "#F5EFE0", fg: "#2A1F14", fontFamily: "Georgia, serif" },
  { id: "grafico", label: "Gráfico", bg: "#0A0A0A", fg: "#D4F000", fontFamily: "'Arial Black', sans-serif" },
];

// ── Component ───────────────────────────────────────────────────────────────

export function BrandingEditor({ restaurant }: BrandingEditorProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | "">(
    (restaurant.theme as ThemeId) ?? "",
  );
  const [accent, setAccent] = useState(restaurant.accent_color ?? "#D4F000");
  const [fontId, setFontId] = useState<FontId | "">(
    (restaurant.font_family as FontId) ?? "",
  );
  const [cardStroke, setCardStroke] = useState<string>(
    restaurant.card_stroke ?? "subtle",
  );
  const [contrastWarning, setContrastWarning] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Dynamically load preview font via Google Fonts
  useEffect(() => {
    if (!fontId) return;
    const entry = FONT_CATALOG.find((f) => f.id === fontId);
    if (!entry) return;
    const linkId = `font-preview-${fontId}`;
    if (document.getElementById(linkId)) return;
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${entry.googleName}:wght@400;600;700&display=swap`;
    document.head.appendChild(link);
  }, [fontId]);

  // WCAG contrast check against white (#ffffff) as a representative background
  useEffect(() => {
    const ratio = contrastRatio(accent, "#ffffff");
    if (ratio !== null && ratio < 4.5) {
      setContrastWarning(
        `Contraste insuficiente contra fondo claro (${ratio.toFixed(1)}:1 — mínimo WCAG AA: 4.5:1). Puede ser difícil de leer.`,
      );
    } else {
      setContrastWarning(null);
    }
  }, [accent]);

  function handleAccentText(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setAccent(v);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateBranding(restaurant.id, formData);
        toast.success("Branding guardado");
      } catch {
        toast.error("Error al guardar");
      }
    });
  }

  const previewFont = fontId
    ? (FONT_CATALOG.find((f) => f.id === fontId)?.name ?? "inherit")
    : "inherit";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tema visual
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {/* No theme option */}
            <label className="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value=""
                checked={selectedTheme === ""}
                onChange={() => setSelectedTheme("")}
                className="sr-only"
              />
              <div
                className={`flex h-16 items-center justify-center rounded-lg border-2 text-xs font-medium transition-colors ${
                  selectedTheme === ""
                    ? "border-foreground bg-muted text-foreground"
                    : "border-border bg-muted/40 text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                Auto
              </div>
            </label>

            {THEME_OPTIONS.map((t) => (
              <label key={t.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={t.id}
                  checked={selectedTheme === t.id}
                  onChange={() => setSelectedTheme(t.id)}
                  className="sr-only"
                />
                <div
                  className={`flex h-16 items-end justify-start overflow-hidden rounded-lg border-2 px-2 pb-2 transition-all ${
                    selectedTheme === t.id ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: t.bg }}
                >
                  <span
                    className="text-xs font-semibold leading-none"
                    style={{ fontFamily: t.fontFamily, color: t.fg }}
                  >
                    {t.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>

        <Separator />

        {/* Logo */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Logo
          </h3>
          <ImageUploader
            name="logo_url"
            defaultValue={restaurant.logo_url}
            label="Subir logo"
          />
        </section>

        <Separator />

        {/* Accent color */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Color de acento
          </h3>
          <div>
            <Label htmlFor="accent_color">Color</Label>
            <div className="mt-1 flex gap-2">
              <input
                id="accent_color"
                name="accent_color"
                type="color"
                value={accent.length === 7 && accent.startsWith("#") ? accent : "#D4F000"}
                onChange={(e) => setAccent(e.target.value)}
                className="h-9 w-14 cursor-pointer rounded-md border border-input p-1"
              />
              <Input
                value={accent}
                onChange={handleAccentText}
                className="font-mono"
                maxLength={7}
                placeholder="#D4F000"
              />
            </div>
            {contrastWarning && (
              <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {contrastWarning}
              </p>
            )}
          </div>
        </section>

        <Separator />

        {/* Font */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tipografía
          </h3>
          <div>
            <Label htmlFor="font_family">Fuente</Label>
            <select
              id="font_family"
              name="font_family"
              value={fontId}
              onChange={(e) => setFontId(e.target.value as FontId)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sin fuente curada (sistema)</option>
              {FONT_THEMES.map((theme) => (
                <optgroup key={theme} label={theme}>
                  {FONT_CATALOG.filter((f) => f.theme === theme).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {fontId && (
              <p
                className="mt-2 text-lg text-foreground"
                style={{ fontFamily: `'${previewFont}', system-ui, sans-serif` }}
              >
                {restaurant.name}
              </p>
            )}
          </div>
        </section>

        <Separator />

        {/* Card stroke */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Borde de cards
          </h3>
          <div className="flex gap-3">
            {(["none", "subtle", "bold"] as const).map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="card_stroke"
                  value={opt}
                  checked={cardStroke === opt}
                  onChange={() => setCardStroke(opt)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">
                  {opt === "none" ? "Ninguno" : opt === "subtle" ? "Sutil" : "Marcado"}
                </span>
              </label>
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
          style={{ fontFamily: `'${previewFont}', system-ui, sans-serif` }}
        >
          {/* Cover strip */}
          <div
            className="flex h-20 items-end px-4 pb-3"
            style={{ backgroundColor: accent }}
          >
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={restaurant.logo_url} alt="logo" className="h-8 object-contain" />
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "#fff" }}
              >
                {restaurant.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="space-y-3 bg-white p-4">
            <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>

            {/* Fake category tabs */}
            <div className="flex gap-2">
              {["Entrantes", "Principales"].map((cat, i) => (
                <span
                  key={cat}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={
                    i === 0
                      ? { backgroundColor: accent, color: "#0a0a0a" }
                      : { backgroundColor: "#f5f5f5", color: "#555" }
                  }
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Fake item card */}
            <div
              className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
              style={{
                border:
                  cardStroke === "none"
                    ? "none"
                    : cardStroke === "bold"
                      ? "2px solid #0a0a0a"
                      : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">Ítem de ejemplo</p>
                <p className="mt-0.5 text-xs text-gray-500">Descripción del ítem</p>
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
