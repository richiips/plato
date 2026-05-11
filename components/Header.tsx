"use client";

import { useState } from "react";
import type { UserPreferences } from "@/lib/types";
import { getTotalDescuentos } from "@/lib/discounts";
import PreferencesModal from "./PreferencesModal";

interface HeaderProps {
  prefs: UserPreferences;
  onPrefsChange: (prefs: UserPreferences) => void;
}

export default function Header({ prefs, onPrefsChange }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const total = getTotalDescuentos(prefs);
  const hasPrefs = total > 0;

  return (
    <>
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: "#332f37", borderBottom: "2px solid #18191f" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 36,
              height: 36,
              background: "#fca600",
              border: "2px solid #18191f",
              boxShadow: "2px 2px 0px 0px #18191f",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#18191f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-bold tracking-tight text-white">CineCompara</span>
            <span className="text-[10px] font-semibold" style={{ color: "#b6b6b6" }}>
              Chile
            </span>
          </div>
        </div>

        {/* Preferences button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl px-4 py-2 text-[11px] font-semibold"
          style={
            hasPrefs
              ? {
                  background: "#fca600",
                  border: "2px solid #18191f",
                  boxShadow: "2px 2px 0px 0px #18191f",
                  color: "#18191f",
                }
              : {
                  background: "#fff",
                  border: "2px solid #18191f",
                  boxShadow: "2px 2px 0px 0px #18191f",
                  color: "#18191f",
                }
          }
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="hidden sm:inline">
            {hasPrefs ? `${total} descuento${total > 1 ? "s" : ""}` : "Mis descuentos"}
          </span>
          <span className="sm:hidden">{hasPrefs ? `${total}%` : "Descuentos"}</span>
        </button>
      </header>

      {showModal && (
        <PreferencesModal
          prefs={prefs}
          onClose={() => setShowModal(false)}
          onSave={onPrefsChange}
        />
      )}
    </>
  );
}
