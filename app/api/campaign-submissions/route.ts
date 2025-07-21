import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submissionSchema = z.object({
  campaignId: z.string(),
  data: z.record(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = submissionSchema.parse(body);

    // Verify campaign exists and is published
    const campaign = await prisma.campaign.findUnique({
      where: { id: validatedData.campaignId },
      select: { id: true, status: true, enableForm: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Campaign is not published' },
        { status: 400 }
      );
    }

    if (!campaign.enableForm) {
      return NextResponse.json(
        { error: 'Form submissions are not enabled for this campaign' },
        { status: 400 }
      );
    }

    // Create the submission
    const submission = await prisma.campaignSubmission.create({
      data: {
        campaignId: validatedData.campaignId,
        data: validatedData.data,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        submissionId: submission.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating campaign submission:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}