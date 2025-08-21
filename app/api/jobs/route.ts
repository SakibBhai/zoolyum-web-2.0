import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/stack-auth';

// Validation schema for job creation/update
const jobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  department: z.string().min(1, 'Department is required').max(100),
  location: z.string().min(1, 'Location is required').max(100),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  employmentType: z.enum(['Remote', 'On-site', 'Hybrid']),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional().default('USD'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
  perks: z.string().optional(),
  skills: z.array(z.string()).default([]),
  experience: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  applicationDeadline: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// GET /api/jobs - Fetch all published jobs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const jobType = searchParams.get('jobType');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const includeUnpublished = searchParams.get('includeUnpublished');
    const published = searchParams.get('published');

    // Build where clause for filtering
    const where: any = {};

    // Handle published filter - admin can see all jobs
    if (includeUnpublished !== 'true') {
      where.published = true;
    } else if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }
    // If includeUnpublished is true and no published filter, show all

    if (department) {
      where.department = department;
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (location) {
      where.location = location;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { requirements: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Pagination
    const pageSize = limit ? parseInt(limit) : 10;
    const currentPage = page ? parseInt(page) : 1;
    const skip = (currentPage - 1) * pageSize;

    // Fetch jobs with pagination
    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        take: pageSize,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          department: true,
          location: true,
          jobType: true,
          employmentType: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          description: true,
          skills: true,
          experience: true,
          featured: true,
          applicationDeadline: true,
          createdAt: true,
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page: currentPage,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (in development, any authenticated user is admin)
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: user.email || user.primaryEmail || '' },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingJob = await prisma.job.findUnique({
      where: { slug },
    });

    if (existingJob) {
      return NextResponse.json(
        { error: 'A job with this title already exists' },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        slug,
        createdBy: adminUser.id,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}