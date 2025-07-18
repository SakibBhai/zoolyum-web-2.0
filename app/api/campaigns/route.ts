import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause = status ? { status } : {};

    const campaigns = await prisma.campaign.findMany({
      where: whereClause,
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        status: true,
        startDate: true,
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, shortDescription, content, status, startDate, endDate } = body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        slug,
        shortDescription,
        content,
        status: status || 'DRAFT',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}