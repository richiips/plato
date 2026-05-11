"use client";

import { useState, useEffect, useRef } from "react";
import type { UserPreferences } from "@/lib/types";
import { PELICULAS } from "@/lib/mock-data";
import {
  loadPreferences,
  savePreferences,
  hasAskedLocation,
  markLocationAsked,
} from "@/lib/preferences";
import Header from "./Header";
import MovieCard from "./MovieCard";

const DIAS = ["Hoy", "Mañana", "Vie", "Sáb", "Dom"];
const HORARIOS = ["Todos", "Mañana", "Tarde", "Noche"];

export default function CarreteraPage() {
  const [prefs, setPrefs] = useState<UserPreferences>({
    bancos: [],
    operadores: [],
    cajas: [],
    ciudad: "Santiago",
  });
  const [filtroDia, setFiltroDia] = useState("Hoy");
  const [filtroHorario, setFiltroHorario] = useState("Todos");
  const [editandoCiudad, setEditandoCiudad] = useState(false);
  const [ciudadInput, setCiudadInput] = useState("");
  const ciudadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadPreferences();
    setPrefs(saved);
    setCiudadInput(saved.ciudad);

    // Request location only once, on first visit
    if (!hasAskedLocation() && typeof navigator !== "undefined" && navigator.geolocation) {
      markLocationAsked();
      navigator.geolocation.getCurrentPosition(
        () => {
          // Permission granted — for MVP, set a friendly label
          const updated = { ...saved, ciudad: "Mi ubicación" };
          setPrefs(updated);
          setCiudadInput("Mi ubicación");
          savePreferences(updated);
        },
        () => {}, // denied or error — keep saved city
      );
    }
  }, []);

  function handleCiudadSubmit() {
    const nueva = ciudadInput.trim() || prefs.ciudad;
    setCiudadInput(nueva);
    const updated = { ...prefs, ciudad: nueva };
    setPrefs(updated);
    savePreferences(updated);
    setEditandoCiudad(false);
  }

  function handlePrefsChange(p: UserPreferences) {
    setPrefs(p);
    setCiudadInput(p.ciudad);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#332f37", fontFamily: "Montserrat, sans-serif" }}
    >
      <Header prefs={prefs} onPrefsChange={handlePrefsChange} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Hero title */}
        <div className="mb-5">
          <h1 className="text-[24px] font-bold text-white sm:text-[28px]">Cartelera</h1>
          <p className="mt-1 text-[12px] font-medium" style={{ color: "#b6b6b6" }}>
            {PELICULAS.length} películas · semana del 27 mar al 3 abr
          </p>
        </div>

        {/* Filters row */}
        <div className="mb-6 flex flex-wrap gap-2">
          {/* City pill — editable */}
          {editandoCiudad ? (
            <div
              className="flex items-center rounded-2xl px-3 py-1.5"
              style={{
                background: "#fff",
                border: "2px solid #18191f",
                boxShadow: "2px 2px 0px 0px #18191f",
              }}
            >
              <input
                ref={ciudadInputRef}
                value={ciudadInput}
                onChange={(e) => setCiudadInput(e.target.value)}
                onBlur={handleCiudadSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCiudadSubmit();
                  if (e.key === "Escape") {
                    setCiudadInput(prefs.ciudad);
                    setEditandoCiudad(false);
                  }
                }}
                className="w-28 bg-transparent text-[11px] font-semibold outline-none"
                style={{ color: "#18191f" }}
                autoFocus
              />
              <button onClick={handleCiudadSubmit}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#18191f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditandoCiudad(true);
                setTimeout(() => ciudadInputRef.current?.select(), 10);
              }}
              className="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-[11px] font-semibold"
              style={{
                background: "#fff",
                border: "2px solid #18191f",
                boxShadow: "2px 2px 0px 0px #18191f",
                color: "#18191f",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {prefs.ciudad}
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                <path
                  d="M1 1L4 4L7 1"
                  stroke="#18191f"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Day pills */}
          {DIAS.map((dia) => (
            <button
              key={dia}
              onClick={() => setFiltroDia(dia)}
              className="rounded-2xl px-4 py-2 text-[11px] font-semibold transition-all"
              style={
                filtroDia === dia
                  ? {
                      background: "#fca600",
                      border: "2px solid #18191f",
                      boxShadow: "2px 2px 0px 0px #18191f",
                      color: "#18191f",
                    }
                  : { background: "transparent", border: "2px solid #4a4550", color: "#b6b6b6" }
              }
            >
              {dia}
            </button>
          ))}

          {/* Time pills */}
          {HORARIOS.map((h) => (
            <button
              key={h}
              onClick={() => setFiltroHorario(h)}
              className="rounded-2xl px-4 py-2 text-[11px] font-semibold transition-all"
              style={
                filtroHorario === h
                  ? {
                      background: "#fff",
                      border: "2px solid #18191f",
                      boxShadow: "2px 2px 0px 0px #18191f",
                      color: "#18191f",
                    }
                  : { background: "transparent", border: "2px solid #4a4550", color: "#b6b6b6" }
              }
            >
              {h}
            </button>
          ))}
        </div>

        {/* Movie grid */}
        {PELICULAS.length === 0 ? (
          <div className="py-20 text-center font-medium" style={{ color: "#b6b6b6" }}>
            No hay películas disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {PELICULAS.map((pelicula) => (
              <MovieCard key={pelicula.id} pelicula={pelicula} prefs={prefs} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-12 pt-6 text-center text-[11px]"
          style={{ borderTop: "2px solid #18191f", color: "#4a4550" }}
        >
          <p>CineCompara Chile — Compará precios, elegí mejor.</p>
          <p className="mt-1">
            Los precios pueden variar. Verificar en el sitio de cada cadena antes de comprar.
          </p>
        </div>
      </main>
    </div>
  );
}
