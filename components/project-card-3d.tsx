"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card3D } from "./card-3d"

interface ProjectCardProps {
  project: {
    title: string
    slug: string
    category: string
    description: string
    image: string
  }
  index: number
}

export function ProjectCard3D({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/work/${project.slug}`} className="block">
        <Card3D className="h-full" depth={15} glareIntensity={0.2} cursorText="View Project">
          <div className="h-full flex flex-col bg-[#1A1A1A] rounded-xl overflow-hidden transform-gpu transition-all duration-300">
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
            <div className="p-6 flex-grow flex flex-col">
              <span className="text-[#FF5001] text-sm">{project.category}</span>
              <h3 className="text-xl font-bold mt-1 group-hover:text-[#FF5001] transition-colors">{project.title}</h3>
              <p className="text-[#E9E7E2]/70 mt-2 flex-grow">{project.description}</p>
              <div className="mt-4 pt-4 border-t border-[#333333]">
                <span className="text-[#FF5001] font-medium inline-flex items-center group/link">
                  View Project
                  <svg
                    className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Card3D>
      </Link>
    </motion.div>
  )
}
