import { prisma } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TestimonialsTable } from './testimonials-table';

export default async function DashboardTestimonialsPage() {
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
      
      <TestimonialsTable 
        testimonials={testimonials.map(testimonial => ({
          ...testimonial,
          updatedAt: new Date(testimonial.updatedAt).toLocaleDateString(),
          featuredStatus: testimonial.featured ? 'Featured' : 'Regular'
        }))}
      />
    </div>
  );
}