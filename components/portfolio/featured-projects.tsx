"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal";
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal";
import { fetchProjects, ProjectWithComputed } from "@/lib/project-operations";

interface FeaturedProjectsProps {
  limit?: number;
}

export function FeaturedProjects({ limit = 3 }: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<ProjectWithComputed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch active projects, limit to the specified number
        const fetchedProjects = await fetchProjects({
          status: 'active',
          limit
        });
        
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [limit]);

  if (loading) {
    return (
      <StaggerReveal
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        staggerDelay={0.1}
        mobileStaggerDelay={0.05}
        mobileAnimation="fade"
      >
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="group relative overflow-hidden rounded-xl">
            <div className="aspect-[4/3] bg-[#212121] animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent flex flex-col justify-end p-4 md:p-6">
              <div className="h-4 bg-[#333333] rounded w-24 mb-2 animate-pulse" />
              <div className="h-6 bg-[#333333] rounded w-32 animate-pulse" />
            </div>
          </div>
        ))}
      </StaggerReveal>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[#E9E7E2]/60">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#E9E7E2]/60">No projects available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <StaggerReveal
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        staggerDelay={0.1}
        mobileStaggerDelay={0.05}
        mobileAnimation="fade"
      >
        {projects.map((project, index) => (
          <PortfolioItem
            key={project.id}
            name={project.name}
            type={project.type || 'General'}
            image={project.image_url || "/placeholder.svg?height=400&width=600"}
            id={project.id}
            priority={index < 2}
          />
        ))}
      </StaggerReveal>

      <ScrollReveal
        className="mt-10 md:mt-12 text-center"
        delay={0.3}
        mobileDelay={0.2}
        mobileAnimation="fade"
      >
        <Link
          href="/portfolio"
          className="px-6 py-3 md:px-8 md:py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 inline-flex items-center group"
          data-cursor="button"
          data-cursor-text="View Portfolio"
        >
          View Full Portfolio
          <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </ScrollReveal>
    </>
  );
}

// Portfolio Item Component
function PortfolioItem({
  name,
  type,
  image,
  id,
  priority = false,
}: {
  name: string;
  type: string;
  image: string;
  id: string;
  priority?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl touch-manipulation">
      <div className="aspect-[4/3] bg-[#212121] overflow-hidden relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
        <span className="text-[#FF5001] text-xs md:text-sm font-medium">{type}</span>
        <h3 className="text-lg md:text-xl font-bold mt-1 md:mt-2 text-white">{name}</h3>
        <Link
          href={`/portfolio/${id}`}
          className="mt-3 md:mt-4 inline-flex items-center text-[#E9E7E2] hover:text-[#FF5001] transition-colors text-sm md:text-base group/link"
        >
          View Project
          <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}