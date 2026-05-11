"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { UserPreferences } from "@/lib/types";
import { PELICULAS, CADENAS, FUNCIONES } from "@/lib/mock-data";
import { calcularPrecio, formatPrecio, BANCO_LABELS, getTotalDescuentos } from "@/lib/discounts";
import { loadPreferences, savePreferences } from "@/lib/preferences";
import PreferencesModal from "./PreferencesModal";

const CHAIN_COLORS: Record<string, string> = {
  cinemark: "#E31837",
  cinepolis: "#FF6B00",
  cineplanet: "#003087",
  muvix: "#6B21A8",
};

const CHAIN_INITIALS: Record<string, string> = {
  cinemark: "C",
  cinepolis: "CP",
  cineplanet: "CP",
  muvix: "MX",
};

function ChainLogo({ cadenaId }: { cadenaId: string }) {
  const color = CHAIN_COLORS[cadenaId] ?? "#555";
  const initial = CHAIN_INITIALS[cadenaId] ?? "?";
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg"
      style={{
        width: 48,
        height: 48,
        background: "#fff",
        border: "2px solid #18191f",
        boxShadow: "2px 2px 0px 0px #18191f",
      }}
    >
      <div
        className="flex items-center justify-center rounded-[4px] text-sm font-bold text-white"
        style={{ width: 32, height: 32, background: color }}
      >
        {initial}
      </div>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button
      className="flex items-center gap-2 rounded-2xl px-4 py-2 text-[10px] font-semibold whitespace-nowrap"
      style={{
        background: "#fff",
        border: "2px solid #18191f",
        boxShadow: "2px 2px 0px 0px #18191f",
        color: "#18191f",
      }}
    >
      {label}
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="shrink-0">
        <path
          d="M1 1L4 4L7 1"
          stroke="#18191f"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function BackButton() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: 48,
        height: 48,
        background: "#fff",
        border: "2px solid #18191f",
        boxShadow: "0px 2px 0px 0px #18191f",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#18191f"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </Link>
  );
}

interface CinemaRowProps {
  cadenaId: string;
  nombre: string;
  precio: number;
  precioOriginal: number;
  esMasBarato: boolean;
  urlCompra: string;
  descuentoLabel: string | null;
}

function CinemaRow({
  cadenaId,
  nombre,
  precio,
  precioOriginal,
  esMasBarato,
  urlCompra,
  descuentoLabel,
}: CinemaRowProps) {
  const tieneDescuento = precio < precioOriginal;

  return (
    <a
      href={urlCompra}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center gap-[22px] px-4 py-6 transition-opacity hover:opacity-90"
      style={
        esMasBarato ? { background: "#fca600", border: "none" } : { background: "transparent" }
      }
    >
      <ChainLogo cadenaId={cadenaId} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {esMasBarato && (
          <div className="flex">
            <span
              className="rounded-2xl px-4 py-2 text-[10px] font-semibold whitespace-nowrap"
              style={{
                background: "#fff",
                border: "2px solid #18191f",
                boxShadow: "2px 2px 0px 0px #18191f",
                color: "#231f20",
              }}
            >
              El más barato
            </span>
          </div>
        )}
        <p
          className="text-[18px] leading-tight font-bold"
          style={{ color: esMasBarato ? "#18191f" : "#fff" }}
        >
          {nombre}
        </p>
        {descuentoLabel && (
          <p
            className="text-[10px] font-semibold"
            style={{ color: esMasBarato ? "#5a4a00" : "#b6b6b6" }}
          >
            {descuentoLabel}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <p
          className="text-[18px] leading-tight font-extrabold whitespace-nowrap"
          style={{ color: esMasBarato ? "#18191f" : "#fff" }}
        >
          {formatPrecio(precio)}
        </p>
        {tieneDescuento && (
          <p
            className="text-[10px] line-through"
            style={{ color: esMasBarato ? "#5a4a00" : "#888" }}
          >
            {formatPrecio(precioOriginal)}
          </p>
        )}
      </div>
    </a>
  );
}

interface PeliculaDetalleProps {
  peliculaId: string;
}

export default function PeliculaDetalle({ peliculaId }: PeliculaDetalleProps) {
  const [prefs, setPrefs] = useState<UserPreferences>({
    bancos: [],
    operadores: [],
    cajas: [],
    ciudad: "Santiago",
  });
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [sinopsisExpanded, setSinopsisExpanded] = useState(false);

  useEffect(() => {
    setPrefs(loadPreferences());
  }, []);

  const pelicula = PELICULAS.find((p) => p.id === peliculaId);

  if (!pelicula) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#332f37" }}
      >
        <div className="text-center text-white">
          <p>Película no encontrada.</p>
          <Link href="/" className="mt-4 inline-block" style={{ color: "#fca600" }}>
            ← Volver
          </Link>
        </div>
      </div>
    );
  }

  const horas = Math.floor(pelicula.duracion_min / 60);
  const mins = pelicula.duracion_min % 60;
  const duracion = mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
  const totalDescuentos = getTotalDescuentos(prefs);
  const hasPrefs = totalDescuentos > 0;
  const sinopsisLarga = pelicula.sinopsis && pelicula.sinopsis.length > 120;

  const cinemasRanked = pelicula.cadenas_ids
    .map((cadenaId) => {
      const cadena = CADENAS.find((c) => c.id === cadenaId)!;
      const funciones = FUNCIONES.filter(
        (f) => f.pelicula_id === peliculaId && f.cadena_id === cadenaId,
      );
      if (funciones.length === 0) return null;

      let mejorFuncion = funciones[0];
      let mejorCalc = calcularPrecio(funciones[0].precio_base, cadenaId, prefs);
      for (const f of funciones.slice(1)) {
        const calc = calcularPrecio(f.precio_base, cadenaId, prefs);
        if (calc.precio_final < mejorCalc.precio_final) {
          mejorFuncion = f;
          mejorCalc = calc;
        }
      }

      const descuentoLabel =
        hasPrefs && mejorCalc.descuento_aplicado
          ? `Con descuento · ${mejorCalc.descuento_aplicado.valor}% off`
          : null;

      return {
        cadenaId,
        nombre: cadena.nombre,
        precio: mejorCalc.precio_final,
        precioOriginal: mejorCalc.precio_base,
        urlCompra: mejorFuncion.url_compra,
        descuentoLabel,
        hasFunciones: true as const,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => a.precio - b.precio);

  const precioMinimo = cinemasRanked[0]?.precio;

  // Chains listed on the movie but without showtimes in the data
  const cinemasWithoutFunciones = pelicula.cadenas_ids
    .filter((cadenaId) => !cinemasRanked.some((c) => c.cadenaId === cadenaId))
    .map((cadenaId) => {
      const cadena = CADENAS.find((c) => c.id === cadenaId);
      return cadena ? { cadenaId, nombre: cadena.nombre, urlBase: cadena.url_base } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#332f37", fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Hero image */}
      <div className="relative w-full" style={{ height: "62vw", maxHeight: 380, minHeight: 220 }}>
        <Image
          src={pelicula.poster_url}
          alt={pelicula.titulo}
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, #332f37)" }}
        />
        <div className="absolute top-4 right-0 left-0 flex items-center justify-between px-4">
          <BackButton />
          <button
            onClick={() => setShowPrefsModal(true)}
            className="flex items-center justify-center rounded-full text-[11px] font-bold"
            style={{
              width: 40,
              height: 40,
              background: hasPrefs ? "#fca600" : "#fff",
              border: "2px solid #18191f",
              color: "#18191f",
            }}
            title="Mis descuentos"
          >
            {hasPrefs ? "%" : "?"}
          </button>
        </div>
      </div>

      {/* Movie info */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[18px] leading-tight font-bold text-white">{pelicula.titulo}</h1>
          <p className="text-[12px] font-medium" style={{ color: "#b6b6b6" }}>
            {pelicula.genero.join(" / ")} · {duracion} · {pelicula.clasificacion}
          </p>
        </div>

        {pelicula.sinopsis && (
          <div className="mt-3">
            <p className="text-[14px] leading-relaxed font-medium text-white">
              {sinopsisLarga && !sinopsisExpanded ? (
                <>
                  {pelicula.sinopsis.slice(0, 120)}…{" "}
                  <button
                    onClick={() => setSinopsisExpanded(true)}
                    className="font-semibold underline"
                    style={{ color: "#fca600" }}
                  >
                    leer más
                  </button>
                </>
              ) : (
                <>
                  {pelicula.sinopsis}
                  {sinopsisLarga && (
                    <>
                      {" "}
                      <button
                        onClick={() => setSinopsisExpanded(false)}
                        className="font-semibold underline"
                        style={{ color: "#fca600" }}
                      >
                        ver menos
                      </button>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="scrollbar-none flex items-center gap-[9px] overflow-x-auto px-4 pb-6">
        <FilterPill label={prefs.ciudad} />
        <FilterPill label="Hoy" />
        <FilterPill label="Más filtros" />
      </div>

      {/* Prefs banner */}
      {!hasPrefs && (
        <div
          className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#fca60022", border: "2px solid #fca600" }}
        >
          <p className="text-[12px] font-semibold" style={{ color: "#fca600" }}>
            Configurá tu banco para ver precios con descuento real.
          </p>
          <button
            onClick={() => setShowPrefsModal(true)}
            className="shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold"
            style={{ background: "#fca600", color: "#18191f" }}
          >
            Configurar
          </button>
        </div>
      )}
      {hasPrefs && (
        <div
          className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#fca60022", border: "2px solid #fca600" }}
        >
          <p className="text-[12px] font-semibold" style={{ color: "#fca600" }}>
            Precios con {totalDescuentos} descuento{totalDescuentos > 1 ? "s" : ""} activo
            {totalDescuentos > 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setShowPrefsModal(true)}
            className="shrink-0 text-[11px] font-semibold underline"
            style={{ color: "#fca600", background: "none", border: "none" }}
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Cinema list */}
      <div className="mx-0 flex flex-col" style={{ borderTop: "2px solid #18191f" }}>
        {/* Ad placeholder */}
        <div
          className="flex items-center gap-[22px] px-4 py-6"
          style={{ borderBottom: "2px solid #18191f", opacity: 0.4 }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-lg"
            style={{
              width: 48,
              height: 48,
              background: "#fff",
              border: "2px solid #18191f",
              boxShadow: "2px 2px 0px 0px #18191f",
            }}
          >
            <span className="text-[10px] font-bold text-gray-400">pub</span>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-[18px] font-bold text-white">Espacio de publicidad</p>
            <p className="text-[10px] font-semibold" style={{ color: "#b6b6b6" }}>
              Este espacio estará disponible próximamente
            </p>
          </div>
        </div>

        {cinemasRanked.map((cinema, i) => (
          <div key={cinema.cadenaId}>
            <CinemaRow
              cadenaId={cinema.cadenaId}
              nombre={cinema.nombre}
              precio={cinema.precio}
              precioOriginal={cinema.precioOriginal}
              esMasBarato={cinema.precio === precioMinimo}
              urlCompra={cinema.urlCompra}
              descuentoLabel={cinema.descuentoLabel}
            />
            {(i < cinemasRanked.length - 1 || cinemasWithoutFunciones.length > 0) && (
              <div style={{ height: 2, background: "#18191f" }} />
            )}
          </div>
        ))}

        {cinemasWithoutFunciones.map((cinema, i) => (
          <div key={cinema.cadenaId}>
            <a
              href={cinema.urlBase}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-[22px] px-4 py-6"
              style={{ background: "transparent", opacity: 0.5 }}
            >
              <ChainLogo cadenaId={cinema.cadenaId} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-[18px] leading-tight font-bold text-white">{cinema.nombre}</p>
                <p className="text-[10px] font-semibold" style={{ color: "#b6b6b6" }}>
                  Sin horarios disponibles aún
                </p>
              </div>
              <p className="shrink-0 text-[12px] font-semibold" style={{ color: "#b6b6b6" }}>
                Ver web →
              </p>
            </a>
            {i < cinemasWithoutFunciones.length - 1 && (
              <div style={{ height: 2, background: "#18191f" }} />
            )}
          </div>
        ))}

        {cinemasRanked.length === 0 && cinemasWithoutFunciones.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-[14px] font-medium" style={{ color: "#b6b6b6" }}>
              No hay funciones disponibles esta semana.
            </p>
          </div>
        )}
      </div>

      <div className="h-8" />

      {showPrefsModal && (
        <PreferencesModal
          prefs={prefs}
          onClose={() => setShowPrefsModal(false)}
          onSave={(p) => {
            setPrefs(p);
            savePreferences(p);
          }}
        />
      )}
    </div>
  );
}
