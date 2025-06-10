import { Skeleton } from "@/components/ui/skeleton"

export function RecentActivitySkeleton() {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-[#252525]">
            <Skeleton className="w-2 h-2 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}