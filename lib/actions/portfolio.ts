"use server"

import { prisma } from '@/lib/prisma'

export async function getProjectCategories(): Promise<string[]> {
  try {
    const projects = await prisma.project.findMany({
      select: {
        type: true,
      },
      orderBy: {
        type: 'asc',
      },
    })

    // Get unique types and filter out null/undefined values
    const uniqueTypes = [...new Set(projects.map(item => item.type).filter(Boolean))]
    return uniqueTypes
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