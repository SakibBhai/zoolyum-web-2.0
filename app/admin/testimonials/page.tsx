'use client'

import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Testimonial = {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  featured: boolean;
  order: number;
  updatedAt: Date;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading testimonials...</div>
        </div>
      </div>
    );
  }

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
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              );
            }
          }
        ]}
      />
    </div>
  );
}