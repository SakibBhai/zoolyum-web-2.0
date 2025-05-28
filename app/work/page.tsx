"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard3D } from "@/components/project-card-3d"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"

export default function WorkPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Portfolio"
              title="Strategic Brand Transformations"
              description="Explore our portfolio of brand evolution projects that have helped businesses achieve remarkable growth and market presence."
            />

            <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard3D key={index} project={project} index={index} />
              ))}
            </StaggerReveal>

            <ScrollReveal className="mt-16 flex justify-center" delay={0.4}>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
              >
                Start Your Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
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
]
