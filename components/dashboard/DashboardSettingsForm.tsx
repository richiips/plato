"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { updateRestaurantSettings } from "@/lib/actions/dashboard";
import type { Restaurant } from "@/types/database";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-destructive">{messages[0]}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Guardar cambios
    </Button>
  );
}

interface DashboardSettingsFormProps {
  restaurant: Restaurant;
}

export function DashboardSettingsForm({ restaurant }: DashboardSettingsFormProps) {
  const boundAction = updateRestaurantSettings.bind(null, restaurant.id);
  const [state, formAction] = useActionState(boundAction, {});

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
          Información básica
        </h2>
        <div>
          <Label htmlFor="name">Nombre del restaurante *</Label>
          <Input id="name" name="name" defaultValue={restaurant.name} className="mt-1" />
          <FieldError messages={state.errors?.name} />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={restaurant.description ?? ""}
            rows={3}
            className="mt-1"
          />
        </div>
      </section>

      <Separator />

      {/* Contacto */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Contacto
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" defaultValue={restaurant.phone ?? ""} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={restaurant.email ?? ""}
              className="mt-1"
            />
            <FieldError messages={state.errors?.email} />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            name="address"
            defaultValue={restaurant.address ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="instagram_handle">Instagram (sin @)</Label>
          <Input
            id="instagram_handle"
            name="instagram_handle"
            defaultValue={restaurant.instagram_handle ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hours">Horarios</Label>
          <Textarea
            id="hours"
            name="hours"
            defaultValue={restaurant.hours ?? ""}
            rows={3}
            placeholder={"Lun–Vie 13:00–23:00\nSáb 12:00–00:00\nDom cerrado"}
            className="mt-1"
          />
        </div>
      </section>

      <Separator />

      {/* Links */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Links
        </h2>
        <div>
          <Label htmlFor="website_url">Sitio web</Label>
          <Input
            id="website_url"
            name="website_url"
            type="url"
            defaultValue={restaurant.website_url ?? ""}
            className="mt-1"
          />
          <FieldError messages={state.errors?.website_url} />
        </div>
        <div>
          <Label htmlFor="google_maps_url">Google Maps</Label>
          <Input
            id="google_maps_url"
            name="google_maps_url"
            type="url"
            defaultValue={restaurant.google_maps_url ?? ""}
            className="mt-1"
          />
          <FieldError messages={state.errors?.google_maps_url} />
        </div>
        <div>
          <Label htmlFor="reservation_url">Reservas</Label>
          <Input
            id="reservation_url"
            name="reservation_url"
            type="url"
            defaultValue={restaurant.reservation_url ?? ""}
            className="mt-1"
          />
          <FieldError messages={state.errors?.reservation_url} />
        </div>
      </section>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
