"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card3D } from "./card-3d"

interface BlogCardProps {
  post: {
    title: string
    slug: string
    date: string
    excerpt: string
    image: string
    tags: string[]
  }
  index: number
}

export function BlogCard3D({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <Card3D className="h-full" depth={15} glareIntensity={0.2} cursorText="Read Article">
          <div className="h-full flex flex-col bg-[#1A1A1A] rounded-xl overflow-hidden transform-gpu transition-all duration-300">
            <div className="overflow-hidden">
              <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full aspect-[3/2] object-cover"
                />
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center text-[#E9E7E2]/60 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{post.date}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-[#FF5001] transition-colors">{post.title}</h3>
              <p className="text-[#E9E7E2]/70 mt-2 flex-grow">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#252525] rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card3D>
      </Link>
    </motion.div>
  )
}
