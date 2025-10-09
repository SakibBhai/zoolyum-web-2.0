-- Add missing columns to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_website TEXT,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;

-- Update existing records to have default values
UPDATE contacts 
SET 
  country_code = COALESCE(country_code, '+880'),
  services = COALESCE(services, '[]'::jsonb)
WHERE country_code IS NULL OR services IS NULL;