ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS theme TEXT CHECK (theme IN ('noir', 'blanco', 'calido', 'grafico')) DEFAULT NULL;
