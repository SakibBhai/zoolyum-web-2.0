import Link from 'next/link';
import { prisma } from '@/lib/db';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      company: true,
      rating: true,
      featured: true,
      order: true,
      updatedAt: true,
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Testimonial
          </Button>
        </Link>
      </div>
      
      <DataTable
        data={testimonials.map(testimonial => ({
          ...testimonial,
          updatedAt: new Date(testimonial.updatedAt).toLocaleDateString(),
          featuredStatus: testimonial.featured ? 'Featured' : 'Regular',
          actions: testimonial.id
        }))}
        columns={[
          { header: 'Name', accessorKey: 'name' },
          { header: 'Company', accessorKey: 'company' },
          { header: 'Rating', accessorKey: 'rating' },
          { header: 'Status', accessorKey: 'featuredStatus' },
          { header: 'Order', accessorKey: 'order' },
          { header: 'Updated', accessorKey: 'updatedAt' },
          { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: ({ row }) => {
              const id = row.original.id;
              return (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/testimonials/${id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/testimonials/${id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/testimonials/${id}/delete`}>
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