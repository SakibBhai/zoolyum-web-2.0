import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { prisma } from '@/lib/prisma'

interface Project {
  id: string
  title: string
  overview: string | null
  category: string | null
  slug: string
  createdAt: Date | null
  updatedAt: Date | null
}

interface ProjectsGridProps {
  category?: string
  limit?: number
}

async function getProjects({ category, limit }: ProjectsGridProps = {}): Promise<Project[]> {
  const whereClause: any = {}
  
  if (category && category !== 'all') {
    whereClause.category = category
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    orderBy: [
      { createdAt: 'desc' }
    ],
    take: limit,
  })

  return projects
}

export async function ProjectsGrid({ category, limit }: ProjectsGridProps) {
  const projects = await getProjects({ category, limit })

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
          <Link href={`/portfolio/${project.slug}`} className="block">
            <Card className="h-full bg-[#1A1A1A] border-[#333333] overflow-hidden transform-gpu transition-all duration-300 hover:scale-105">
              <div className="overflow-hidden">
                <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src="/placeholder.svg"
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full aspect-[3/2] object-cover"
                    priority={index < 3} // Prioritize loading for first 3 images
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <span className="text-[#FF5001] text-sm">{project.category || 'General'}</span>
                <h3 className="text-xl font-bold mt-1 group-hover:text-[#FF5001] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#E9E7E2]/70 mt-2 line-clamp-3">
                  {project.overview || 'No description available.'}
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