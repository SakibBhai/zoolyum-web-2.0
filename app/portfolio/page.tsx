"use client"

import { Suspense, useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectsGrid } from "@/components/portfolio/projects-grid"
import { CategoryFilter } from "@/components/portfolio/category-filter"
import { FeaturedProject } from "@/components/portfolio/featured-project"
import { ProjectGridSkeleton, ProjectSkeleton } from "@/components/ui/project-skeleton"
import { getProjectCategories } from "@/lib/actions/portfolio"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal"
import { PageHeadline } from "@/components/page-headline"

interface PortfolioPageConfig {
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  featured_eyebrow: string
  featured_title: string
  featured_description: string
  cta_title: string
  cta_description: string
  cta_primary_text: string
  cta_primary_url: string
  cta_secondary_text: string
  cta_secondary_url: string
}

const defaultConfig: PortfolioPageConfig = {
  hero_eyebrow: "Our Portfolio",
  hero_title: "Strategic Brand Transformations",
  hero_description: "Explore our portfolio of brand evolution projects that have helped businesses achieve remarkable growth and market presence.",
  featured_eyebrow: "Featured Project",
  featured_title: "Featured Work",
  featured_description: "Highlighting our most impactful work that showcases our expertise and creativity.",
  cta_title: "Ready to Transform Your Brand?",
  cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
  cta_primary_text: "Start Your Project",
  cta_primary_url: "/contact",
  cta_secondary_text: "Explore Our Services",
  cta_secondary_url: "/services"
}

interface PortfolioPageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export default function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const [pageConfig, setPageConfig] = useState<PortfolioPageConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [currentCategory, setCurrentCategory] = useState<string>("all")
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ category?: string }>({})

  useEffect(() => {
    // Fetch page configuration
    fetch('/api/admin/portfolio-page')
      .then(async res => {
        const hasDbError = res.headers.get('X-Database-Error') === 'true'
        if (hasDbError) {
          console.warn('Portfolio page: Using default config due to database error')
        }
        return res.json()
      })
      .then(config => {
        if (config && config.hero_title) {
          setPageConfig(config)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching portfolio page config:', error)
        setPageConfig(defaultConfig)
        setLoading(false)
      })

    // Fetch categories
    getProjectCategories().then(cats => setCategories(cats))

    // Resolve search params
    searchParams.then(params => {
      setResolvedSearchParams(params)
      setCurrentCategory(params.category || "all")
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
      <Header />

      <main>
        {/* Hero Section - Responsive spacing and layout */}
        <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageHeadline
              eyebrow={pageConfig.hero_eyebrow}
              title={pageConfig.hero_title}
              description={pageConfig.hero_description}
              titleGradient={true}
            />

            {/* Filter Categories - Enhanced mobile layout */}
            <div className="mt-8 sm:mt-10 md:mt-12">
              <ScrollReveal delay={0.2}>
                <CategoryFilter categories={categories} currentCategory={currentCategory} />
              </ScrollReveal>
            </div>

            {/* Projects Grid - Enhanced responsive layout */}
            <div className="mt-8 sm:mt-10 md:mt-12">
              <Suspense fallback={<ProjectGridSkeleton />}>
                <ProjectsGrid category={resolvedSearchParams.category} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Featured Project Section - Responsive spacing */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-[#1A1A1A]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <PageHeadline
                eyebrow={pageConfig.featured_eyebrow}
                title={pageConfig.featured_title}
                description={pageConfig.featured_description}
                size="medium"
              />

              <div className="mt-8 sm:mt-10 md:mt-12">
                <Suspense fallback={
                  <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#333333]">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="animate-pulse bg-[#333333] aspect-[4/3] lg:aspect-auto lg:h-96" />
                      <div className="p-6 sm:p-8 lg:p-12 animate-pulse">
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
          </div>
        </section>

        {/* CTA Section - Enhanced responsive design */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#212121] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#FF5001]/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#FF5001]/5 rounded-full filter blur-3xl"></div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <span className="text-[#FF5001] text-xs sm:text-sm uppercase tracking-widest font-medium">
                  Start Your Project
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
                  {pageConfig.cta_title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-[#E9E7E2]/80 mb-6 sm:mb-8 md:mb-10">
                  {pageConfig.cta_description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link
                    href={pageConfig.cta_primary_url}
                    className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center justify-center group text-sm sm:text-base"
                    data-cursor="button"
                    data-cursor-text="Contact"
                  >
                    {pageConfig.cta_primary_text}
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={pageConfig.cta_secondary_url}
                    className="px-6 py-3 md:px-8 md:py-4 border border-[#FF5001] text-[#FF5001] font-bold rounded-full hover:bg-[#FF5001]/10 transition-all duration-300 inline-flex items-center justify-center group text-sm sm:text-base"
                    data-cursor="button"
                    data-cursor-text="Services"
                  >
                    {pageConfig.cta_secondary_text}
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
  )
}
