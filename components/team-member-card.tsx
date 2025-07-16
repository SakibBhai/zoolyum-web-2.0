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
}

export function TeamMemberCard({ name, role, image, bio, social, featured = false }: TeamMemberCardProps) {
  return (
    <Card className={`h-full bg-[#1A1A1A] border-[#333333] hover:border-[#FF5001]/30 transition-all duration-300 group overflow-hidden ${featured ? "border-[#FF5001]/30" : ""}`}>
      <div className="h-full flex flex-col">
        <div className="overflow-hidden">
          <div className="transform-gpu transition-transform duration-700 group-hover:scale-110">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={300}
              height={400}
              className="w-full aspect-[3/4] object-cover"
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
