-- Add chart_number column to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS chart_number VARCHAR(20) UNIQUE;

-- Create index for chart_number
CREATE INDEX IF NOT EXISTS idx_contacts_chart_number ON contacts(chart_number);

-- Update existing records with generated chart numbers
UPDATE contacts 
SET chart_number = 'CH' || LPAD(id::text, 6, '0')
WHERE chart_number IS NULL;

-- Make chart_number NOT NULL after updating existing records
ALTER TABLE contacts ALTER COLUMN chart_number SET NOT NULL;