-- Fix contacts table schema to match the contact form requirements
-- Add missing columns for business information and services

ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT '+880',
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_website VARCHAR(500),
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_country_code ON contacts(country_code);
CREATE INDEX IF NOT EXISTS idx_contacts_business_name ON contacts(business_name);

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT ON contacts TO anon;
GRANT ALL PRIVILEGES ON contacts TO authenticated;