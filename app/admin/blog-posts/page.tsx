'use client'

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';
import { BlogPostsSkeleton } from '@/components/admin/blog-posts-skeleton';

// Client component for fetching blog posts data
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  updatedAt: string;
  author: { name: string };
}

interface DataTableBlogPost extends BlogPost {
  authorName: string;
  status: string;
  actions: string;
}

function BlogPostsTable() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog-posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <BlogPostsSkeleton />;
  }


  return (
    <DataTable<DataTableBlogPost>
      data={posts.map(post => ({
        ...post,
        authorName: post.author?.name || 'Unknown',
        updatedAt: new Date(post.updatedAt).toLocaleDateString(),
        status: post.published ? 'Published' : 'Draft',
        actions: post.id
      }))}
      columns={[
        { header: 'Title', accessorKey: 'title' },
        { header: 'Slug', accessorKey: 'slug' },
        { header: 'Status', accessorKey: 'status' },
        { header: 'Author', accessorKey: 'authorName' },
        { header: 'Updated', accessorKey: 'updatedAt' },
        { 
          header: 'Actions', 
          accessorKey: 'actions',
          cell: ({ row }) => {
            const id = row.original.id;
            return (
              <div className="flex items-center gap-2">
                <Link href={`/admin/blog-posts/${id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/blog-posts/${id}/edit`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/blog-posts/${id}/delete`}>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            );
          }
        }
      ]}
    />
  );
}

export default function BlogPostsPage() {
  return (
    <div className="space-y-6">
      {/* Header renders immediately */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Blog Posts</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Manage your blog posts and content</p>
        </div>
        <Link href="/admin/blog-posts/new">
          <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Post
          </Button>
        </Link>
      </div>
      
      {/* Table with Suspense boundary for streaming */}
      <Suspense fallback={<BlogPostsSkeleton />}>
        <BlogPostsTable />
      </Suspense>
    </div>
  );
}