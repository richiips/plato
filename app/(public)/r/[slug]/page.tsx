import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Globe } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { createAdminClient } from "@/lib/supabase/admin";
import type { Restaurant } from "@/types/database";

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("restaurants")
      .select("slug")
      .eq("is_published", true)
      .eq("is_active", true)
      .returns<{ slug: string }[]>();
    return (data ?? []).map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

// ─── CSS patterns ────────────────────────────────────────────────────────────
const PATTERNS: Record<string, string> = {
  dots: "radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
  lines:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 0, transparent 50%)",
  grid: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
  waves:
    "repeating-radial-gradient(ellipse at 0% 50%, transparent 0, transparent 10px, rgba(255,255,255,0.07) 10px, rgba(255,255,255,0.07) 11px)",
  diagonal:
    "repeating-linear-gradient(-55deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 10px)",
};

const PATTERN_SIZE: Record<string, string> = {
  dots: "20px 20px",
  lines: "14px 14px",
  grid: "32px 32px",
  waves: "24px 24px",
  diagonal: "16px 16px",
};

function buildBackground(r: Restaurant): React.CSSProperties {
  const { splash_bg_type, splash_pattern_id, primary_color, secondary_color, cover_image_url } = r;

  if (splash_bg_type === "image" && cover_image_url) {
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${cover_image_url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  if (splash_bg_type === "gradient") {
    return {
      background: `linear-gradient(135deg, ${primary_color} 0%, ${secondary_color} 100%)`,
    };
  }

  if (splash_bg_type === "pattern") {
    const pattern = PATTERNS[splash_pattern_id] ?? PATTERNS.dots;
    const size = PATTERN_SIZE[splash_pattern_id] ?? "20px 20px";
    return {
      backgroundColor: primary_color,
      backgroundImage: pattern,
      backgroundSize: size,
    };
  }

  // color (default)
  return { backgroundColor: primary_color };
}

function buildFontUrl(heading: string, body: string): string {
  const families = [...new Set([heading, body])]
    .filter((f) => f !== "system-ui")
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;600;700`)
    .join("&");
  return families ? `https://fonts.googleapis.com/css2?${families}&display=swap` : "";
}

export default async function SplashPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_active", true)
    .single<Restaurant>();

  if (!restaurant) notFound();

  // Skip splash if disabled
  if (!restaurant.splash_enabled) {
    redirect(`/r/${slug}/menu`);
  }

  const bg = buildBackground(restaurant);
  const fontUrl = buildFontUrl(restaurant.font_heading, restaurant.font_body);
  const accentColor = restaurant.accent_color;

  return (
    <>
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}

      <div
        className="flex min-h-dvh flex-col items-center justify-between px-6 py-10 text-white"
        style={bg}
      >
        {/* Top spacer */}
        <div />

        {/* Center — logo + info */}
        <div className="flex flex-col items-center gap-5 text-center">
          {restaurant.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="h-24 w-auto object-contain drop-shadow-lg"
            />
          )}

          <div>
            <h1
              className="text-4xl font-bold leading-tight drop-shadow"
              style={{ fontFamily: `'${restaurant.font_heading}', system-ui, sans-serif` }}
            >
              {restaurant.name}
            </h1>

            {restaurant.tagline && (
              <p className="mt-2 text-base font-medium text-white/80">{restaurant.tagline}</p>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-col items-center gap-2 text-sm text-white/70">
            {restaurant.address && restaurant.google_maps_url && (
              <a
                href={restaurant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                {restaurant.address}
              </a>
            )}
            {restaurant.address && !restaurant.google_maps_url && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                {restaurant.address}
              </span>
            )}
            {restaurant.hours && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" />
                {restaurant.hours}
              </span>
            )}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {restaurant.instagram_handle && (
              <a
                href={`https://instagram.com/${restaurant.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 p-2 text-white/70 hover:text-white hover:border-white transition"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {restaurant.website_url && (
              <a
                href={restaurant.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 p-2 text-white/70 hover:text-white hover:border-white transition"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom — CTA */}
        <Link
          href={`/r/${slug}/menu`}
          className="w-full max-w-xs rounded-2xl py-4 text-center text-base font-semibold shadow-lg transition active:scale-95"
          style={{ backgroundColor: accentColor, color: "#fff" }}
        >
          Ver carta
        </Link>
      </div>
    </>
  );
}
