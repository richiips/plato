"use client";

import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/types/menu";

const LABELS: Record<SupportedLanguage, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
  fr: "FR",
};

interface LanguageSwitcherProps {
  languages: SupportedLanguage[];
  current: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

export function LanguageSwitcher({ languages, current, onChange }: LanguageSwitcherProps) {
  if (languages.length <= 1) return null;

  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-border bg-secondary p-0.5">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            lang === current
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABELS[lang] ?? lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
