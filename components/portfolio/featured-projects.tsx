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
        {projects.map((project) => (
          <PortfolioItem
            key={project.id}
            title={project.title}
            category={project.category}
            image={project.image || "/placeholder.svg?height=400&width=600"}
            slug={project.slug}
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
  title,
  category,
  image,
  slug,
}: {
  title: string;
  category: string;
  image: string;
  slug: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl">
      <div className="aspect-[4/3] bg-[#212121] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
        <span className="text-[#FF5001] text-xs md:text-sm">{category}</span>
        <h3 className="text-lg md:text-xl font-bold mt-1 md:mt-2">{title}</h3>
        <Link
          href={`/portfolio/${slug}`}
          className="mt-3 md:mt-4 inline-flex items-center text-[#E9E7E2] hover:text-[#FF5001] transition-colors text-sm md:text-base"
        >
          View Project
          <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>
    </div>
  );
}