import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TestimonialEditForm } from "./testimonial-edit-form";
import { TestimonialEditSkeleton } from "./testimonial-edit-skeleton";

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

// Server Component - Main page wrapper
export default async function EditTestimonialPage({
  params,
}: EditTestimonialPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<TestimonialEditSkeleton />}>
        <TestimonialEditContent id={id} />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function TestimonialEditContent({ id }: { id: string }) {
  // Fetch testimonial on the server
  const testimonial = await getTestimonial(id);

  if (!testimonial) {
    notFound();
  }

  return <TestimonialEditForm testimonial={testimonial} />;
}

// Server-side data fetching function
async function getTestimonial(id: string) {
  try {
    const { getTestimonialById } = await import("@/lib/testimonial-operations");
    return await getTestimonialById(id);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return null;
  }
}
