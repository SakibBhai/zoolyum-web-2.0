"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function TestimonialsPageHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    startTransition(() => {
      router.refresh();
      setIsRefreshing(false);
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
        <p className="text-muted-foreground">
          Manage your client testimonials and reviews
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || isPending}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${
              isRefreshing || isPending ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </Link>
      </div>
    </div>
  );
}
