import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { prisma } from '@/lib/prisma'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: string
  imageUrl?: string | null
  published: boolean
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

interface ProjectsGridProps {
  category?: string
  featured?: boolean
  limit?: number
}

async function getProjects({ category, featured, limit }: ProjectsGridProps = {}): Promise<Project[]> {
  const whereClause: any = {
    published: true, // Only show published projects on portfolio
  }
  
  if (featured !== undefined) {
    whereClause.featured = featured
  }
  
  if (category && category !== 'all') {
    whereClause.category = category
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' }
    ],
    take: limit,
  })

  return projects
}

export async function ProjectsGrid({ category, featured, limit }: ProjectsGridProps) {
  const projects = await getProjects({ category, featured, limit })

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#E9E7E2]/70 text-lg">No projects found.</p>
        <p className="text-[#E9E7E2]/50 text-sm mt-2">
          {category && category !== 'all' 
            ? `No projects in the "${category}" category.`
            : 'Check back soon for new projects.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="group"
        >
          <Link href={`/work/${project.slug}`} className="block">
            <Card className="h-full bg-[#1A1A1A] border-[#333333] overflow-hidden transform-gpu transition-all duration-300 hover:scale-105">
              <div className="overflow-hidden">
                <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full aspect-[3/2] object-cover"
                    priority={index < 3} // Prioritize loading for first 3 images
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <span className="text-[#FF5001] text-sm">{project.category}</span>
                <h3 className="text-xl font-bold mt-1 group-hover:text-[#FF5001] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#E9E7E2]/70 mt-2 line-clamp-3">
                  {project.description}
                </p>
                <div className="mt-4 pt-4 border-t border-[#333333]">
                  <span className="text-[#FF5001] font-medium inline-flex items-center group/link">
                    View Project
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  )
}