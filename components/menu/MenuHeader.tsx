import Image from "next/image";
import { MapPin, Phone, AtSign, Globe, Clock } from "lucide-react";
import type { Restaurant } from "@/types/database";

interface MenuHeaderProps {
  restaurant: Restaurant;
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  return (
    <header>
      {/* Cover image */}
      {restaurant.cover_image_url && (
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <Image
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Identity */}
      <div className="mx-auto max-w-3xl px-4">
        <div
          className={`flex items-end gap-4 ${restaurant.cover_image_url ? "-mt-12" : "pt-8"}`}
        >
          {restaurant.logo_url ? (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-background bg-background shadow-md">
              <Image
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-background text-2xl font-bold text-white shadow-md"
              style={{ backgroundColor: "var(--menu-primary)" }}
            >
              {restaurant.name.charAt(0)}
            </div>
          )}

          <div className="pb-1">
            <h1
              className="text-2xl font-bold leading-tight text-foreground"
              style={{ fontFamily: "var(--menu-font-heading)" }}
            >
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                {restaurant.description}
              </p>
            )}
          </div>
        </div>

        {/* Info row */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3 border-b border-border pb-4 text-sm text-muted-foreground">
          {restaurant.address && (
            <a
              href={restaurant.google_maps_url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{restaurant.address}</span>
            </a>
          )}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{restaurant.phone}</span>
            </a>
          )}
          {restaurant.instagram_handle && (
            <a
              href={`https://instagram.com/${restaurant.instagram_handle.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <AtSign className="h-3.5 w-3.5" />
              <span>@{restaurant.instagram_handle.replace("@", "")}</span>
            </a>
          )}
          {restaurant.website_url && (
            <a
              href={restaurant.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Sitio web</span>
            </a>
          )}
          {restaurant.reservation_url && (
            <a
              href={restaurant.reservation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium transition-colors"
              style={{ color: "var(--menu-accent)" }}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Reservar</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
