"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter } from "lucide-react"

interface TeamMemberCardProps {
  name: string
  role: string
  image: string
  bio?: string
  social?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    behance?: string
  }
  featured?: boolean
  className?: string
  priority?: boolean
  aspectRatio?: "square" | "portrait" | "landscape"
}

export function TeamMemberCard({ 
  name, 
  role, 
  image, 
  bio, 
  social, 
  featured = false,
  className = "",
  priority = false,
  aspectRatio = "portrait"
}: TeamMemberCardProps) {
  // Get aspect ratio classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
        return "aspect-[4/3]";
      default:
        return "aspect-[3/4]"; // Default to portrait
    }
  };

  const aspectClass = getAspectRatioClass();

  return (
    <Card className={`h-full bg-[#1A1A1A] border-[#333333] hover:border-[#FF5001]/30 transition-all duration-300 group overflow-hidden touch-manipulation ${featured ? "border-[#FF5001]/30" : ""} ${className}`}>
      <div className="h-full flex flex-col">
        <div className={`overflow-hidden relative ${aspectClass}`}>
          <div className="transform-gpu transition-transform duration-700 group-hover:scale-110 w-full h-full">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold group-hover:text-[#FF5001] transition-colors">{name}</h3>
          <span className="text-[#FF5001] text-sm mt-1">{role}</span>

          {bio && <p className="text-[#E9E7E2]/70 mt-3 text-sm flex-grow">{bio}</p>}

          {social && (
            <div className="mt-4 pt-4 border-t border-[#333333] flex space-x-3">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E9E7E2]/70 hover:text-[#FF5001] transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E9E7E2]/70 hover:text-[#FF5001] transition-colors"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
