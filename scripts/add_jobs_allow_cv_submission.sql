-- Safely add allow_cv_submission column to jobs if it doesn't exist
ALTER TABLE IF EXISTS public.jobs
  ADD COLUMN IF NOT EXISTS allow_cv_submission BOOLEAN NOT NULL DEFAULT TRUE;