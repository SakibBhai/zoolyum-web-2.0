'use client'

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Client component for fetching projects data
interface Project {
  id: string;
  name: string;
  slug: string;
  type: string;
  published: boolean;
  featured: boolean;
  client?: string;
  year?: string;
  projectUrl?: string;
  imageUrl?: string;
  updatedAt: string;
}

interface DataTableProject extends Project {
  status: string;
  actions: string;
}

function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(projects.filter(project => project.id !== projectToDelete));
        toast({
          title: 'Success',
          description: 'Project deleted successfully!',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: `Failed to delete project: ${error.error || 'Unknown error'}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the project.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border border-[#333333] rounded-lg">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="h-8 w-[120px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <DataTable<DataTableProject>
        data={projects.map(project => ({
          ...project,
          updatedAt: new Date(project.updatedAt).toLocaleDateString(),
          status: project.published ? 'Published' : 'Draft',
          actions: project.id
        }))}
        columns={[
          { 
            header: 'Project', 
            accessorKey: 'name',
            cell: ({ row }) => (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#333333] flex-shrink-0">
                  {row.original.imageUrl ? (
                    <img 
                      src={row.original.imageUrl} 
                      alt={row.original.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#E9E7E2]/40 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[#E9E7E2]">{row.original.name}</span>
                  <span className="text-sm text-[#E9E7E2]/60">{row.original.slug}</span>
                </div>
              </div>
            )
          },
          { 
            header: 'Category', 
            accessorKey: 'type',
            cell: ({ row }) => (
              <Badge variant="outline" className="text-[#E9E7E2] border-[#E9E7E2]/20">
                {row.original.type}
              </Badge>
            )
          },
          { 
            header: 'Client', 
            accessorKey: 'client',
            cell: ({ row }) => (
              <span className="text-[#E9E7E2]/80">
                {row.original.client || '-'}
              </span>
            )
          },
          { 
            header: 'Year', 
            accessorKey: 'year',
            cell: ({ row }) => (
              <span className="text-[#E9E7E2]/80">
                {row.original.year || '-'}
              </span>
            )
          },
          { 
            header: 'Status', 
            accessorKey: 'status',
            cell: ({ row }) => {
              const status = row.original.status;
              const featured = row.original.featured;
              return (
                <div className="flex gap-1">
                  <Badge 
                    variant={status === 'Published' ? 'default' : 'secondary'}
                    className={status === 'Published' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}
                  >
                    {status}
                  </Badge>
                  {featured && (
                    <Badge variant="outline" className="text-[#FF5001] border-[#FF5001]">
                      Featured
                    </Badge>
                  )}
                </div>
              );
            }
          },
          { header: 'Updated', accessorKey: 'updatedAt' },
          { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: ({ row }) => {
              const project = row.original;
              return (
                <div className="flex items-center gap-2">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" title="View Live Project">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  <Link href={`/work/${project.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="Preview">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Delete"
                    onClick={() => handleDeleteClick(project.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              );
            }
          }
        ]}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header renders immediately */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E9E7E2]">Projects</h1>
          <p className="text-[#E9E7E2]/60 mt-1">Manage your portfolio projects and case studies</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-[#FF5001] hover:bg-[#FF5001]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </Link>
      </div>
      
      {/* Table with Suspense boundary for streaming */}
      <Suspense fallback={
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-[#333333] rounded-lg">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <Skeleton className="h-8 w-[120px]" />
            </div>
          ))}
        </div>
      }>
        <ProjectsTable />
      </Suspense>
    </div>
  );
}