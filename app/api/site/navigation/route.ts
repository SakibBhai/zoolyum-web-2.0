import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

// GET /api/site/navigation - Get navigation menu items
export async function GET() {
  try {
    const menuItems = await prisma.navigation_menu.findMany({
      where: { is_active: true },
        orderBy: { order: 'asc' }
    });

    if (menuItems.length === 0) {
      // Return default navigation if none exist
      return NextResponse.json([
        {
          label: "Home",
          url: "/",
          type: "internal",
          order: 1,
          isVisible: true
        },
        {
          label: "About",
          url: "/about",
          type: "internal",
          order: 2,
          isVisible: true
        },
        {
          label: "Services",
          url: "/services",
          type: "internal",
          order: 3,
          isVisible: true
        },
        {
          label: "Blog",
          url: "/blog",
          type: "internal",
          order: 4,
          isVisible: true
        },
        {
          label: "Contact",
          url: "/contact",
          type: "internal",
          order: 5,
          isVisible: true
        }
      ]);
    }

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching navigation menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation menu' },
      { status: 500 }
    );
  }
}

// POST /api/site/navigation - Create new navigation item (Admin only)
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
    const { label, url, order, parent_id: parentId } = body;

    const menuItem = await prisma.navigation_menu.create({
      data: {
        id: createId(),
        label,
        url,
        order: order || 0,
        parent_id: parentId || null,
        is_active: true,
        updated_at: new Date()
      }
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to create navigation item' },
      { status: 500 }
    );
  }
}

// PUT /api/site/navigation - Bulk update navigation menu (Admin only)
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
    const { menuItems } = body;

    if (!Array.isArray(menuItems)) {
      return NextResponse.json(
        { error: 'Menu items must be an array' },
        { status: 400 }
      );
    }

    // Delete existing menu items
    await prisma.navigation_menu.deleteMany({
      where: { is_active: true }
    });

    // Create new menu items
    const newMenuItems = await prisma.navigation_menu.createMany({
      data: menuItems.map((item: any, index: number) => ({
        id: createId(),
        label: item.label,
        url: item.url,
        order: item.order || index,
        parent_id: item.parentId || null,
        is_active: true,
        updated_at: new Date()
      }))
    });

    // Fetch and return the created menu items
    const createdMenuItems = await prisma.navigation_menu.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(createdMenuItems);
  } catch (error) {
    console.error('Error updating navigation menu:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation menu' },
      { status: 500 }
    );
  }
}