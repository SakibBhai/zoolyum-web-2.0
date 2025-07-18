"use server"

import { prisma } from '@/lib/prisma'

export async function getProjectCategories(): Promise<string[]> {
  try {
    const categories = await prisma.project.findMany({
      where: {
        published: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    })

    return categories.map(item => item.category).filter(Boolean)
  } catch (error) {
    console.error('Error fetching project categories:', error)
    return []
  }
}

export async function getFeaturedProject() {
  try {
    const featuredProject = await prisma.project.findFirst({
      where: {
        published: true,
        featured: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return featuredProject
  } catch (error) {
    console.error('Error fetching featured project:', error)
    return null
  }
}