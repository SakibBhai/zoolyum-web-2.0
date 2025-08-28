import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getFeaturedProject } from "@/lib/actions/portfolio"

export async function FeaturedProject() {
  const featuredProject = await getFeaturedProject()

  if (!featuredProject) {
    return (
      <div className="text-center py-12">
        <p className="text-[#E9E7E2]/70 text-lg">No featured project available.</p>
      </div>
    )
  }

  return (
    <div className="group">
      <Link href={`/portfolio/${featuredProject.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-[#1A1A1A] border border-[#333333]">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
              <div className="transform-gpu transition-transform duration-700 group-hover:scale-105 w-full h-full">
                <Image
                  src={featuredProject.hero_image_url || featuredProject.image_url || "/placeholder.svg"}
                  alt={featuredProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#FF5001] text-[#161616] text-sm font-medium rounded-full">
                  Featured Project
                </span>
              </div>
              
              <span className="text-[#FF5001] text-sm font-medium mb-2">
                {featuredProject.category || 'General'}
              </span>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 group-hover:text-[#FF5001] transition-colors">
                {featuredProject.title}
              </h2>
              
              <p className="text-[#E9E7E2]/80 text-lg mb-6 line-clamp-4">
                {featuredProject.overview || 'No description available.'}
              </p>
              
              <div className="inline-flex items-center text-[#FF5001] font-medium group/link">
                <span>View Project</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}