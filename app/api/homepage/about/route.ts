import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/homepage/about - Get about section content
export async function GET() {
  try {
    const about = await prisma.homepage_about.findFirst({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });

    if (!about) {
      // Return default about content if none exists
      return NextResponse.json({
        title: "About Zoolyum",
        subtitle: "Strategic Brand Alchemy for Growth",
        description: "Zoolyum is a strategic brand agency that transforms businesses into powerful market forces. We blend analytical precision with creative intuition to create brand experiences that capture attention and forge lasting connections with audiences.",
        ctaText: "Learn more about our agency",
        ctaUrl: "/about"
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

// PUT /api/homepage/about - Update about section content (Admin only)
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
    const { title, subtitle, description, image, ctaText, ctaUrl } = body;

    // Deactivate existing about sections
    await prisma.homepage_about.updateMany({
      where: { is_active: true },
      data: { is_active: false }
    });

    // Create new active about section
    const { createId } = await import('@paralleldrive/cuid2');
    const about = await prisma.homepage_about.create({
      data: {
        id: createId(),
        title,
        subtitle,
        description,
        image,
        cta_text: ctaText,
        cta_url: ctaUrl,
        is_active: true,
        updated_at: new Date()
      }
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}

// POST /api/homepage/about - Create new about section (Admin only)
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
    const { title, subtitle, description, image, ctaText, ctaUrl } = body;

    const { createId } = await import('@paralleldrive/cuid2');
    const about = await prisma.homepage_about.create({
      data: {
        id: createId(),
        title,
        subtitle,
        description,
        image,
        cta_text: ctaText,
        cta_url: ctaUrl,
        is_active: false, // New sections start as inactive
        updated_at: new Date()
      }
    });

    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    console.error('Error creating about content:', error);
    return NextResponse.json(
      { error: 'Failed to create about content' },
      { status: 500 }
    );
  }
}