"use server"

import { prisma } from '@/lib/prisma'

export async function getProjectCategories(): Promise<string[]> {
  try {
    const projects = await prisma.project.findMany({
      select: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    })

    // Get unique categories and filter out null/undefined values
    const uniqueCategories = [...new Set(projects.map(item => item.category).filter(Boolean))]
    return uniqueCategories
  } catch (error) {
    console.error('Error fetching project categories:', error)
    return []
  }
}

export async function getFeaturedProject() {
  try {
    const featuredProject = await prisma.project.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return featuredProject
  } catch (error) {
    console.error('Error fetching featured project:', error)
    return null
  }
}