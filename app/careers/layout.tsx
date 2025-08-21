import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - Join Our Creative Team | Features Digital',
  description: 'Join Features Digital Branding & Marketing Agency. Explore exciting career opportunities in design, development, marketing, and strategy. Build your future with our creative team.',
  keywords: [
    'careers',
    'jobs',
    'digital marketing careers',
    'branding agency jobs',
    'creative careers',
    'marketing jobs',
    'design careers',
    'development jobs',
    'Features Digital careers',
    'agency careers'
  ],
  openGraph: {
    title: 'Careers - Join Our Creative Team | Features Digital',
    description: 'Join Features Digital Branding & Marketing Agency. Explore exciting career opportunities in design, development, marketing, and strategy.',
    type: 'website',
    url: '/careers',
    images: [
      {
        url: '/og-careers.jpg',
        width: 1200,
        height: 630,
        alt: 'Features Digital Careers - Join Our Creative Team'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers - Join Our Creative Team | Features Digital',
    description: 'Join Features Digital Branding & Marketing Agency. Explore exciting career opportunities in design, development, marketing, and strategy.',
    images: ['/og-careers.jpg']
  },
  alternates: {
    canonical: '/careers'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}