import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TestimonialView } from "./testimonial-view";
import { TestimonialViewSkeleton } from "./testimonial-view-skeleton";

interface TestimonialPageProps {
  params: Promise<{ id: string }>;
}

// Server Component - Main page wrapper
export default async function TestimonialPage({
  params,
}: TestimonialPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<TestimonialViewSkeleton />}>
        <TestimonialContent id={id} />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function TestimonialContent({ id }: { id: string }) {
  // Fetch testimonial on the server
  const testimonial = await getTestimonial(id);

  if (!testimonial) {
    notFound();
  }

  return <TestimonialView testimonial={testimonial} />;
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
