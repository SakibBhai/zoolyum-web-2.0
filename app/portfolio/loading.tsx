import { ProjectGridSkeleton } from "@/components/ui/project-skeleton"
import { Header } from "@/components/header"
import { PageHeadline } from "@/components/page-headline"

export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2]">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container mx-auto px-4">
            <PageHeadline
              eyebrow="Our Work"
              title="Portfolio"
              description="Explore our collection of strategic brand transformations and digital innovations that drive meaningful results for our clients."
              size="large"
            />

            {/* Filter Categories Skeleton */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 mb-12">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-[#333333] rounded-full animate-pulse"
                  style={{ width: `${80 + Math.random() * 40}px` }}
                />
              ))}
            </div>

            {/* Projects Grid Skeleton */}
            <ProjectGridSkeleton />
          </div>
        </section>

        {/* Featured Project Section */}
        <section className="py-16 md:py-24 bg-[#0F0F0F]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <PageHeadline
                eyebrow="Featured Project"
                title="Featured Work"
                description="Highlighting our most impactful work that showcases our expertise and creativity."
                size="medium"
              />

              <div className="mt-12 md:mt-16">
                {/* Featured Project Skeleton */}
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
                <div className="h-4 bg-[#333333] rounded w-32 mx-auto mb-4 animate-pulse" />
                <div className="h-12 bg-[#333333] rounded w-3/4 mx-auto mb-6 animate-pulse" />
                <div className="space-y-2 mb-8">
                  <div className="h-4 bg-[#333333] rounded w-full mx-auto animate-pulse" />
                  <div className="h-4 bg-[#333333] rounded w-2/3 mx-auto animate-pulse" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="h-12 bg-[#333333] rounded-full w-48 animate-pulse" />
                  <div className="h-12 bg-[#333333] rounded-full w-48 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}