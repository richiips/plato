-- Feature: Splash screen
-- Adds columns needed for the restaurant entry screen.

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS splash_enabled    boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS tagline           text,
  ADD COLUMN IF NOT EXISTS hours             text,
  ADD COLUMN IF NOT EXISTS splash_bg_type    text    NOT NULL DEFAULT 'gradient',
  ADD COLUMN IF NOT EXISTS splash_pattern_id text    NOT NULL DEFAULT 'dots';

-- splash_bg_type values: 'color' | 'gradient' | 'pattern' | 'image'
-- splash_pattern_id values: 'dots' | 'lines' | 'grid' | 'waves' | 'diagonal'
