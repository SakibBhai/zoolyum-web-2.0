'use client'

import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BlogPostsTable } from '@/components/admin/blog-posts-table';
import { BlogListSkeleton } from '@/components/admin/blog-list-skeleton';

export default function BlogPostsPage() {
  return (
    <div className="space-y-6">
      {/* Header renders immediately */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Blog Posts</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Manage your blog posts and content with secure deletion</p>
        </div>
        <Link href="/admin/blog-posts/new">
          <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Post
          </Button>
        </Link>
      </div>
      
      {/* Enhanced table with secure delete functionality */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogPostsTable />
      </Suspense>
    </div>
  );
}