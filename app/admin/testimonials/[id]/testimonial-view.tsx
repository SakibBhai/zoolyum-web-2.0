"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Building,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { Testimonial } from "@/lib/testimonial-operations";

interface TestimonialViewProps {
  testimonial: Testimonial;
}

export function TestimonialView({ testimonial }: TestimonialViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/testimonials/${testimonial.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete testimonial");
        }

        toast.success("Testimonial deleted successfully");
        router.push("/admin/testimonials");
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        toast.error("Failed to delete testimonial");
      }
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/testimonials">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Testimonial Details</h1>
            <p className="text-muted-foreground">
              View and manage testimonial information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  testimonial and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Yes, delete testimonial
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Testimonial Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonial Content</CardTitle>
              <CardDescription>
                Review the testimonial content and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                  {testimonial.position && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {testimonial.position}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                  {testimonial.company && !testimonial.position && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              {testimonial.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({testimonial.rating}/5)
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <h4 className="font-medium mb-2">Testimonial</h4>
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approval Status</span>
                <Badge variant={testimonial.approved ? "default" : "secondary"}>
                  {testimonial.approved ? "Approved" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Featured</span>
                <Badge variant={testimonial.featured ? "default" : "outline"}>
                  {testimonial.featured ? "Featured" : "Not Featured"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {new Date(testimonial.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
