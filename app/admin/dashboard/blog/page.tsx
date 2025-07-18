import { Suspense } from 'react';
import Link from 'next/link';
import { PageTransition } from '@/components/page-transition';
import { Plus } from 'lucide-react';
import { BlogListSkeleton } from '@/components/admin/blog-list-skeleton';
import { BlogPostsTable } from '@/components/admin/blog-posts-table';

export default function BlogManagementPage() {
  return (
    <PageTransition>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Blog Posts</h1>
          <Link
            href="/admin/dashboard/blog/new"
            className="inline-flex items-center px-4 py-2 bg-[#FF5001] text-[#161616] font-medium rounded-lg hover:bg-[#FF5001]/90 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Post
          </Link>
        </div>

        <Suspense fallback={<BlogListSkeleton />}>
          <BlogPostsTable />
        </Suspense>
      </div>
    </PageTransition>
  );
}
