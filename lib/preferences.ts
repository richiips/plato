"use client";

import type { UserPreferences } from "./types";

const PREFS_KEY = "cinecompara_prefs";
const LOCATION_ASKED_KEY = "cinecompara_location_asked";

export const DEFAULT_PREFS: UserPreferences = {
  bancos: [],
  operadores: [],
  cajas: [],
  ciudad: "Santiago",
};

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      bancos: parsed.bancos ?? [],
      operadores: parsed.operadores ?? [],
      cajas: parsed.cajas ?? [],
      ciudad: parsed.ciudad ?? "Santiago",
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function hasAskedLocation(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(LOCATION_ASKED_KEY) === "true";
}

export function markLocationAsked(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_ASKED_KEY, "true");
}
