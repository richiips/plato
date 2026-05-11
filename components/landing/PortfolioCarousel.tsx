"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const CARDS = [
  {
    name: "Bellini Bistro",
    type: "Cocina italiana de autor",
    primary: "#1a1a2e",
    accent: "#e94560",
    items: ["Burrata con higos", "Risotto al funghi", "Tiramisú clásico"],
  },
  {
    name: "Café Lorena",
    type: "Cafetería & brunch",
    primary: "#3d2b1f",
    accent: "#c8853a",
    items: ["Flat white", "Tostada de aguacate", "Granola bowl"],
  },
  {
    name: "Bar Nocturno",
    type: "Coctelería de autor",
    primary: "#0d1117",
    accent: "#7c3aed",
    items: ["Negroni de la casa", "Spritz botánico", "Old fashioned ahumado"],
  },
];

export function PortfolioCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Nav arrows */}
      <div className="absolute -top-12 right-0 flex gap-2">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => scroll(dir)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-900"
          >
            {dir === -1 ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ))}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CARDS.map((card) => (
          <div
            key={card.name}
            className="w-72 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm [scroll-snap-align:start]"
          >
            {/* Simulated header */}
            <div
              className="flex h-28 items-end px-5 pb-4"
              style={{ backgroundColor: card.primary }}
            >
              <div>
                <p className="text-lg font-bold text-white">{card.name}</p>
                <p className="text-xs text-white/60">{card.type}</p>
              </div>
            </div>

            {/* Category pill */}
            <div className="flex gap-2 px-5 py-3">
              {["Entradas", "Principales", "Postres"].map((c, i) => (
                <span
                  key={c}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                  style={
                    i === 0
                      ? { backgroundColor: card.accent, color: "#fff" }
                      : { backgroundColor: "#f4f4f5", color: "#71717a" }
                  }
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Fake items */}
            <div className="space-y-2 px-5 pb-5">
              {card.items.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2"
                >
                  <p className="text-xs font-medium text-zinc-800">{item}</p>
                  <span className="text-xs font-semibold" style={{ color: card.accent }}>
                    ${((i + 1) * 9 + 3).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 px-5 py-3">
              <button className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700">
                <ExternalLink className="h-3 w-3" />
                Ver carta completa (demo)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
