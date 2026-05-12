-- Feature: Splash screen colour and gradient support
-- Adds columns for solid colour and gradient background types.

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS splash_color          text NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS splash_gradient_from  text NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS splash_gradient_to    text NOT NULL DEFAULT '#333333';

-- splash_color: used when splash_bg_type = 'color'
-- splash_gradient_from / splash_gradient_to: used when splash_bg_type = 'gradient'
