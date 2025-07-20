-- Create consultations table for booking consultation sessions
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  website_url VARCHAR(500),
  role VARCHAR(100),
  main_challenge VARCHAR(100) NOT NULL,
  other_challenge TEXT,
  session_goal TEXT,
  preferred_datetime TIMESTAMP WITH TIME ZONE,
  additional_notes TEXT,
  consultation_type VARCHAR(50) DEFAULT 'brand_strategy',
  status VARCHAR(20) DEFAULT 'PENDING',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_email ON consultations(email);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_type ON consultations(consultation_type);
CREATE INDEX IF NOT EXISTS idx_consultations_datetime ON consultations(preferred_datetime);

-- Add some sample data for testing
INSERT INTO consultations (
  id,
  full_name,
  email,
  company_name,
  website_url,
  role,
  main_challenge,
  session_goal,
  preferred_datetime,
  consultation_type,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'John Smith',
  'john@example.com',
  'Tech Startup Inc',
  'https://techstartup.com',
  'Founder',
  'lack_of_brand_clarity',
  'Define our brand identity and messaging strategy',
  NOW() + INTERVAL '7 days',
  'brand_strategy',
  'PENDING',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO consultations (
  id,
  full_name,
  email,
  company_name,
  role,
  main_challenge,
  session_goal,
  preferred_datetime,
  consultation_type,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Sarah Johnson',
  'sarah@designco.com',
  'Design Co',
  'Marketing Director',
  'inconsistent_messaging',
  'Align our brand messaging across all channels',
  NOW() + INTERVAL '5 days',
  'digital_strategy',
  'CONFIRMED',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;