import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Github, Calendar, User, Clock, Target, Lightbulb, Cog, Trophy, Quote } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

interface PortfolioPageProps {
  params: Promise<{
    slug: string
  }>
}

interface ProcessStep {
  title: string
  description: string
}

interface ResultMetric {
  value: string
  label: string
}

interface ProjectResults {
  metrics?: ResultMetric[]
  impact?: string
}

interface ProjectTestimonial {
  quote?: string
  author?: string
  company?: string
  image?: string
}

// Fetch project data directly from database
async function getProject(slug: string) {
  try {
    // First try to find by ID (if slug is a UUID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    let project;
    
    if (isUUID) {
      // If slug is a UUID, search by ID
      project = await prisma.project.findFirst({
        where: {
          id: slug
          // Removed status filter to show all projects including planning
        },
        include: {
          clients: true
        }
      })
    } else {
      // If slug is not a UUID, search by name (converted to slug format)
      project = await prisma.project.findFirst({
        where: {
          name: {
            contains: slug.replace(/-/g, ' '),
            mode: 'insensitive'
          }
          // Removed status filter to show all projects including planning
        },
        include: {
          clients: true
        }
      })
      
      // If not found by name similarity, try exact name match with slug conversion
      if (!project) {
        const projects = await prisma.project.findMany({
          include: {
            clients: true
          }
        })
        
        // Find project where name converts to the same slug
        project = projects.find(p => 
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug
        ) || null
      }
    }
    
    return project
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params
  const portfolio = await getProject(slug)
  
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found | Zoolyum',
      description: 'The requested portfolio item could not be found.'
    }
  }

  return {
    title: `${portfolio.name} | Zoolyum Portfolio`,
    description: portfolio.description,
    openGraph: {
      title: portfolio.name,
      description: portfolio.description || undefined
    }
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params
  const portfolio = await getProject(slug)

  if (!portfolio) {
    notFound()
  }

  // Mock data for rich content fields that should come from admin form
  // In a real implementation, these would be stored in the database
  const mockOverview = "This project represents a comprehensive digital transformation initiative that required strategic planning, innovative design thinking, and technical excellence to deliver exceptional results for our client."
  
  const mockChallenge = "The client faced significant challenges with their existing digital presence, including outdated technology, poor user experience, and declining engagement metrics that were impacting their business growth."
  
  const mockSolution = "We developed a comprehensive solution that addressed all pain points through modern technology stack, user-centered design principles, and data-driven optimization strategies."
  
  const mockProcessSteps: ProcessStep[] = [
    {
      title: "Discovery & Research",
      description: "Conducted comprehensive user research, competitive analysis, and stakeholder interviews to understand project requirements and constraints."
    },
    {
      title: "Strategy & Planning",
      description: "Developed detailed project roadmap, technical architecture, and design system to guide the implementation process."
    },
    {
      title: "Design & Prototyping",
      description: "Created wireframes, mockups, and interactive prototypes to validate design concepts and user experience flows."
    },
    {
      title: "Development & Testing",
      description: "Built the solution using modern technologies with comprehensive testing to ensure quality and performance."
    },
    {
      title: "Launch & Optimization",
      description: "Deployed the solution and monitored performance metrics to optimize and refine the user experience."
    }
  ]
  
  const mockResults: ProjectResults = {
    metrics: [
      { label: "Performance Increase", value: "40%" },
      { label: "User Engagement", value: "+65%" },
      { label: "Conversion Rate", value: "+25%" },
      { label: "Load Time Reduction", value: "60%" }
    ],
    impact: "The project delivered exceptional results, significantly improving user experience and business metrics while establishing a scalable foundation for future growth."
  }
  
  const mockTestimonial: ProjectTestimonial = {
    quote: "Working with Zoolyum was an exceptional experience. They delivered beyond our expectations and transformed our digital presence completely.",
    author: "Sarah Johnson",
    company: "Tech Innovations Inc."
  }
  
  const mockTechnologies = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"]
  const mockServices = ["Web Development", "UI/UX Design", "Digital Strategy", "Performance Optimization"]
  const mockGallery = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600"
  ]

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
      <Header />
      
      <main className="pt-24">
          {/* Hero Section */}
          <section className="relative h-[60vh] min-h-[500px] overflow-hidden rounded-2xl mb-16">
            <Image
              src={'/placeholder.svg?height=600&width=1200'}
              alt={portfolio.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#E9E7E2]/20 text-[#E9E7E2] border-[#E9E7E2]/30">
                  {portfolio.type || 'Project'}
                </Badge>
                {portfolio.start_date && (
                  <Badge variant="secondary" className="bg-[#E9E7E2]/20 text-[#E9E7E2] border-[#E9E7E2]/30">
                    {new Date(portfolio.start_date).getFullYear()}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {portfolio.name}
              </h1>
              <p className="text-xl text-[#E9E7E2]/90 max-w-3xl">
                {portfolio.description}
              </p>
            </div>
          </section>

          {/* Project Details */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-8">
                <Link href="/portfolio">
                  <Button variant="ghost" size="icon" className="text-[#E9E7E2] hover:bg-[#E9E7E2]/10">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="text-sm text-[#E9E7E2]/60">
                  <Link href="/portfolio" className="hover:text-[#E9E7E2] transition-colors">
                    Portfolio
                  </Link>
                  <span className="mx-2">/</span>
                  <span>{portfolio.type || 'Project'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {portfolio.start_date && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                      Year
                    </h3>
                    <p className="text-[#E9E7E2]">{new Date(portfolio.start_date).getFullYear()}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                    Category
                  </h3>
                  <p className="text-[#E9E7E2]">{portfolio.type || 'Project'}</p>
                </div>
                {portfolio.clients && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                      Client
                    </h3>
                    <p className="text-[#E9E7E2]">{portfolio.clients.name}</p>
                  </div>
                )}
                {portfolio.start_date && portfolio.end_date && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                      Duration
                    </h3>
                    <p className="text-[#E9E7E2]">
                      {Math.ceil((new Date(portfolio.end_date).getTime() - new Date(portfolio.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                    </p>
                  </div>
                )}
              </div>

              {/* Project Links */}
              <div className="flex gap-4 mb-12">
                <Button asChild className="bg-[#FF5001] hover:bg-[#FF5001]/90 text-white">
                  <Link href="#" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Live Project
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-[#E9E7E2]/30 text-[#E9E7E2] hover:bg-[#E9E7E2]/10">
                  <Link href="#" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    View Code
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Project Overview */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p className="text-[#E9E7E2]/80 leading-relaxed mb-6">
                      {portfolio.description}
                    </p>
                    <p className="text-[#E9E7E2]/80 leading-relaxed">
                      {mockOverview}
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-[#E9E7E2]/5 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-6">Project Details</h3>
                    <div className="space-y-4">
                      {portfolio.clients && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                            Client
                          </h4>
                          <p className="text-[#E9E7E2]">{portfolio.clients.name}</p>
                        </div>
                      )}
                      {portfolio.start_date && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                            Year
                          </h4>
                          <p className="text-[#E9E7E2]">{new Date(portfolio.start_date).getFullYear()}</p>
                        </div>
                      )}
                      {portfolio.end_date && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                            Duration
                          </h4>
                          <p className="text-[#E9E7E2]">
                            {portfolio.start_date && portfolio.end_date ? 
                              Math.ceil((new Date(portfolio.end_date).getTime() - new Date(portfolio.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)) + ' months'
                              : 'N/A'
                            }
                          </p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                          Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mockServices.map((service, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#FF5001]/20 text-[#FF5001] border-[#FF5001]/30">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mockTechnologies.map((tech, index) => (
                            <Badge key={index} variant="outline" className="border-[#E9E7E2]/30 text-[#E9E7E2]">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Challenge & Solution */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#FF5001]/20 rounded-lg">
                      <Target className="h-6 w-6 text-[#FF5001]" />
                    </div>
                    <h2 className="text-3xl font-bold">The Challenge</h2>
                  </div>
                  <p className="text-[#E9E7E2]/80 leading-relaxed">
                    {mockChallenge}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#FF5001]/20 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-[#FF5001]" />
                    </div>
                    <h2 className="text-3xl font-bold">The Solution</h2>
                  </div>
                  <p className="text-[#E9E7E2]/80 leading-relaxed">
                    {mockSolution}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-12">
                <div className="p-2 bg-[#FF5001]/20 rounded-lg">
                  <Cog className="h-6 w-6 text-[#FF5001]" />
                </div>
                <h2 className="text-3xl font-bold">Our Process</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockProcessSteps.map((step, index) => (
                  <Card key={index} className="bg-[#E9E7E2]/5 border-[#E9E7E2]/10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-[#FF5001] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-[#E9E7E2]/80">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Project Gallery */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12">Project Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGallery.map((image, index) => (
                  <div key={index} className="aspect-[4/3] relative overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${portfolio.name} gallery image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Results & Impact */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-12">
                <div className="p-2 bg-[#FF5001]/20 rounded-lg">
                  <Trophy className="h-6 w-6 text-[#FF5001]" />
                </div>
                <h2 className="text-3xl font-bold">Results & Impact</h2>
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {mockResults.metrics?.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-[#FF5001] mb-2">{metric.value}</div>
                    <div className="text-[#E9E7E2]/80">{metric.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Impact Description */}
              <div className="bg-[#E9E7E2]/5 rounded-lg p-8">
                <p className="text-lg text-[#E9E7E2]/80 leading-relaxed">
                  {mockResults.impact}
                </p>
              </div>
            </div>
          </section>

          {/* Client Testimonial */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="p-2 bg-[#FF5001]/20 rounded-lg">
                    <Quote className="h-6 w-6 text-[#FF5001]" />
                  </div>
                  <h2 className="text-3xl font-bold">Client Testimonial</h2>
                </div>
                
                <blockquote className="text-2xl font-medium text-[#E9E7E2] mb-8 leading-relaxed">
                  "{mockTestimonial.quote}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-[#FF5001]/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-[#FF5001]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-[#E9E7E2]">{mockTestimonial.author}</div>
                    <div className="text-[#E9E7E2]/60">{mockTestimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Explore More Projects */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Explore More Projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="Digital Marketing Campaign"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Digital Marketing Campaign</h3>
                  <p className="text-[#E9E7E2]/60">Comprehensive digital strategy for tech startup</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="E-commerce Platform"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">E-commerce Platform</h3>
                  <p className="text-[#E9E7E2]/60">Complete UX/UI redesign for online retailer</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 border-t border-[#E9E7E2]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Brand?</h2>
                <p className="text-lg text-[#E9E7E2]/80 mb-8 max-w-2xl mx-auto">
                  Discover how we can help you achieve similar results and elevate your brand to new heights.
                </p>
                <Link href="/contact">
                  <Button size="lg" className="bg-[#E9E7E2] text-[#161616] hover:bg-[#E9E7E2]/90 text-lg px-8 py-4">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
  )
}

export async function generateStaticParams() {
  try {
    // If DATABASE_URL is not set during build (e.g., preview), avoid crashing
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not available at build time; skipping static params for portfolio')
      return []
    }

    const projects = await prisma.project.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    })

    return projects
      .map(p => p.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0)
      .map(id => ({ slug: id }))
  } catch (error) {
    console.error('Error generating static params (portfolio):', error)
    return []
  }
}