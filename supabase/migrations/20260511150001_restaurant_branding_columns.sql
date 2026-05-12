-- B4 + Fonts: Add card_stroke and font_family columns to restaurants
-- card_stroke: null = use theme default, 'none' | 'subtle' | 'bold'
-- font_family: stores the font id from the curated catalog (e.g. 'cormorant-garamond')

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS card_stroke text,
  ADD COLUMN IF NOT EXISTS font_family text;
