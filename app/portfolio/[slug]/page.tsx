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
        slug: slug,
        published: true // Only return published projects for public access
      },
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
    title: `${portfolio.title} | Zoolyum Portfolio`,
    description: portfolio.description,
    openGraph: {
      title: portfolio.title,
      description: portfolio.description,
      images: [portfolio.hero_image_url || portfolio.image_url || '']
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
              src={portfolio.hero_image_url || portfolio.image_url || '/placeholder.svg?height=600&width=1200'}
              alt={portfolio.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#E9E7E2]/20 text-[#E9E7E2] border-[#E9E7E2]/30">
                  {portfolio.category}
                </Badge>
                {portfolio.year && (
                  <Badge variant="secondary" className="bg-[#E9E7E2]/20 text-[#E9E7E2] border-[#E9E7E2]/30">
                    {portfolio.year}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {portfolio.title}
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
                  <span>{portfolio.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {portfolio.year && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                      Year
                    </h3>
                    <p className="text-[#E9E7E2]">{portfolio.year}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                    Category
                  </h3>
                  <p className="text-[#E9E7E2]">{portfolio.category}</p>
                </div>
                {portfolio.client && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                      Client
                    </h3>
                    <p className="text-[#E9E7E2]">{portfolio.client}</p>
                  </div>
                )}
                {portfolio.duration && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-2">
                      Duration
                    </h3>
                    <p className="text-[#E9E7E2]">{portfolio.duration}</p>
                  </div>
                )}
              </div>

              {portfolio.services && portfolio.services.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-4">
                    Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#E9E7E2]/10 text-[#E9E7E2] rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Project Overview */}
          {portfolio.overview && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                    <div className="prose prose-lg prose-invert max-w-none">
                      <p className="text-[#E9E7E2]/80 leading-relaxed">
                        {portfolio.overview}
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="bg-[#E9E7E2]/5 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-6">Essentials</h3>
                      <div className="space-y-4">
                        {portfolio.client && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                              Client
                            </h4>
                            <p className="text-[#E9E7E2]">{portfolio.client}</p>
                          </div>
                        )}
                        {portfolio.year && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                              Year
                            </h4>
                            <p className="text-[#E9E7E2]">{portfolio.year}</p>
                          </div>
                        )}
                        {portfolio.duration && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                              Duration
                            </h4>
                            <p className="text-[#E9E7E2]">{portfolio.duration}</p>
                          </div>
                        )}
                        {portfolio.services && portfolio.services.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#E9E7E2]/60 uppercase tracking-wider mb-1">
                              Services
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {portfolio.services.map((service: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-[#E9E7E2]/10 text-[#E9E7E2] rounded text-xs"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Project Gallery */}
          {portfolio.gallery && Array.isArray(portfolio.gallery) && portfolio.gallery.length > 0 && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-12">Project Gallery</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {(portfolio.gallery as GalleryItem[]).map((item, index) => (
                    <div key={index} className="group">
                      <div className="aspect-[4/3] relative overflow-hidden rounded-lg mb-4">
                        <Image
                          src={item.image_url || item.image || '/placeholder-image.jpg'}
                          alt={item.title || `Gallery image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-[#E9E7E2]/80">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* The Challenge & Solution */}
          {(portfolio.challenge || portfolio.solution) && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                  {portfolio.challenge && (
                    <div>
                      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Lightbulb className="w-8 h-8 text-orange-400" />
                        The Challenge
                      </h2>
                      <p className="text-lg text-[#E9E7E2]/80 leading-relaxed">
                        {portfolio.challenge}
                      </p>
                    </div>
                  )}
                  {portfolio.solution && (
                    <div>
                      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Cog className="w-8 h-8 text-orange-400" />
                        The Solution
                      </h2>
                      <p className="text-lg text-[#E9E7E2]/80 leading-relaxed">
                        {portfolio.solution}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Our Approach */}
          {portfolio.process && Array.isArray(portfolio.process) && portfolio.process.length > 0 && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold mb-12 text-center">Our Approach</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(portfolio.process as unknown as ProcessStep[]).map((step, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-black font-bold text-lg">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-[#E9E7E2]/70 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Results */}
          {portfolio.results && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-12 text-center">Results</h2>
                {(() => {
                  const results = portfolio.results as ProjectResults;
                  const metrics = results?.metrics;
                  
                  if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
                    return null;
                  }
                  
                  return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      {(metrics as ResultMetric[]).map((result, index) => (
                        <div key={index} className="text-center">
                          <div className="text-4xl lg:text-5xl font-bold mb-2 text-[#E9E7E2]">
                            {result.value}
                          </div>
                          <div className="text-[#E9E7E2]/60">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {(portfolio.results as ProjectResults).impact && (
                  <div className="mt-12 max-w-4xl mx-auto text-center">
                    <p className="text-lg text-[#E9E7E2]/80 leading-relaxed">
                      {(portfolio.results as ProjectResults).impact}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Expertise Areas */}
          {portfolio.technologies && portfolio.technologies.length > 0 && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8">Expertise Areas</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolio.technologies.map((tech: string, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-[#E9E7E2]/5 rounded-lg text-center hover:bg-[#E9E7E2]/10 transition-colors"
                      >
                        <span className="text-[#E9E7E2]">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Client Feedback */}
          {portfolio.testimonial && (portfolio.testimonial as ProjectTestimonial).quote && (
            <section className="py-16 border-t border-[#E9E7E2]/10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-12 text-center">Client Feedback</h2>
                <div className="max-w-4xl mx-auto text-center">
                  <div className="mb-8">
                    <div className="text-6xl text-orange-400 mb-6">"</div>
                    <blockquote className="text-2xl text-[#E9E7E2] leading-relaxed mb-8 italic">
                      {(portfolio.testimonial as ProjectTestimonial).quote}
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {(portfolio.testimonial as ProjectTestimonial).image && (
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={(portfolio.testimonial as ProjectTestimonial).image!}
                          alt={(portfolio.testimonial as ProjectTestimonial).author || 'Client'}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="text-left">
                      {(portfolio.testimonial as ProjectTestimonial).author && (
                        <div className="text-orange-400 font-semibold">
                          {(portfolio.testimonial as ProjectTestimonial).author}
                        </div>
                      )}
                      {(portfolio.testimonial as ProjectTestimonial).company && (
                        <div className="text-[#E9E7E2]/60 text-sm">
                          {(portfolio.testimonial as ProjectTestimonial).company}
                        </div>
                      )}
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
      where: { published: true },
      select: { slug: true },
      orderBy: { createdAt: 'desc' },
    })

    return projects
      .map(p => p.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
      .map(slug => ({ slug }))
  } catch (error) {
    console.error('Error generating static params (portfolio):', error)
    return []
  }
}