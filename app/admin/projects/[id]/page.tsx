'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Edit, ExternalLink, Github, Calendar, User, Clock } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface Project {
  id: string
  name: string
  slug: string
  overview: string
  content?: string
  type: string
  imageUrl?: string
  heroImageUrl?: string
  year?: string
  client?: string
  duration?: string
  services: string[]
  challenge?: string
  solution?: string
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  published: boolean
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function ViewProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          throw new Error('Failed to load project')
        }
        const projectData = await response.json()
        setProject(projectData)
      } catch (error) {
        console.error('Error loading project:', error)
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive',
        })
        router.push('/admin/projects')
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId, router])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#E9E7E2] mb-2">Project not found</h2>
          <p className="text-[#E9E7E2]/60 mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/admin/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#E9E7E2]">{project.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-[#E9E7E2]/60">{project.type}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={project.published ? 'default' : 'secondary'}>
                    {project.published ? 'Published' : 'Draft'}
                  </Badge>
                  {project.featured && (
                    <Badge variant="outline" className="border-[#FF5001] text-[#FF5001]">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {project.projectUrl && (
              <Link href={project.projectUrl} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Site
                </Button>
              </Link>
            )}
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank">
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </Link>
            )}
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Button size="sm" className="bg-[#FF5001] hover:bg-[#FF5001]/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        {project.heroImageUrl && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-[#1A1A1A]">
            <Image
              src={project.heroImageUrl}
              alt={project.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#E9E7E2] mb-3">Overview</h2>
              <p className="text-[#E9E7E2]/80 leading-relaxed">{project.overview}</p>
            </div>

            {/* Challenge */}
            {project.challenge && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#E9E7E2] mb-3">Challenge</h2>
                <p className="text-[#E9E7E2]/80 leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
              </div>
            )}

            {/* Challenge */}
            {project.challenge && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#E9E7E2] mb-3">Challenge</h2>
                <p className="text-[#E9E7E2]/80 leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#E9E7E2] mb-3">Solution</h2>
                <p className="text-[#E9E7E2]/80 leading-relaxed whitespace-pre-wrap">{project.solution}</p>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#E9E7E2] mb-3">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#333333] text-[#E9E7E2]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {project.services && project.services.length > 0 && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#E9E7E2] mb-3">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="border-[#FF5001] text-[#FF5001]">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail */}
            {project.imageUrl && (
              <div className="bg-[#1A1A1A] rounded-lg p-6">
                <h3 className="text-sm font-medium text-[#E9E7E2] mb-3">Thumbnail</h3>
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[#333333]">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Project Meta */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h3 className="text-sm font-medium text-[#E9E7E2] mb-4">Project Details</h3>
              <div className="space-y-3">
                {project.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-[#E9E7E2]/60" />
                    <span className="text-sm text-[#E9E7E2]/80">{project.year}</span>
                  </div>
                )}
                {project.client && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-[#E9E7E2]/60" />
                    <span className="text-sm text-[#E9E7E2]/80">{project.client}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#E9E7E2]/60" />
                    <span className="text-sm text-[#E9E7E2]/80">{project.duration}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#333333]">
                  <div className="text-xs text-[#E9E7E2]/60 space-y-1">
                    <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                    <p>Order: {project.order}</p>
                    <p>Slug: {project.slug}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1A1A1A] rounded-lg p-6">
              <h3 className="text-sm font-medium text-[#E9E7E2] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href={`/admin/projects/${project.id}/edit`} className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </Link>
                {project.projectUrl && (
                  <Link href={project.projectUrl} target="_blank" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                  </Link>
                )}
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}