import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function BlogPostsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add New Post
        </Button>
      </div>
      
      {/* Table skeleton */}
      <div className="rounded-md border border-[#333333] bg-[#1A1A1A]">
        {/* Table header */}
        <div className="border-b border-[#333333] p-4">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-[#333333] p-4 last:border-b-0">
            <div className="grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}