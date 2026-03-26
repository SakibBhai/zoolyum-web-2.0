"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"
import { CounterAnimation } from "@/components/scroll-animations/counter-animation"
import { PageHeadline } from "@/components/page-headline"
import { useState, useEffect } from "react"

interface Testimonial {
  id: string
  name: string
  position: string | null
  company: string | null
  content: string
  rating: number
  imageUrl: string | null
  featured: boolean
  approved: boolean
}

interface TestimonialsPageConfig {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  stats_eyebrow: string
  stats_title: string
  stats_description: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
}

const defaultConfig: TestimonialsPageConfig = {
  hero_eyebrow: "Client Stories",
  hero_title: "Transformative Success Stories",
  hero_description: "Hear from the brands and businesses that have experienced the transformative power of our strategic approach and creative excellence.",
  stats_eyebrow: "Results",
  stats_title: "Measurable Business Impact",
  stats_description: "Our strategic approach delivers tangible results for our clients across various metrics.",
  cta_title: "Ready to Join Our Success Stories?",
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives results.",
  cta_primary_text: "Start Your Project",
  cta_primary_url: "/contact"
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [pageConfig, setPageConfig] = useState<TestimonialsPageConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch testimonials
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        console.log('Testimonials fetched:', data)
        if (Array.isArray(data)) {
          setTestimonials(data.filter(t => t.approved))
        }
      })
      .catch(error => {
        console.error('Error fetching testimonials:', error)
      })
      .finally(() => {
        setLoading(false)
      })

    // Fetch page configuration
    fetch('/api/admin/testimonials-page')
      .then(res => res.json())
      .then(config => {
        setPageConfig(config)
      })
      .catch(error => {
        console.error('Error fetching testimonials page config:', error)
      })
  }, [])

  const featuredTestimonial = testimonials.find(t => t.featured) || testimonials[0]
  const regularTestimonials = testimonials.filter(t => t.id !== featuredTestimonial?.id)
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow={pageConfig.hero_eyebrow}
              title={pageConfig.hero_title}
              description={pageConfig.hero_description}
            />

            {/* Featured Testimonial */}
            {!loading && featuredTestimonial && (
              <ScrollReveal className="mb-16" delay={0.2}>
                <div className="bg-[#1A1A1A] p-8 md:p-12 rounded-2xl border border-[#333333]">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="text-[#FF5001] mb-6">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 11L8 17H5L7 11H5V5H11V11H10ZM18 11L16 17H13L15 11H13V5H19V11H18Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <p className="text-xl md:text-2xl mb-8 italic">
                        "{featuredTestimonial.content}"
                      </p>
                      <div className="flex items-center">
                        {featuredTestimonial.imageUrl ? (
                          <div className="w-16 h-16 rounded-full bg-[#333333] mr-4 overflow-hidden">
                            <Image
                              src={featuredTestimonial.imageUrl}
                              alt={featuredTestimonial.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}
                        <div>
                          <h4 className="font-bold text-lg">{featuredTestimonial.name}</h4>
                          <p className="text-[#E9E7E2]/70">
                            {featuredTestimonial.position}{featuredTestimonial.position && featuredTestimonial.company ? ", " : ""}{featuredTestimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                    {featuredTestimonial.imageUrl && (
                      <div className="hidden md:block">
                        <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
                          <ImageReveal
                            src={featuredTestimonial.imageUrl}
                            alt={`${featuredTestimonial.name} - ${featuredTestimonial.company}`}
                            width={500}
                            height={600}
                            direction="right"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Client Testimonials Grid */}
            <StaggerReveal className="grid md:grid-cols-2 gap-8 mb-16">
              {loading ? (
                <p className="text-[#E9E7E2]/70">Loading testimonials...</p>
              ) : regularTestimonials.length > 0 ? (
                regularTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="h-full bg-[#1A1A1A] border-[#333333] hover:border-[#FF5001]/30 transition-all duration-300">
                    <CardContent className="p-6">
                      <blockquote className="text-lg text-[#E9E7E2]/90 mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        {testimonial.imageUrl ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={testimonial.imageUrl}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-[#FF5001]/20 rounded-full flex items-center justify-center">
                            <span className="text-[#FF5001] font-bold text-lg">
                              {testimonial.name.split(' ').map(name => name[0]).join('')}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#E9E7E2]">{testimonial.name}</p>
                          <p className="text-sm text-[#E9E7E2]/70">
                            {testimonial.position}{testimonial.position && testimonial.company ? ", " : ""}{testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-[#E9E7E2]/70">No testimonials found.</p>
              )}
            </StaggerReveal>

            {/* Stats Section */}
            <div className="py-16 border-t border-[#333333]">
              <PageHeadline
                eyebrow={pageConfig.stats_eyebrow}
                title={pageConfig.stats_title}
                description={pageConfig.stats_description}
                size="medium"
              />

              <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </StaggerReveal>
            </div>

            {/* CTA Section */}
            <ScrollReveal className="py-16 mt-16 bg-[#1A1A1A] rounded-2xl" delay={0.2}>
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{pageConfig.cta_title}</h2>
                <p className="text-lg text-[#E9E7E2]/80 max-w-2xl mx-auto mb-8">
                  {pageConfig.cta_description}
                </p>
                <Link
                  href={pageConfig.cta_primary_url}
                  className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                >
                  {pageConfig.cta_primary_text}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

interface StatCardProps {
  stat: {
    value: string
    label: string
  }
}

function StatCard({ stat }: StatCardProps) {
  // Extract the numeric part and the suffix (%, +, etc.)
  const numericMatch = stat.value.match(/^([\d.]+)(.*)$/)
  const numericValue = numericMatch ? Number.parseFloat(numericMatch[1]) : 0
  const suffix = numericMatch ? numericMatch[2] : ""

  return (
    <div className="text-center">
      <div className="text-[#FF5001] text-4xl md:text-5xl font-bold mb-2">
        <CounterAnimation end={numericValue} suffix={suffix} />
      </div>
      <p className="text-[#E9E7E2]/70">{stat.label}</p>
    </div>
  )
}

const stats = [
  {
    value: "42%",
    label: "Average Increase in Brand Recognition",
  },
  {
    value: "3.5x",
    label: "Average Growth in Qualified Leads",
  },
  {
    value: "87%",
    label: "Client Satisfaction Rate",
  },
  {
    value: "28+",
    label: "Industry Awards Won",
  },
]
