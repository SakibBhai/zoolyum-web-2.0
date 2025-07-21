import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/stack-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/site/navigation/[id] - Get a specific navigation item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const menuItem = await prisma.navigationMenu.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation item' },
      { status: 500 }
    );
  }
}

// PUT /api/site/navigation/[id] - Update a specific navigation item (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { label, url, type, order, isVisible, parentId, isActive } = body;

    const menuItem = await prisma.navigationMenu.update({
      where: { id },
      data: {
        label,
        url,
        type,
        order,
        isVisible,
        parentId,
        isActive
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

// DELETE /api/site/navigation/[id] - Delete a specific navigation item (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.navigationMenu.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Navigation item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}