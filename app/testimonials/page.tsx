"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TestimonialCard3D } from "@/components/testimonial-card-3d"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"
import { CounterAnimation } from "@/components/scroll-animations/counter-animation"
import { PageHeadline } from "@/components/page-headline"

export default function TestimonialsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Client Stories"
              title="Transformative Success Stories"
              description="Hear from the brands and businesses that have experienced the transformative power of our strategic approach and creative excellence."
            />

            {/* Featured Testimonial */}
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
                      "The rebrand has been <span className="text-[#FF5001]">transformative</span> for our business. Not
                      only do we have a visual identity that truly represents our vision, but the strategic foundation
                      has aligned our entire organization and clarified our market position. Since launching, we've seen
                      tangible business results and received overwhelmingly positive feedback from clients and
                      partners."
                    </p>
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-[#333333] mr-4 overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Sarah Johnson"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Sarah Johnson</h4>
                        <p className="text-[#E9E7E2]/70">CEO, Nexus Technologies</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
                      <ImageReveal
                        src="/placeholder.svg?height=600&width=500"
                        alt="Nexus Technologies Project"
                        width={500}
                        height={600}
                        direction="right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Client Testimonials Grid */}
            <StaggerReveal className="grid md:grid-cols-2 gap-8 mb-16">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard3D
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  company={testimonial.company}
                />
              ))}
            </StaggerReveal>

            {/* Stats Section */}
            <div className="py-16 border-t border-[#333333]">
              <PageHeadline
                eyebrow="Results"
                title="Measurable Business Impact"
                description="Our strategic approach delivers tangible results for our clients across various metrics."
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Success Stories?</h2>
                <p className="text-lg text-[#E9E7E2]/80 max-w-2xl mx-auto mb-8">
                  Let's collaborate to create a strategic brand experience that resonates with your audience and drives
                  results.
                </p>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                >
                  Start Your Project
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

const testimonials = [
  {
    quote:
      "Working with Zoolyum was a game-changer for our digital presence. The strategic vision and creative execution exceeded our expectations at every turn.",
    author: "Michael Chen",
    company: "Marketing Director, Elevate",
  },
  {
    quote:
      "Sakib has an incredible ability to identify the essence of a brand and translate it into powerful market positioning. His work was instrumental to our success.",
    author: "Jessica Williams",
    company: "Founder, Horizon",
  },
  {
    quote:
      "The depth of strategic thinking combined with creative excellence makes Zoolyum truly unique. Our brand transformation has driven measurable business results.",
    author: "David Rodriguez",
    company: "COO, Pulse",
  },
  {
    quote:
      "Our new brand identity perfectly captures the essence of our practice and has elevated our presence in the industry. Since launching, we've seen tangible benefits in terms of client engagement.",
    author: "Alexandra Torres",
    company: "Principal, Vertex Architecture",
  },
  {
    quote:
      "The positioning work gave us the strategic clarity we needed to revitalize our business in a challenging market. It has united our organization around a compelling vision.",
    author: "Robert Chen",
    company: "CEO, Quantum Financial",
  },
  {
    quote:
      "Sakib's approach to digital transformation went far beyond aesthetics. He helped us reimagine our entire customer journey, resulting in significant improvements in engagement and conversion.",
    author: "Emma Thompson",
    company: "Digital Director, Fusion Retail",
  },
]

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
