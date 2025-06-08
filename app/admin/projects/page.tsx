import Link from 'next/link';
import { prisma } from '@/lib/db';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';

// Define the Project type to match the database schema
type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  updatedAt: Date;
  author: {
    name: string | null;
  } | null;
};

// Define the ProjectRow type for the DataTable
type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  authorName: string;
  updatedAt: string;
  actions: string;
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
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
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </Link>
      </div>
      
      <DataTable
        data={projects.map((project: Project) => ({
          id: project.id,
          title: project.title,
          slug: project.slug,
          category: project.category,
          authorName: project.author?.name || 'Unknown',
          updatedAt: new Date(project.updatedAt).toLocaleDateString(),
          status: project.published ? 'Published' : 'Draft',
          actions: project.id
        }))}
        columns={[
          { header: 'Title', accessorKey: 'title' },
          { header: 'Slug', accessorKey: 'slug' },
          { header: 'Category', accessorKey: 'category' },
          { header: 'Status', accessorKey: 'status' },
          { header: 'Author', accessorKey: 'authorName' },
          { header: 'Updated', accessorKey: 'updatedAt' },
          { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: ({ row }: { row: { original: ProjectRow } }) => {
              const id = row.original.id;
              return (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/${id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/projects/${id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/projects/${id}/delete`}>
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