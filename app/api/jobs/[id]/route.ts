import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { isAdmin } from '@/lib/stack-auth';

// Validation schema for job updates
const jobUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255).optional(),
  department: z.string().min(1, 'Department is required').max(100).optional(),
  location: z.string().min(1, 'Location is required').max(100).optional(),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']).optional(),
  employmentType: z.enum(['Remote', 'On-site', 'Hybrid']).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(),
  description: z.string().min(1, 'Description is required').optional(),
  requirements: z.string().min(1, 'Requirements are required').optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required').optional(),
  perks: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  applicationDeadline: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  imageUrl: z.string().optional(),
  allowCvSubmission: z.boolean().optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/jobs/[id] - Fetch a specific job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - Update a job (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const data: any = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    const validated = z.object({}).passthrough().parse(data);

    const job = await prisma.job.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(job);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Delete a job (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}