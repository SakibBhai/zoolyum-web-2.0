import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/homepage/hero - Get hero section content
export async function GET() {
  try {
    const hero = await prisma.homepageHero.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!hero) {
      // Return default hero content if none exists
      return NextResponse.json({
        title: "Z o o l y u m",
        subtitle: "Brand Strategy & Digital Innovation",
        description: "We transform brands through strategic thinking and creative excellence, crafting digital experiences that resonate and inspire action.",
        primaryCta: { text: "Start Your Project", url: "/contact" },
        secondaryCta: { text: "View Our Work", url: "/portfolio" }
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

// PUT /api/homepage/hero - Update hero section content (Admin only)
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
    const { title, subtitle, description, primaryCta, secondaryCta, backgroundImage } = body;

    // Deactivate existing hero sections
    await prisma.homepageHero.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new active hero section
    const hero = await prisma.homepageHero.create({
      data: {
        title,
        subtitle,
        description,
        primaryCta,
        secondaryCta,
        backgroundImage,
        isActive: true
      }
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error updating hero content:', error);
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    );
  }
}

// POST /api/homepage/hero - Create new hero section (Admin only)
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
    const { title, subtitle, description, primaryCta, secondaryCta, backgroundImage } = body;

    const hero = await prisma.homepageHero.create({
      data: {
        title,
        subtitle,
        description,
        primaryCta,
        secondaryCta,
        backgroundImage,
        isActive: false // New sections start as inactive
      }
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error('Error creating hero content:', error);
    return NextResponse.json(
      { error: 'Failed to create hero content' },
      { status: 500 }
    );
  }
}