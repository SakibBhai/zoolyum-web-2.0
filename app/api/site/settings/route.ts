import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { prisma } from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

// GET /api/site/settings - Get site settings
export async function GET() {
  try {
    const settings = await prisma.site_settings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        siteName: "Zoolyum",
        siteDescription: "Brand Strategy & Digital Innovation Agency",
        logoUrl: "/logo.png",
        faviconUrl: "/favicon.ico",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        footerText: "© 2024 Zoolyum. All rights reserved.",
        socialLinks: {
          facebook: "https://facebook.com/zoolyum",
          twitter: "https://twitter.com/zoolyum",
          linkedin: "https://linkedin.com/company/zoolyum",
          instagram: "https://instagram.com/zoolyum"
        },
        seoTitle: "Zoolyum | Brand Strategy & Digital Innovation Agency",
        seoDescription: "Transform your business with strategic brand development and digital innovation. We create powerful market forces through analytical precision and creative intuition.",
        seoKeywords: "brand strategy, digital innovation, marketing agency, brand development",
        googleAnalytics: ""
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PUT /api/site/settings - Update site settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      siteName,
      siteDescription,
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      footerText,
      socialLinks,
      seoTitle,
      seoDescription,
      seoKeywords,
      googleAnalytics
    } = body;

    // Check if settings exist
    const existingSettings = await prisma.site_settings.findFirst();
    
    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.site_settings.update({
        where: { id: existingSettings.id },
        data: {
          site_name: siteName,
          site_description: siteDescription,
          logo_url: logoUrl,
          favicon_url: faviconUrl,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          footer_text: footerText,
          social_links: socialLinks || {},
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
          google_analytics: googleAnalytics
        }
      });
    } else {
      // Create new settings
      settings = await prisma.site_settings.create({
        data: {
          id: createId(),
          updated_at: new Date(),
          site_name: siteName,
          site_description: siteDescription,
          logo_url: logoUrl,
          favicon_url: faviconUrl,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          footer_text: footerText,
          social_links: socialLinks || {},
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
          google_analytics: googleAnalytics
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}

// POST /api/site/settings - Create new site settings (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      siteName,
      siteDescription,
      logoUrl,
      faviconUrl,
      primaryColor,
      secondaryColor,
      footerText,
      socialLinks,
      seoTitle,
      seoDescription,
      seoKeywords,
      googleAnalytics
    } = body;

    const settings = await prisma.site_settings.create({
      data: {
        id: createId(),
        updated_at: new Date(),
        site_name: siteName,
        site_description: siteDescription,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        footer_text: footerText,
        social_links: socialLinks || {},
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        google_analytics: googleAnalytics
      }
    });

    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    console.error('Error creating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to create site settings' },
      { status: 500 }
    );
  }
}