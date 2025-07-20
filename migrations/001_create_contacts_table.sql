-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'READ', 'REPLIED', 'ARCHIVED')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create contact_settings table
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  working_hours VARCHAR(255) NOT NULL,
  twitter_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  instagram_url VARCHAR(255),
  behance_url VARCHAR(255),
  enable_phone_field BOOLEAN NOT NULL DEFAULT true,
  require_phone_field BOOLEAN NOT NULL DEFAULT false,
  auto_reply_enabled BOOLEAN NOT NULL DEFAULT false,
  auto_reply_message TEXT,
  notification_email VARCHAR(255),
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact settings
INSERT INTO contact_settings (
  email, phone, address, working_hours, twitter_url, linkedin_url, 
  instagram_url, behance_url, enable_phone_field, require_phone_field, 
  auto_reply_enabled, email_notifications
) VALUES (
  'hello@zoolyum.com',
  '+1 (555) 123-4567',
  '123 Creative Street, Design District, San Francisco, CA 94103',
  'Monday - Friday: 9:00 AM - 6:00 PM',
  'https://x.com/zoolyum',
  'https://linkedin.com/company/zoolyum',
  'https://instagram.com/zoolyum',
  'https://behance.net/zoolyum',
  true,
  false,
  false,
  true
) ON CONFLICT DO NOTHING;