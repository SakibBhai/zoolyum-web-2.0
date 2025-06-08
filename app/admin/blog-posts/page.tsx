import Link from 'next/link';
import { prisma } from '@/lib/db';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';

export default async function BlogPostsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      featured: true,
      updatedAt: true,
      author: {
        select: {
          name: true
        }
      }
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog-posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Post
          </Button>
        </Link>
      </div>
      
      <DataTable
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
    </div>
  );
}