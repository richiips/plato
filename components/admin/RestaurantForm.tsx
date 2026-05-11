"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { RestaurantFormState } from "@/lib/actions/restaurants";
import type { Restaurant } from "@/types/database";

const CURRENCIES = ["CLP", "USD", "EUR", "PEN", "ARS", "MXN"] as const;
const TIMEZONES = [
  "America/Santiago",
  "America/Lima",
  "America/Bogota",
  "America/Buenos_Aires",
  "America/Mexico_City",
  "America/New_York",
  "Europe/Madrid",
];

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

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-destructive">{messages[0]}</p>;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}

interface RestaurantFormProps {
  action: (prev: RestaurantFormState, formData: FormData) => Promise<RestaurantFormState>;
  restaurant?: Restaurant;
  submitLabel?: string;
}

export function RestaurantForm({
  action,
  restaurant,
  submitLabel = "Guardar",
}: RestaurantFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-8">
      {state.message && state.message !== "ok" && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}
      {state.message === "ok" && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Cambios guardados.
        </div>
      )}

      {/* Datos básicos */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Datos básicos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nombre del restaurante *</Label>
            <Input id="name" name="name" defaultValue={restaurant?.name} className="mt-1" />
            <FieldError messages={state.errors?.name} />
          </div>
          <div>
            <Label htmlFor="slug">
              Slug (URL) *
              <span className="ml-1 font-normal text-muted-foreground">solo a-z, 0-9, -</span>
            </Label>
            <Input id="slug" name="slug" defaultValue={restaurant?.slug} className="mt-1" />
            <FieldError messages={state.errors?.slug} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={restaurant?.description ?? ""}
              rows={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="legal_name">Razón social</Label>
            <Input
              id="legal_name"
              name="legal_name"
              defaultValue={restaurant?.legal_name ?? ""}
              className="mt-1"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Contacto */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Contacto y ubicación
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              defaultValue={restaurant?.address ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={restaurant?.phone ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={restaurant?.email ?? ""}
              className="mt-1"
            />
            <FieldError messages={state.errors?.email} />
          </div>
          <div>
            <Label htmlFor="instagram_handle">Instagram</Label>
            <Input
              id="instagram_handle"
              name="instagram_handle"
              placeholder="@usuario"
              defaultValue={restaurant?.instagram_handle ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website_url">Sitio web</Label>
            <Input
              id="website_url"
              name="website_url"
              placeholder="https://"
              defaultValue={restaurant?.website_url ?? ""}
              className="mt-1"
            />
            <FieldError messages={state.errors?.website_url} />
          </div>
          <div>
            <Label htmlFor="google_maps_url">Google Maps URL</Label>
            <Input
              id="google_maps_url"
              name="google_maps_url"
              placeholder="https://maps.google.com/..."
              defaultValue={restaurant?.google_maps_url ?? ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reservation_url">URL de reservas</Label>
            <Input
              id="reservation_url"
              name="reservation_url"
              placeholder="https://"
              defaultValue={restaurant?.reservation_url ?? ""}
              className="mt-1"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Branding */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Branding
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="primary_color">Color primario</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="primary_color"
                name="primary_color"
                type="color"
                defaultValue={restaurant?.primary_color ?? "#000000"}
                className="h-9 w-14 cursor-pointer p-1"
              />
              <Input
                name="primary_color_text"
                defaultValue={restaurant?.primary_color ?? "#000000"}
                className="font-mono"
                readOnly
              />
            </div>
            <FieldError messages={state.errors?.primary_color} />
          </div>
          <div>
            <Label htmlFor="secondary_color">Color secundario</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="secondary_color"
                name="secondary_color"
                type="color"
                defaultValue={restaurant?.secondary_color ?? "#FFFFFF"}
                className="h-9 w-14 cursor-pointer p-1"
              />
              <Input
                name="secondary_color_text"
                defaultValue={restaurant?.secondary_color ?? "#FFFFFF"}
                className="font-mono"
                readOnly
              />
            </div>
          </div>
          <div>
            <Label htmlFor="accent_color">Color acento</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="accent_color"
                name="accent_color"
                type="color"
                defaultValue={restaurant?.accent_color ?? "#FF6B35"}
                className="h-9 w-14 cursor-pointer p-1"
              />
              <Input
                name="accent_color_text"
                defaultValue={restaurant?.accent_color ?? "#FF6B35"}
                className="font-mono"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="font_heading">Fuente títulos</Label>
            <select
              id="font_heading"
              name="font_heading"
              defaultValue={restaurant?.font_heading ?? "Inter"}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="font_body">Fuente cuerpo</Label>
            <select
              id="font_body"
              name="font_body"
              defaultValue={restaurant?.font_body ?? "Inter"}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Config */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Configuración
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="default_currency">Moneda</Label>
            <Select name="default_currency" defaultValue={restaurant?.default_currency ?? "CLP"}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">Zona horaria</Label>
            <select
              id="timezone"
              name="timezone"
              defaultValue={restaurant?.timezone ?? "America/Santiago"}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="default_language">Idioma por defecto</Label>
            <select
              id="default_language"
              name="default_language"
              defaultValue={restaurant?.default_language ?? "es"}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
