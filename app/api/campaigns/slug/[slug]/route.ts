import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { 
        slug: slug,
        status: 'PUBLISHED' // Only return published campaigns
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        content: true,
        status: true,
        imageUrls: true,
        videoUrls: true,
        enableForm: true,
        formFields: true,
        ctas: true,
        successMessage: true,
        redirectUrl: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}