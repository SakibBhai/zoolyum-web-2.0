-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url VARCHAR(500),
  featured BOOLEAN NOT NULL DEFAULT false,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved_featured ON testimonials(approved, featured);

-- Insert some sample testimonials
INSERT INTO testimonials (
  id, name, position, company, content, rating, featured, approved, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  'Sarah Johnson',
  'Marketing Director',
  'TechCorp Inc.',
  'Working with Zoolyum has been an absolute game-changer for our business. Their innovative approach and attention to detail exceeded all our expectations.',
  5,
  true,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Michael Chen',
  'CEO',
  'StartupXYZ',
  'The team at Zoolyum delivered exceptional results on time and within budget. Their expertise in modern web technologies is truly impressive.',
  5,
  true,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Emily Rodriguez',
  'Product Manager',
  'InnovateLabs',
  'Zoolyum transformed our digital presence completely. The user experience they created has significantly improved our customer engagement.',
  5,
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;