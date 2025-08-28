import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/homepage/sections - Get all homepage sections
export async function GET() {
  try {
    const sections = await prisma.homepage_sections.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    if (sections.length === 0) {
      // Return default sections if none exist
      return NextResponse.json([
        {
          section_type: "our_team",
        title: "Our Team",
        subtitle: "Meet the Experts",
        description: "Our diverse team of strategists, designers, and marketers brings years of experience to every project.",
        is_active: true,
        order: 1
        },
        {
          section_type: "client_success",
        title: "Client Success",
        subtitle: "What Our Clients Say",
        description: "Hear from the businesses we've helped transform and grow.",
        is_active: true,
        order: 2
        },
        {
          section_type: "get_started",
        title: "Get Started",
        subtitle: "Ready to Transform Your Brand?",
        description: "Let's discuss how we can help your business achieve its full potential.",
        is_active: true,
        order: 3
        }
      ]);
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage sections' },
      { status: 500 }
    );
  }
}

// POST /api/homepage/sections - Create new homepage section (Admin only)
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
    const { sectionType, title, subtitle, content, isVisible, order, metadata } = body;

    const section = await prisma.homepage_sections.create({
      data: {
        section_type: sectionType,
        title,
        subtitle,
        description: content,
        is_active: isVisible !== undefined ? isVisible : true,
        order: order || 0,
        metadata: metadata || {}
      }
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage section:', error);
    return NextResponse.json(
      { error: 'Failed to create homepage section' },
      { status: 500 }
    );
  }
}

// PUT /api/homepage/sections - Bulk update homepage sections (Admin only)
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
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Sections must be an array' },
        { status: 400 }
      );
    }

    // Delete existing sections
    await prisma.homepage_sections.deleteMany({
      where: { is_active: true }
    });

    // Create new sections
    const newSections = await prisma.homepage_sections.createMany({
      data: sections.map((section: any, index: number) => ({
        section_type: section.sectionType,
        title: section.title,
        subtitle: section.subtitle || '',
        description: section.content || '',
        is_active: section.isVisible !== undefined ? section.isVisible : true,
        order: section.order || index,
        metadata: section.metadata || {}
      }))
    });

    // Fetch and return the created sections
    const createdSections = await prisma.homepage_sections.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(createdSections);
  } catch (error) {
    console.error('Error updating homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage sections' },
      { status: 500 }
    );
  }
}