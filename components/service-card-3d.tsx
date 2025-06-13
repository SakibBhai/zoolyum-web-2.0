"use client"

import Link from "next/link"
import {
  ArrowRight,
  KeyIcon as Strategy,
  Globe,
  Compass,
  Palette,
  FileText,
  Search,
  Layout,
  Share2,
  Users,
} from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon?: string
}

export function ServiceCard3D({ title, description, icon }: ServiceCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "strategy":
        return <Strategy className="w-6 h-6 text-[#FF5001]" />
      case "globe":
        return <Globe className="w-6 h-6 text-[#FF5001]" />
      case "compass":
        return <Compass className="w-6 h-6 text-[#FF5001]" />
      case "palette":
        return <Palette className="w-6 h-6 text-[#FF5001]" />
      case "file-text":
        return <FileText className="w-6 h-6 text-[#FF5001]" />
      case "search":
        return <Search className="w-6 h-6 text-[#FF5001]" />
      case "layout":
        return <Layout className="w-6 h-6 text-[#FF5001]" />
      case "share-2":
        return <Share2 className="w-6 h-6 text-[#FF5001]" />
      case "users":
        return <Users className="w-6 h-6 text-[#FF5001]" />
      default:
        return <Strategy className="w-6 h-6 text-[#FF5001]" />
    }
  }

  // Create a URL-friendly slug from the title
  const createSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const serviceSlug = createSlug(title)

  return (
    <div className="h-full flex flex-col bg-[#1A1A1A] rounded-xl p-6 hover:bg-[#212121] transition-all duration-300 group">
      <div className="w-12 h-12 bg-[#FF5001]/10 rounded-full flex items-center justify-center mb-4">{getIcon()}</div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF5001] transition-colors">{title}</h3>
      <p className="text-[#E9E7E2]/70 flex-grow">{description}</p>
      <div className="mt-6 pt-4 border-t border-[#333333]">
        <Link 
          href={`/services/${serviceSlug}`}
          className="text-[#FF5001] font-medium inline-flex items-center group/link hover:text-[#FF5001]/80 transition-colors"
        >
          Learn More
          <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
