import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PageTransition } from '@/components/page-transition'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Github, Calendar, User, Clock, Target, Lightbulb, Cog, Trophy } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

interface PortfolioPageProps {
  params: Promise<{
    slug: string
  }>
}

interface GalleryItem {
  image_url?: string
  image?: string
  title?: string
  description?: string
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
    const project = await prisma.project.findFirst({
      where: {
        id: slug, // Using id field to match the slug parameter
        status: { not: 'planning' } // Only return non-planning projects for public access
      },
      include: {
        clients: true
      }
    })
    
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

  return (
    <PageTransition>
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


            </div>
          </section>

          {/* Project Overview */}
          {portfolio.description && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                    <div className="prose prose-lg prose-invert max-w-none">
                      <p className="text-[#E9E7E2]/80 leading-relaxed">
                        {portfolio.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="bg-[#E9E7E2]/5 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-6">Essentials</h3>
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

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}













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
    </PageTransition>
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