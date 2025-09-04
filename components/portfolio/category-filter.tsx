"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface CategoryFilterProps {
  categories: string[]
  currentCategory?: string
}

export function CategoryFilter({ categories, currentCategory = "all" }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [activeCategory, setActiveCategory] = useState(currentCategory)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (category === "all") {
        params.delete("category")
      } else {
        params.set("category", category)
      }
      
      const queryString = params.toString()
      const url = queryString ? `/portfolio?${queryString}` : "/portfolio"
      
      // Use replace instead of push to avoid RSC conflicts
      router.replace(url, { scroll: false })
    })
  }

  const allCategories = ["all", ...categories]

  return (
    <div className="w-full">
      {/* Mobile: Horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allCategories.map((category) => {
            const isActive = activeCategory === category
            const displayName = category === "all" ? "All Projects" : category
            
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={isPending}
                className={`px-4 py-2.5 font-medium rounded-full transition-all duration-300 disabled:opacity-50 whitespace-nowrap text-sm min-w-fit ${
                  isActive
                    ? "bg-[#FF5001] text-[#161616] shadow-lg scale-105"
                    : "bg-[#1A1A1A] text-[#E9E7E2] hover:bg-[#252525] active:scale-95"
                }`}
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                {displayName}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop: Centered flex wrap */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2 md:gap-3">
        {allCategories.map((category) => {
          const isActive = activeCategory === category
          const displayName = category === "all" ? "All Projects" : category
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={isPending}
              className={`px-4 py-2.5 md:px-6 md:py-3 font-medium rounded-full transition-all duration-300 disabled:opacity-50 text-sm md:text-base ${
                isActive
                  ? "bg-[#FF5001] text-[#161616] shadow-lg transform scale-105"
                  : "bg-[#1A1A1A] text-[#E9E7E2] hover:bg-[#252525] hover:scale-105 active:scale-95"
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {displayName}
            </button>
          )
        })}
      </div>
    </div>
  )
}