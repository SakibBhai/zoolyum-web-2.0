"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard3D } from "@/components/blog-card-3d"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal"
import { PageHeadline } from "@/components/page-headline"

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
        <Header />

        <main className="pt-24">
          <section className="container mx-auto px-4 py-12">
            <PageHeadline
              eyebrow="Insights"
              title="Strategic Brand Insights & Perspectives"
              description="Explore our collection of thought leadership on brand development, digital transformation, and market positioning strategies."
              titleGradient={true}
            />

            <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <BlogCard3D key={index} post={post} index={index} />
              ))}
            </StaggerReveal>

            <ScrollReveal className="mt-16 flex justify-center" delay={0.4}>
              <Link
                href="/#contact"
                className="px-8 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
              >
                Subscribe to Newsletter
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

const blogPosts = [
  {
    title: "The Art of Strategic Brand Positioning",
    slug: "strategic-brand-positioning",
    date: "May 15, 2023",
    excerpt: "How to position your brand effectively in a crowded marketplace and stand out from competitors.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Brand Strategy", "Positioning", "Marketing"],
  },
  {
    title: "Digital Transformation: Beyond the Buzzword",
    slug: "digital-transformation-beyond-buzzword",
    date: "April 22, 2023",
    excerpt: "What digital transformation really means for businesses and how to implement it successfully.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Digital Strategy", "Transformation", "Technology"],
  },
  {
    title: "Building Brand Narratives That Resonate",
    slug: "brand-narratives-that-resonate",
    date: "March 10, 2023",
    excerpt: "The power of storytelling in brand development and how to craft narratives that connect with audiences.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Storytelling", "Brand Development", "Communication"],
  },
  {
    title: "The Psychology of Color in Brand Identity",
    slug: "psychology-color-brand-identity",
    date: "February 28, 2023",
    excerpt: "How color choices impact brand perception and influence consumer behavior.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Design", "Psychology", "Brand Identity"],
  },
  {
    title: "Measuring Brand Success: Beyond Metrics",
    slug: "measuring-brand-success",
    date: "January 15, 2023",
    excerpt: "Holistic approaches to evaluating brand performance that go beyond traditional KPIs.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Analytics", "Brand Strategy", "Performance"],
  },
  {
    title: "The Future of Digital Brand Experiences",
    slug: "future-digital-brand-experiences",
    date: "December 5, 2022",
    excerpt: "Emerging technologies and trends shaping how brands connect with audiences online.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Innovation", "Digital Experience", "Trends"],
  },
]
