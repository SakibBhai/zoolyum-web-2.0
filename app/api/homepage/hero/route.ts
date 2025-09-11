import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { prisma } from '@/lib/prisma';
import { createCorsResponse, createCorsErrorResponse, handleCorsOptions } from '@/lib/cors';

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return handleCorsOptions();
}

// GET /api/homepage/hero - Get hero section content
export async function GET() {
  try {
    const hero = await prisma.homepage_hero.findFirst({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });

    if (!hero) {
      // Return default hero content if none exists
      return createCorsResponse({
      title: "Z o o l y u m",
      subtitle: "Brand Strategy & Digital Innovation",
      description: "We transform brands through strategic thinking and creative excellence, crafting digital experiences that resonate and inspire action.",
      primaryCta: { text: "Start Your Project", url: "/contact" },
      secondaryCta: { text: "View Our Work", url: "/portfolio" }
    });
    }

    return createCorsResponse(hero);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return createCorsErrorResponse('Failed to fetch hero content', 500);
  }
}

// PUT /api/homepage/hero - Update hero section content (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createCorsErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { title, subtitle, description, primaryCta, secondaryCta, backgroundImage } = body;

    // Deactivate existing hero sections
    await prisma.homepage_hero.updateMany({
      where: { is_active: true },
      data: { is_active: false }
    });

    // Create new active hero section
    const { createId } = await import('@paralleldrive/cuid2');
    const hero = await prisma.homepage_hero.create({
      data: {
        id: createId(),
        title,
        subtitle,
        description,
        primary_cta: primaryCta,
        secondary_cta: secondaryCta,
        background_image: backgroundImage,
        is_active: true,
        updated_at: new Date()
      }
    });

    return createCorsResponse(hero);
  } catch (error) {
    console.error('Error updating hero content:', error);
    return createCorsErrorResponse('Failed to update hero content', 500);
  }
}

// POST /api/homepage/hero - Create new hero section (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return createCorsErrorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { title, subtitle, description, primaryCta, secondaryCta, backgroundImage } = body;

    const { createId } = await import('@paralleldrive/cuid2');
    const hero = await prisma.homepage_hero.create({
      data: {
        id: createId(),
        title,
        subtitle,
        description,
        primary_cta: primaryCta,
        secondary_cta: secondaryCta,
        background_image: backgroundImage,
        is_active: false, // New sections start as inactive
        updated_at: new Date()
      }
    });

    return createCorsResponse(hero, { status: 201 });
  } catch (error) {
    console.error('Error creating hero content:', error);
    return createCorsErrorResponse('Failed to create hero content', 500);
  }
}