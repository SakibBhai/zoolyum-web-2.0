"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"
import { TextReveal } from "@/components/scroll-animations/text-reveal"
import { ImageReveal } from "@/components/scroll-animations/image-reveal"

export default function PortfolioPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Our Portfolio"
              title="Strategic Brand Transformations"
              description="Explore our portfolio of brand evolution projects that have helped businesses achieve remarkable growth and market presence."
              titleGradient={true}
            />

            {/* Filter Categories */}
            <ScrollReveal className="flex flex-wrap justify-center gap-3 mt-8 mb-12" delay={0.2}>
              <button className="px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-full">All Projects</button>
              <button className="px-4 py-2 bg-[#1A1A1A] text-[#E9E7E2] font-medium rounded-full hover:bg-[#252525] transition-colors">
                Brand Strategy
              </button>
              <button className="px-4 py-2 bg-[#1A1A1A] text-[#E9E7E2] font-medium rounded-full hover:bg-[#252525] transition-colors">
                Digital Transformation
              </button>
              <button className="px-4 py-2 bg-[#1A1A1A] text-[#E9E7E2] font-medium rounded-full hover:bg-[#252525] transition-colors">
                Creative Direction
              </button>
              <button className="px-4 py-2 bg-[#1A1A1A] text-[#E9E7E2] font-medium rounded-full hover:bg-[#252525] transition-colors">
                Visual Identity
              </button>
            </ScrollReveal>

            {/* Projects Grid */}
            <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <Link href={`/work/${project.slug}`} className="block">
                    <Card className="h-full bg-[#1A1A1A] border-[#333333] overflow-hidden transform-gpu transition-all duration-300 hover:scale-105">
                      <div className="overflow-hidden">
                        <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            width={600}
                            height={400}
                            className="w-full aspect-[3/2] object-cover"
                          />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <span className="text-[#FF5001] text-sm">{project.category}</span>
                        <h3 className="text-xl font-bold mt-1 group-hover:text-[#FF5001] transition-colors">{project.title}</h3>
                        <p className="text-[#E9E7E2]/70 mt-2">{project.description}</p>
                        <div className="mt-4 pt-4 border-t border-[#333333]">
                          <span className="text-[#FF5001] font-medium inline-flex items-center group/link">
                            View Project
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </StaggerReveal>
          </section>

          {/* Featured Project Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="Featured Project"
                title="Nexus Rebrand"
                description="A complete brand transformation for a tech company entering new markets."
                size="medium"
              />

              <div className="mt-12 md:mt-16">
                <div className="relative rounded-2xl overflow-hidden">
                  <ImageReveal
                    src="/placeholder.svg?height=600&width=1200"
                    alt="Nexus Rebrand Project"
                    width={1200}
                    height={600}
                    className="w-full"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-12 mt-12">
                  <ScrollReveal animation="fade-slide" direction="right" mobileAnimation="fade">
                    <TextReveal
                      className="text-2xl md:text-3xl font-bold mb-4"
                      mobileType="words"
                      mobileStaggerDelay={0.02}
                    >
                      The Challenge
                    </TextReveal>
                    <p className="text-base md:text-lg text-[#E9E7E2]/80">
                      Nexus Technologies was a well-established tech company looking to expand into new markets. Their
                      existing brand identity no longer reflected their innovative solutions and future vision. They
                      needed a complete brand transformation that would position them as industry leaders while
                      maintaining recognition among their existing customer base.
                    </p>
                  </ScrollReveal>

                  <ScrollReveal animation="fade-slide" direction="left" delay={0.2} mobileAnimation="fade">
                    <TextReveal
                      className="text-2xl md:text-3xl font-bold mb-4"
                      mobileType="words"
                      mobileStaggerDelay={0.02}
                    >
                      Our Approach
                    </TextReveal>
                    <p className="text-base md:text-lg text-[#E9E7E2]/80">
                      We conducted extensive market research and stakeholder interviews to understand Nexus's unique
                      position in the market. Our strategic approach focused on evolving their brand identity rather
                      than completely reinventing it, ensuring we maintained valuable brand equity while positioning
                      them for future growth.
                    </p>
                  </ScrollReveal>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="bg-[#212121] p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Brand Strategy</h3>
                    <p className="text-[#E9E7E2]/80">
                      We developed a comprehensive brand strategy that positioned Nexus as innovative problem-solvers in
                      their industry, with a clear value proposition and messaging framework.
                    </p>
                  </div>
                  <div className="bg-[#212121] p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Visual Identity</h3>
                    <p className="text-[#E9E7E2]/80">
                      We created a modern visual identity system that reflected Nexus's technological expertise while
                      feeling approachable and human-centered.
                    </p>
                  </div>
                  <div className="bg-[#212121] p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Digital Presence</h3>
                    <p className="text-[#E9E7E2]/80">
                      We redesigned their website and digital touchpoints to create a cohesive brand experience that
                      effectively communicated their new positioning.
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <Link
                    href="/portfolio/nexus-rebrand"
                    className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
                    data-cursor="button"
                    data-cursor-text="View Project"
                  >
                    View Full Case Study
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="bg-[#212121] rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                  <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
                    Start Your Project
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                    Ready to Transform Your Brand?
                  </h2>
                  <p className="text-lg md:text-xl text-[#E9E7E2]/80 mb-8 md:mb-10">
                    Let's collaborate to create a strategic brand experience that resonates with your audience and
                    drives meaningful results for your business.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Contact"
                    >
                      Start Your Project
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/services"
                      className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center group"
                      data-cursor="button"
                      data-cursor-text="Services"
                    >
                      Explore Our Services
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

const projects = [
  {
    title: "Nexus Rebrand",
    slug: "nexus-rebrand",
    category: "Brand Strategy",
    description: "Complete brand transformation for a tech company entering new markets.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Elevate Digital Transformation",
    slug: "elevate-digital",
    category: "Digital Strategy",
    description: "Digital ecosystem development for a growing lifestyle brand.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Horizon Market Entry",
    slug: "horizon-market",
    category: "Consultancy",
    description: "Strategic positioning for a startup entering a competitive market.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Pulse E-commerce",
    slug: "pulse-ecommerce",
    category: "Digital Strategy",
    description: "E-commerce strategy and implementation for a fashion retailer.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Vertex Brand Identity",
    slug: "vertex-identity",
    category: "Brand Strategy",
    description: "Complete visual identity system for an architectural firm.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Quantum Positioning",
    slug: "quantum-positioning",
    category: "Consultancy",
    description: "Market positioning strategy for a financial services provider.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Fusion Digital Campaign",
    slug: "fusion-campaign",
    category: "Digital Strategy",
    description: "Integrated digital campaign for a consumer tech product launch.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Meridian Brand Evolution",
    slug: "meridian-evolution",
    category: "Brand Strategy",
    description: "Brand evolution for a healthcare provider expanding services.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Catalyst Web Platform",
    slug: "catalyst-platform",
    category: "Digital Strategy",
    description: "Web platform development for an educational technology company.",
    image: "/placeholder.svg?height=400&width=600",
  },
]
