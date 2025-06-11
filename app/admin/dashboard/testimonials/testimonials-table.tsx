'use client';

import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  rating: number | null;
  featured: boolean;
  order: number;
  updatedAt: string;
  featuredStatus: string;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
}

function CompanyCell({ company }: { company: string | null }) {
  return <span>{company || 'N/A'}</span>;
}

function RatingCell({ rating }: { rating: number | null }) {
  return <span>{rating || 'N/A'}</span>;
}

function ActionsCell({ id }: { id: string }) {
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

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
  const columns = useMemo(() => [
    { header: 'Name', accessorKey: 'name' },
    { 
      header: 'Company', 
      accessorKey: 'company',
      cell: ({ row }: any) => <CompanyCell company={row.original.company} />
    },
    { 
      header: 'Rating', 
      accessorKey: 'rating',
      cell: ({ row }: any) => <RatingCell rating={row.original.rating} />
    },
    { header: 'Status', accessorKey: 'featuredStatus' },
    { header: 'Order', accessorKey: 'order' },
    { header: 'Updated', accessorKey: 'updatedAt' },
    { 
      header: 'Actions', 
      accessorKey: 'id',
      cell: ({ row }: any) => <ActionsCell id={row.original.id} />
    }
  ], []);

  return (
    <DataTable
      data={testimonials}
      columns={columns}
    />
  );
}