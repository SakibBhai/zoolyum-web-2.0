import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { prisma } from '@/lib/prisma'

interface Project {
  id: string
  name: string
  description: string | null
  type: string | null
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
    whereClause.type = category
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
      <div className="text-center py-8 sm:py-12">
        <p className="text-[#E9E7E2]/70 text-base sm:text-lg">No projects found.</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="group h-full"
        >
          <Link href={`/portfolio/${project.id}`} className="block h-full">
            <Card className="h-full bg-[#1A1A1A] border-[#333333] overflow-hidden transform-gpu transition-all duration-300 hover:scale-105 flex flex-col">
              <div className="overflow-hidden">
                <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
                  <Image
                    src="/placeholder.svg"
                    alt={project.name}
                    width={600}
                    height={400}
                    className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3} // Prioritize loading for first 3 images
                  />
                </div>
              </div>
              <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                <span className="text-[#FF5001] text-xs sm:text-sm font-medium">{project.type || 'General'}</span>
                <h3 className="text-lg sm:text-xl font-bold mt-1 group-hover:text-[#FF5001] transition-colors line-clamp-2">
                  {project.name}
                </h3>
                <p className="text-[#E9E7E2]/70 mt-2 text-sm sm:text-base leading-relaxed flex-1 line-clamp-3">
                  {project.description || 'No description available.'}
                </p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#333333]">
                  <span className="text-[#FF5001] font-medium inline-flex items-center group/link text-sm sm:text-base">
                    View Project
                    <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
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