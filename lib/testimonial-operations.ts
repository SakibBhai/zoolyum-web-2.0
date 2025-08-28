import { prisma } from "@/lib/prisma";

// Types
export interface Testimonial {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  imageUrl?: string;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialStats {
  total: number;
  approved: number;
  pending: number;
  featured: number;
  averageRating: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

// Validation
export function validateTestimonialData(data: any) {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.position || data.position.trim().length < 2) {
    errors.push("Position must be at least 2 characters long");
  }

  if (!data.company || data.company.trim().length < 2) {
    errors.push("Company must be at least 2 characters long");
  }

  if (!data.content || data.content.trim().length < 10) {
    errors.push("Content must be at least 10 characters long");
  }

  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push("Rating must be between 1 and 5");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Testimonial CRUD operations
export async function createTestimonial(
  data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
): Promise<Testimonial> {
  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name,
      position: data.position,
      company: data.company,
      content: data.content,
      rating: data.rating || 5,
      imageUrl: data.imageUrl,
      featured: data.featured || false,
      approved: data.approved || false,
    },
  });

  return mapTestimonialFromDb(testimonial);
}

export async function fetchTestimonials(
  options: {
    limit?: number;
    offset?: number;
    approved?: boolean;
    featured?: boolean;
  } = {}
): Promise<Testimonial[]> {
  const { limit = 50, offset = 0, approved, featured } = options;

  const where: any = {};

  if (approved !== undefined) {
    where.approved = approved;
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return testimonials.map(mapTestimonialFromDb);
}

export async function fetchTestimonial(
  id: string
): Promise<Testimonial | null> {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  return testimonial ? mapTestimonialFromDb(testimonial) : null;
}

export async function updateTestimonial(
  id: string,
  data: Partial<Testimonial>
): Promise<Testimonial | null> {
  const updateData: any = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id" && key !== "createdAt") {
      updateData[key] = value;
    }
  });

  if (Object.keys(updateData).length === 0) return null;

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: updateData,
  });

  return testimonial ? mapTestimonialFromDb(testimonial) : null;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Featured testimonials
export async function getFeaturedTestimonials(
  limit = 6
): Promise<Testimonial[]> {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      featured: true,
      approved: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return testimonials.map(mapTestimonialFromDb);
}

export async function setTestimonialFeatured(
  id: string,
  featured: boolean
): Promise<Testimonial | null> {
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { featured },
  });

  return testimonial ? mapTestimonialFromDb(testimonial) : null;
}

// Approval
export async function approveTestimonial(
  id: string,
  approved: boolean
): Promise<Testimonial | null> {
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { approved },
  });

  return testimonial ? mapTestimonialFromDb(testimonial) : null;
}

// Statistics
export async function getTestimonialStats(): Promise<TestimonialStats> {
  const [total, approved, pending, featured, avgRating, thisMonth, lastMonth] = await Promise.all([
    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { approved: true } }),
    prisma.testimonial.count({ where: { approved: false } }),
    prisma.testimonial.count({ where: { featured: true } }),
    prisma.testimonial.aggregate({
      where: { approved: true },
      _avg: { rating: true },
    }),
    prisma.testimonial.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.testimonial.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const averageRating = avgRating._avg.rating || 0;
  const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  return {
    total,
    approved,
    pending,
    featured,
    averageRating: Math.round(averageRating * 100) / 100,
    thisMonth,
    lastMonth,
    growth: Math.round(growth * 100) / 100,
  };
}

// Get testimonial by ID
export async function getTestimonialById(
  id: string
): Promise<Testimonial | null> {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  return testimonial ? mapTestimonialFromDb(testimonial) : null;
}

// Helper function to map database rows to TypeScript objects
function mapTestimonialFromDb(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    company: row.company,
    content: row.content,
    rating: row.rating,
    imageUrl: row.imageUrl,
    featured: row.featured,
    approved: row.approved,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}
