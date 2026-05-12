"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types/database";

interface MenuHeaderProps {
  restaurant: Restaurant;
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const initial = restaurant.name.charAt(0).toUpperCase();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCollapsed(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Compact fixed bar — out of document flow, always at top */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-14 transition-colors duration-300",
          collapsed
            ? "bg-background/95 backdrop-blur-sm border-b border-border"
            : "bg-transparent",
        )}
      >
        {/* Back button */}
        <button
          onClick={() => router.push(`/r/${restaurant.slug}`)}
          aria-label="Volver"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            collapsed
              ? "text-foreground hover:bg-muted"
              : "bg-black/30 text-white hover:bg-black/50",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Logo — fades in when hero scrolls away */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
            collapsed ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none",
          )}
        >
          {restaurant.logo_url ? (
            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-background">
              <Image
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-background"
              style={{ backgroundColor: "var(--menu-accent)" }}
            >
              {initial}
            </div>
          )}
        </div>
      </div>

      {/* Hero — h-56 in normal flow; fixed bar is out of flow so hero starts at doc top */}
      <div ref={heroRef} className="relative h-56">
        {restaurant.cover_image_url ? (
          <>
            <Image
              src={restaurant.cover_image_url}
              alt={restaurant.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Content — pt-14 so it clears the sticky bar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pt-14 pb-4 px-8">
          {restaurant.logo_url ? (
            <div className="relative mb-1 h-26 w-26 overflow-hidden rounded-full ring-2 ring-background shadow-md">
              <Image
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                fill
                sizes="104px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="mb-1 flex h-26 w-26 items-center justify-center rounded-full text-3xl font-bold text-white ring-2 ring-background shadow-md"
              style={{ backgroundColor: "var(--menu-accent)" }}
            >
              {initial}
            </div>
          )}
          <h1
            className="text-xl font-bold text-white leading-snug drop-shadow-sm text-center"
            style={{ fontFamily: "var(--menu-font-heading)" }}
          >
            {restaurant.name}
          </h1>
          {(restaurant.address || restaurant.hours) && (
            <p className="text-sm text-white/80 drop-shadow-sm text-center">
              {[restaurant.address, restaurant.hours].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
