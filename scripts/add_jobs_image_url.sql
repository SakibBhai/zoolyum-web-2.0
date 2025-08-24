-- Safely add image_url column to jobs if it doesn't exist
ALTER TABLE IF EXISTS public.jobs
  ADD COLUMN IF NOT EXISTS image_url TEXT;