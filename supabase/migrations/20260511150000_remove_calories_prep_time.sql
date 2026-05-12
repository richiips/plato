-- B2: Remove calories and prep_time_minutes from menu_items
-- These fields are not part of the boutique restaurant experience.

ALTER TABLE public.menu_items DROP COLUMN IF EXISTS calories;
ALTER TABLE public.menu_items DROP COLUMN IF EXISTS prep_time_minutes;
