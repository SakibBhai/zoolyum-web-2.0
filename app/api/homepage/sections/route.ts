import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/homepage/sections - Get all homepage sections
export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    if (sections.length === 0) {
      // Return default sections if none exist
      return NextResponse.json([
        {
          sectionType: "featured_work",
          title: "Featured Work",
          subtitle: "Our Latest Projects",
          content: "Explore our portfolio of successful brand transformations and digital innovations.",
          isVisible: true,
          order: 1
        },
        {
          sectionType: "our_team",
          title: "Our Team",
          subtitle: "Meet the Experts",
          content: "Our diverse team of strategists, designers, and marketers brings years of experience to every project.",
          isVisible: true,
          order: 2
        },
        {
          sectionType: "client_success",
          title: "Client Success",
          subtitle: "What Our Clients Say",
          content: "Hear from the businesses we've helped transform and grow.",
          isVisible: true,
          order: 3
        },
        {
          sectionType: "get_started",
          title: "Get Started",
          subtitle: "Ready to Transform Your Brand?",
          content: "Let's discuss how we can help your business achieve its full potential.",
          isVisible: true,
          order: 4
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

    const section = await prisma.homepageSection.create({
      data: {
        sectionType,
        title,
        subtitle,
        content,
        isVisible: isVisible !== undefined ? isVisible : true,
        order: order || 0,
        metadata: metadata || {},
        isActive: true
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
    await prisma.homepageSection.deleteMany({
      where: { isActive: true }
    });

    // Create new sections
    const newSections = await prisma.homepageSection.createMany({
      data: sections.map((section: any, index: number) => ({
        sectionType: section.sectionType,
        title: section.title,
        subtitle: section.subtitle || '',
        content: section.content || '',
        isVisible: section.isVisible !== undefined ? section.isVisible : true,
        order: section.order || index,
        metadata: section.metadata || {},
        isActive: true
      }))
    });

    // Fetch and return the created sections
    const createdSections = await prisma.homepageSection.findMany({
      where: { isActive: true },
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