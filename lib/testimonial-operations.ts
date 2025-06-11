import { prisma } from '@/lib/db'
import { Testimonial } from '@prisma/client'

export interface TestimonialFormData {
  name: string
  position?: string
  company?: string
  content: string
  rating?: number
  imageUrl?: string
  featured?: boolean
  order?: number
}

export async function getAllTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    })
    return testimonials
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    throw new Error('Failed to fetch testimonials')
  }
}

export async function getTestimonialById(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })
    return testimonial
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    throw new Error('Failed to fetch testimonial')
  }
}

export async function createTestimonial(data: TestimonialFormData) {
  try {
    // Get the highest order value to place new testimonial at the end
    const highestOrder = await prisma.testimonial.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    
    const nextOrder = highestOrder ? highestOrder.order + 1 : 1

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        position: data.position || null,
        company: data.company || null,
        content: data.content,
        rating: data.rating || 5,
        imageUrl: data.imageUrl || null,
        featured: data.featured || false,
        order: data.order || nextOrder,
      },
    })
    return testimonial
  } catch (error) {
    console.error('Error creating testimonial:', error)
    throw new Error('Failed to create testimonial')
  }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialFormData>) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.content && { content: data.content }),
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.order !== undefined && { order: data.order }),
      },
    })
    return testimonial
  } catch (error) {
    console.error('Error updating testimonial:', error)
    throw new Error('Failed to update testimonial')
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    throw new Error('Failed to delete testimonial')
  }
}

export async function toggleTestimonialFeatured(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { featured: true },
    })

    if (!testimonial) {
      throw new Error('Testimonial not found')
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { featured: !testimonial.featured },
    })

    return updatedTestimonial
  } catch (error) {
    console.error('Error toggling testimonial featured status:', error)
    throw new Error('Failed to toggle testimonial featured status')
  }
}

export async function bulkDeleteTestimonials(ids: string[]) {
  try {
    await prisma.testimonial.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
    return { success: true, deletedCount: ids.length }
  } catch (error) {
    console.error('Error bulk deleting testimonials:', error)
    throw new Error('Failed to bulk delete testimonials')
  }
}

export async function bulkUpdateTestimonialStatus(ids: string[], featured: boolean) {
  try {
    await prisma.testimonial.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        featured,
      },
    })
    return { success: true, updatedCount: ids.length }
  } catch (error) {
    console.error('Error bulk updating testimonial status:', error)
    throw new Error('Failed to bulk update testimonial status')
  }
}

export async function searchTestimonials(query: string, status?: 'featured' | 'regular') {
  try {
    const whereClause: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    }

    if (status === 'featured') {
      whereClause.featured = true
    } else if (status === 'regular') {
      whereClause.featured = false
    }

    const testimonials = await prisma.testimonial.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    })

    return testimonials
  } catch (error) {
    console.error('Error searching testimonials:', error)
    throw new Error('Failed to search testimonials')
  }
}

export async function getTestimonialsByDateRange(startDate: Date, endDate: Date) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return testimonials
  } catch (error) {
    console.error('Error fetching testimonials by date range:', error)
    throw new Error('Failed to fetch testimonials by date range')
  }
}