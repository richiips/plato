import type { Json, MenuItem, MenuCategory, MenuModifier, ModifierOption } from "./database";

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten_free"
  | "lactose_free"
  | "spicy"
  | "signature"
  | "new";

export type AllergenTag = "nuts" | "shellfish" | "dairy" | "gluten" | "eggs" | "soy";

export interface MenuItemWithModifiers extends MenuItem {
  modifiers: (MenuModifier & { options: ModifierOption[] })[];
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface FullMenu {
  categories: MenuCategoryWithItems[];
}

export type SupportedLanguage = "es" | "en" | "pt" | "fr";

export function getLocalizedText(
  field: Json | Record<string, string> | null | undefined,
  lang: SupportedLanguage,
  fallback: SupportedLanguage = "es",
): string {
  if (!field || typeof field !== "object" || Array.isArray(field)) return "";
  const map = field as Record<string, string>;
  return map[lang] ?? map[fallback] ?? Object.values(map)[0] ?? "";
}
