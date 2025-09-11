import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { prisma } from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';
import { createCorsResponse, createCorsErrorResponse, handleCorsOptions } from '@/lib/cors';

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}

// GET /api/site/settings - Get site settings
export async function GET() {
  try {
    const settings = await prisma.site_settings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return createCorsResponse({
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

    return createCorsResponse(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return createCorsErrorResponse('Failed to fetch site settings', 500);
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

    // Define settings to update
    const settingsToUpdate = [
      { key: 'site_name', value: siteName },
      { key: 'site_description', value: siteDescription },
      { key: 'logo_url', value: logoUrl },
      { key: 'favicon_url', value: faviconUrl },
      { key: 'primary_color', value: primaryColor },
      { key: 'secondary_color', value: secondaryColor },
      { key: 'footer_text', value: footerText },
      { key: 'social_links', value: JSON.stringify(socialLinks || {}) },
      { key: 'seo_title', value: seoTitle },
      { key: 'seo_description', value: seoDescription },
      { key: 'seo_keywords', value: seoKeywords },
      { key: 'google_analytics', value: googleAnalytics }
    ];

    // Update or create each setting
    const updatedSettings = [];
    for (const setting of settingsToUpdate) {
      if (setting.value !== undefined && setting.value !== null) {
        const upsertedSetting = await prisma.site_settings.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            updated_at: new Date()
          },
          create: {
            id: createId(),
            key: setting.key,
            value: setting.value,
            type: 'text',
            is_active: true
          }
        });
        updatedSettings.push(upsertedSetting);
      }
    }

    return NextResponse.json(updatedSettings);
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

    // Define settings to create
    const settingsToCreate = [
      { key: 'site_name', value: siteName },
      { key: 'site_description', value: siteDescription },
      { key: 'logo_url', value: logoUrl },
      { key: 'favicon_url', value: faviconUrl },
      { key: 'primary_color', value: primaryColor },
      { key: 'secondary_color', value: secondaryColor },
      { key: 'footer_text', value: footerText },
      { key: 'social_links', value: JSON.stringify(socialLinks || {}) },
      { key: 'seo_title', value: seoTitle },
      { key: 'seo_description', value: seoDescription },
      { key: 'seo_keywords', value: seoKeywords },
      { key: 'google_analytics', value: googleAnalytics }
    ];

    // Create each setting
    const createdSettings = [];
    for (const setting of settingsToCreate) {
      if (setting.value !== undefined && setting.value !== null) {
        const createdSetting = await prisma.site_settings.create({
          data: {
            id: createId(),
            key: setting.key,
            value: setting.value,
            type: 'text',
            is_active: true
          }
        });
        createdSettings.push(createdSetting);
      }
    }

    return NextResponse.json(createdSettings, { status: 201 });
  } catch (error) {
    console.error('Error creating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to create site settings' },
      { status: 500 }
    );
  }
}