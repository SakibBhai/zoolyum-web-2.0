import { Card, CardContent } from "@/components/ui/card"

interface ProjectSkeletonProps {
  count?: number
}

export function ProjectSkeleton({ count = 1 }: ProjectSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full bg-[#1A1A1A] border-[#333333] overflow-hidden">
          <div className="animate-pulse">
            {/* Image skeleton */}
            <div className="w-full aspect-[3/2] bg-[#333333]" />
            
            <CardContent className="p-6">
              {/* Category skeleton */}
              <div className="h-4 bg-[#333333] rounded w-24 mb-2" />
              
              {/* Title skeleton */}
              <div className="h-6 bg-[#333333] rounded w-3/4 mb-2" />
              
              {/* Description skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-[#333333] rounded w-full" />
                <div className="h-4 bg-[#333333] rounded w-2/3" />
              </div>
              
              {/* Divider */}
              <div className="border-t border-[#333333] pt-4">
                {/* View Project link skeleton */}
                <div className="h-4 bg-[#333333] rounded w-32" />
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </>
  )
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectSkeleton count={6} />
    </div>
  )
}