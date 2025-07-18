import { Suspense } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectsGrid } from "@/components/portfolio/projects-grid"
import { CategoryFilter } from "@/components/portfolio/category-filter"
import { FeaturedProject } from "@/components/portfolio/featured-project"
import { ProjectGridSkeleton, ProjectSkeleton } from "@/components/ui/project-skeleton"
import { getProjectCategories } from "@/lib/actions/portfolio"
import { PageTransition } from "@/components/page-transition"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { PageHeadline } from "@/components/page-headline"

interface PortfolioPageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const resolvedSearchParams = await searchParams
  const currentCategory = resolvedSearchParams.category || "all"
  const categories = await getProjectCategories()
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
            <ScrollReveal className="mt-8 mb-12" delay={0.2}>
              <CategoryFilter categories={categories} currentCategory={currentCategory} />
            </ScrollReveal>

            {/* Projects Grid */}
            <Suspense fallback={<ProjectGridSkeleton />}>
              <ProjectsGrid category={resolvedSearchParams.category} />
            </Suspense>
          </section>

          {/* Featured Project Section */}
          <section className="py-16 md:py-24 bg-[#1A1A1A]">
            <div className="container mx-auto px-4">
              <PageHeadline
                eyebrow="Featured Project"
                title="Featured Work"
                description="Highlighting our most impactful work that showcases our expertise and creativity."
                size="medium"
              />

              <div className="mt-12 md:mt-16">
                <Suspense fallback={
                  <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#333333]">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="animate-pulse bg-[#333333] aspect-[4/3] lg:aspect-auto lg:h-96" />
                      <div className="p-8 lg:p-12 animate-pulse">
                        <div className="h-6 bg-[#333333] rounded w-32 mb-4" />
                        <div className="h-4 bg-[#333333] rounded w-20 mb-2" />
                        <div className="h-8 bg-[#333333] rounded w-3/4 mb-4" />
                        <div className="space-y-2 mb-6">
                          <div className="h-4 bg-[#333333] rounded w-full" />
                          <div className="h-4 bg-[#333333] rounded w-2/3" />
                        </div>
                        <div className="h-4 bg-[#333333] rounded w-32" />
                      </div>
                    </div>
                  </div>
                }>
                  <FeaturedProject />
                </Suspense>


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
