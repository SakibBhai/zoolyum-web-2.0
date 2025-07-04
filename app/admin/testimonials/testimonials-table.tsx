"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Testimonial } from "@/lib/testimonial-operations";

interface TestimonialsTableProps {
  testimonials: Testimonial[];
}

function ImageCell({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 h-10 w-10">
        {testimonial.imageUrl ? (
          <Image
            src={testimonial.imageUrl}
            alt={testimonial.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {testimonial.name}
        </p>
        {testimonial.position && (
          <p className="text-sm text-gray-500 truncate">
            {testimonial.position}
            {testimonial.company && ` at ${testimonial.company}`}
          </p>
        )}
      </div>
    </div>
  );
}

function CompanyCell({ company }: { company: string | null }) {
  return (
    <div className="text-sm text-gray-900">
      {company || <span className="text-gray-400">—</span>}
    </div>
  );
}

function RatingCell({ rating }: { rating: number | null }) {
  if (!rating) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );
}

function StatusCell({ testimonial }: { testimonial: Testimonial }) {
  const getStatusDisplay = (testimonial: Testimonial) => {
    if (testimonial.featured) return "Featured";
    if (testimonial.approved) return "Approved";
    return "Pending";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Featured":
        return "default";
      case "Approved":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const statusDisplay = getStatusDisplay(testimonial);

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={getStatusVariant(statusDisplay)}>
        {statusDisplay}
      </Badge>
      {testimonial.featured && (
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}
    </div>
  );
}

function ContentCell({ content }: { content: string }) {
  return (
    <div className="max-w-xs">
      <p className="text-sm text-gray-900 truncate" title={content}>
        {content}
      </p>
    </div>
  );
}

function ActionsCell({ testimonial }: { testimonial: Testimonial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/testimonials/${testimonial.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete testimonial");
        }

        toast.success("Testimonial deleted successfully");
        router.refresh();
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        toast.error("Failed to delete testimonial");
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/admin/testimonials/${testimonial.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
  const columns: ColumnDef<Testimonial>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Testimonial",
        cell: ({ row }) => <ImageCell testimonial={row.original} />,
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => <CompanyCell company={row.original.company} />,
      },
      {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) => <ContentCell content={row.original.content} />,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => <RatingCell rating={row.original.rating} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusCell testimonial={row.original} />,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell testimonial={row.original} />,
      },
    ],
    []
  );

  return (
    <DataTable
      data={testimonials}
      columns={columns}
    />
  );
}
