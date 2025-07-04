import { Suspense } from "react";
import { TestimonialsTable } from "./testimonials-table";
import { TestimonialsPageHeader } from "./testimonials-page-header";
import { TestimonialsSkeleton } from "./testimonials-skeleton";
// Components for testimonials admin page

// Server Component - Main page wrapper
export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <TestimonialsPageHeader />
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsContent />
      </Suspense>
    </div>
  );
}

// Server Component - Data fetching
async function TestimonialsContent() {
  // Fetch testimonials on the server
  const testimonials = await getTestimonials();

  return <TestimonialsTable testimonials={testimonials} />;
}

// Server-side data fetching function
async function getTestimonials() {
  try {
    const { fetchTestimonials } = await import("@/lib/testimonial-operations");
    return await fetchTestimonials();
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
