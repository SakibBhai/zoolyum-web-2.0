import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-[#252525]" />
        <Skeleton className="h-10 w-32 bg-[#252525]" />
      </div>
      
      {/* Blog posts skeleton */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-6 border-b border-[#333333] last:border-b-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4 bg-[#252525]" />
                
                {/* Excerpt */}
                <Skeleton className="h-4 w-full bg-[#252525]" />
                <Skeleton className="h-4 w-2/3 bg-[#252525]" />
                
                {/* Meta info */}
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-20 bg-[#252525]" />
                  <Skeleton className="h-4 w-24 bg-[#252525]" />
                  <Skeleton className="h-4 w-16 bg-[#252525]" />
                </div>
                
                {/* Tags */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16 bg-[#252525] rounded-full" />
                  <Skeleton className="h-6 w-20 bg-[#252525] rounded-full" />
                  <Skeleton className="h-6 w-14 bg-[#252525] rounded-full" />
                </div>
              </div>
              
              {/* Image */}
              <div className="ml-6">
                <Skeleton className="h-20 w-32 bg-[#252525] rounded-lg" />
              </div>
              
              {/* Actions */}
              <div className="ml-4 flex space-x-2">
                <Skeleton className="h-8 w-8 bg-[#252525] rounded" />
                <Skeleton className="h-8 w-8 bg-[#252525] rounded" />
                <Skeleton className="h-8 w-8 bg-[#252525] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 bg-[#252525]" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 bg-[#252525] rounded" />
          <Skeleton className="h-8 w-8 bg-[#252525] rounded" />
          <Skeleton className="h-8 w-8 bg-[#252525] rounded" />
        </div>
      </div>
    </div>
  );
}

export default BlogListSkeleton;