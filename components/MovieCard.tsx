"use client";

import Image from "next/image";
import Link from "next/link";
import type { Pelicula, UserPreferences } from "@/lib/types";
import { FUNCIONES } from "@/lib/mock-data";
import { calcularPrecio, formatPrecio } from "@/lib/discounts";

const CLASIFICACION_COLORS: Record<string, string> = {
  TE: "#16a34a",
  "TE+7": "#65a30d",
  "TE+14": "#d97706",
  "MA+14": "#ea580c",
  "MA+18": "#dc2626",
};

interface MovieCardProps {
  pelicula: Pelicula;
  prefs: UserPreferences;
}

function getMejorPrecio(peliculaId: string, prefs: UserPreferences) {
  const funciones = FUNCIONES.filter((f) => f.pelicula_id === peliculaId);
  if (funciones.length === 0) return null;

  let mejor: { precio_final: number } | null = null;
  for (const f of funciones) {
    const calc = calcularPrecio(f.precio_base, f.cadena_id, prefs);
    if (!mejor || calc.precio_final < mejor.precio_final) {
      mejor = { precio_final: calc.precio_final };
    }
  }
  return mejor;
}

export default function MovieCard({ pelicula, prefs }: MovieCardProps) {
  const horas = Math.floor(pelicula.duracion_min / 60);
  const mins = pelicula.duracion_min % 60;
  const duracion = mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
  const mejorPrecio = getMejorPrecio(pelicula.id, prefs);

  return (
    <Link href={`/pelicula/${pelicula.id}`} className="group block">
      <article
        className="flex flex-col overflow-hidden rounded-2xl transition-transform duration-150 group-hover:-translate-y-1"
        style={{
          background: "#231f2a",
          border: "2px solid #18191f",
          boxShadow: "3px 3px 0px 0px #18191f",
        }}
      >
        {/* Poster */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2/3" }}>
          <Image
            src={pelicula.poster_url}
            alt={pelicula.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Clasificación badge */}
          <div className="absolute top-2 left-2">
            <span
              className="rounded px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: CLASIFICACION_COLORS[pelicula.clasificacion] ?? "#555" }}
            >
              {pelicula.clasificacion}
            </span>
          </div>
          {/* Gradient bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-20"
            style={{ background: "linear-gradient(to bottom, transparent, #231f2a)" }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 p-3">
          <h3 className="line-clamp-2 text-[13px] leading-tight font-bold text-white transition-colors group-hover:text-[#fca600]">
            {pelicula.titulo}
          </h3>

          <p className="text-[10px] font-medium" style={{ color: "#b6b6b6" }}>
            {duracion} · {pelicula.genero[0]}
          </p>

          {/* Price */}
          {mejorPrecio && (
            <div className="mt-auto pt-2" style={{ borderTop: "1px solid #18191f" }}>
              <p
                className="text-[9px] font-semibold tracking-wide uppercase"
                style={{ color: "#b6b6b6" }}
              >
                Desde
              </p>
              <p className="text-[14px] font-extrabold" style={{ color: "#fca600" }}>
                {formatPrecio(mejorPrecio.precio_final)}
              </p>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
