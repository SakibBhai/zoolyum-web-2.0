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
      
      router.push(url)
    })
  }

  const allCategories = ["all", ...categories]

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {allCategories.map((category) => {
        const isActive = activeCategory === category
        const displayName = category === "all" ? "All Projects" : category
        
        return (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            disabled={isPending}
            className={`px-4 py-2 font-medium rounded-full transition-colors disabled:opacity-50 ${
              isActive
                ? "bg-[#FF5001] text-[#161616]"
                : "bg-[#1A1A1A] text-[#E9E7E2] hover:bg-[#252525]"
            }`}
          >
            {displayName}
          </button>
        )
      })}
    </div>
  )
}