"use client";

import { useState, useRef, useEffect } from "react";
import type { UserPreferences, BancoOperador } from "@/lib/types";
import { BANCO_LABELS } from "@/lib/discounts";
import { savePreferences } from "@/lib/preferences";

interface PreferencesModalProps {
  prefs: UserPreferences;
  onClose: () => void;
  onSave: (prefs: UserPreferences) => void;
}

const BANCOS_OPTIONS: { value: BancoOperador; label: string }[] = [
  { value: "cmr_falabella", label: "CMR Falabella" },
  { value: "bancoestado", label: "BancoEstado" },
  { value: "scotiabank_cencosud", label: "Scotiabank / Cencosud" },
  { value: "bci", label: "BCI / Mach" },
  { value: "itau", label: "Itaú" },
  { value: "santander", label: "Santander" },
  { value: "chile_edwards", label: "Banco de Chile / Edwards" },
  { value: "bice", label: "BICE / Vida" },
  { value: "coopeuch", label: "Coopeuch" },
];

const OPERADORES_OPTIONS: { value: BancoOperador; label: string }[] = [
  { value: "entel", label: "Entel" },
  { value: "movistar", label: "Movistar" },
  { value: "claro", label: "Claro" },
  { value: "wom", label: "WOM" },
  { value: "virgin_mobile", label: "Virgin Mobile" },
];

const CAJAS_OPTIONS: { value: BancoOperador; label: string }[] = [
  { value: "los_andes", label: "Los Andes" },
  { value: "los_heroes", label: "Los Héroes" },
  { value: "la_araucana", label: "La Araucana" },
  { value: "18_septiembre", label: "18 de Septiembre" },
  { value: "gabriela_mistral", label: "Gabriela Mistral" },
  { value: "fuerza", label: "Fuerza" },
  { value: "capredena", label: "CAPREDENA" },
  { value: "dipreca", label: "DIPRECA" },
];

interface MultiSelectProps {
  label: string;
  options: { value: BancoOperador; label: string }[];
  selected: BancoOperador[];
  onChange: (selected: BancoOperador[]) => void;
  placeholder?: string;
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Ninguno seleccionado",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(value: BancoOperador) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? selected[0])
        : `${selected.length} seleccionados`;

  return (
    <div ref={ref} className="relative">
      <p
        className="mb-2 text-[10px] font-bold tracking-widest uppercase"
        style={{ color: "#b6b6b6" }}
      >
        {label}
      </p>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[13px] font-semibold"
        style={
          selected.length > 0
            ? {
                background: "#fca600",
                border: "2px solid #18191f",
                boxShadow: "2px 2px 0px 0px #18191f",
                color: "#18191f",
              }
            : { background: "transparent", border: "2px solid #4a4550", color: "#b6b6b6" }
        }
      >
        <span>{triggerLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
            flexShrink: 0,
          }}
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 left-0 z-10 mt-1 overflow-hidden rounded-xl"
          style={{
            background: "#18191f",
            border: "2px solid #4a4550",
            boxShadow: "4px 4px 0px 0px #18191f",
          }}
        >
          {options.map(({ value, label: optLabel }) => {
            const checked = selected.includes(value);
            return (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 px-4 py-3"
                style={{
                  background: checked ? "#fca60015" : "transparent",
                  borderBottom: "1px solid #2a2530",
                }}
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded"
                  style={{
                    width: 18,
                    height: 18,
                    background: checked ? "#fca600" : "transparent",
                    border: checked ? "2px solid #fca600" : "2px solid #4a4550",
                  }}
                >
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="#18191f"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(value)}
                  className="sr-only"
                />
                <span
                  className="text-[13px] font-medium"
                  style={{ color: checked ? "#fca600" : "#fff" }}
                >
                  {optLabel}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PreferencesModal({ prefs, onClose, onSave }: PreferencesModalProps) {
  const [draft, setDraft] = useState<UserPreferences>({ ...prefs });

  function handleSave() {
    savePreferences(draft);
    onSave(draft);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: "rgba(24,25,31,0.80)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-t-2xl p-6 sm:rounded-2xl"
        style={{
          background: "#231f2a",
          border: "2px solid #18191f",
          boxShadow: "4px 4px 0px 0px #18191f",
          fontFamily: "Montserrat, sans-serif",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-white">Mis descuentos</h2>
          <button
            onClick={onClose}
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{
              width: 36,
              height: 36,
              background: "#fff",
              border: "2px solid #18191f",
              boxShadow: "2px 2px 0px 0px #18191f",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#18191f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="mb-5 text-[13px] font-medium" style={{ color: "#b6b6b6" }}>
          Seleccioná todos tus bancos, operadores y cajas para ver siempre el mejor precio
          disponible.
        </p>

        <div className="flex flex-col gap-4">
          <MultiSelect
            label="Banco o tarjeta"
            options={BANCOS_OPTIONS}
            selected={draft.bancos}
            onChange={(bancos) => setDraft((d) => ({ ...d, bancos }))}
            placeholder="Ningún banco"
          />
          <MultiSelect
            label="Operador móvil"
            options={OPERADORES_OPTIONS}
            selected={draft.operadores}
            onChange={(operadores) => setDraft((d) => ({ ...d, operadores }))}
            placeholder="Ningún operador"
          />
          <MultiSelect
            label="Caja de compensación"
            options={CAJAS_OPTIONS}
            selected={draft.cajas}
            onChange={(cajas) => setDraft((d) => ({ ...d, cajas }))}
            placeholder="Ninguna caja"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full rounded-2xl py-3 text-[14px] font-bold"
          style={{
            background: "#fca600",
            border: "2px solid #18191f",
            boxShadow: "3px 3px 0px 0px #18191f",
            color: "#18191f",
          }}
        >
          Guardar preferencias
        </button>
      </div>
    </div>
  );
}
