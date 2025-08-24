"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-animations/scroll-reveal";
import { StaggerReveal } from "@/components/scroll-animations/stagger-reveal";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Testimonial {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  imageUrl?: string;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TestimonialsSectionProps {
  limit?: number;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function TestimonialsSection({
  limit = 6,
  showNavigation = true,
  autoPlay = true,
  autoPlayInterval = 5000,
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Determine how many testimonials to show per view
  const testimonialsPerView = isMobile ? 1 : isTablet ? 2 : 3;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (autoPlay && testimonials.length > testimonialsPerView) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = Math.max(0, testimonials.length - testimonialsPerView);
          return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, testimonials.length, testimonialsPerView]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/testimonials?approved=true&featured=true&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    const maxIndex = Math.max(0, testimonials.length - testimonialsPerView);
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    const maxIndex = Math.max(0, testimonials.length - testimonialsPerView);
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  const renderStars = (rating: number | null) => {
    const stars = rating || 5;
    return (
      <div className="flex items-center mb-4" aria-label={`Rating: ${stars} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < stars ? "text-[#FF5001] fill-current" : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => {
    const displayName = testimonial.name;
    const displayPosition = testimonial.position && testimonial.company 
      ? `${testimonial.position}, ${testimonial.company}`
      : testimonial.position || testimonial.company || "";

    return (
      <Card 
        key={testimonial.id} 
        className="bg-[#1A1A1A] border-[#333333] p-6 sm:p-8 h-full flex flex-col"
        role="article"
        aria-label={`Testimonial from ${displayName}`}
      >
        <CardContent className="p-0 flex flex-col h-full">
          {renderStars(testimonial.rating)}
          
          <blockquote className="text-[#E9E7E2]/80 mb-6 text-sm sm:text-base leading-relaxed flex-grow">
            "{testimonial.content}"
          </blockquote>
          
          <footer className="flex items-center mt-auto">
            <div className="relative w-12 h-12 mr-4 flex-shrink-0">
              <Image
                src={testimonial.imageUrl || "/placeholder-user.jpg"}
                alt={`${displayName} profile picture`}
                width={48}
                height={48}
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-user.jpg";
                }}
              />
            </div>
            <div className="min-w-0">
              <cite className="font-semibold text-sm sm:text-base not-italic">
                {displayName}
              </cite>
              {displayPosition && (
                <p className="text-[#E9E7E2]/60 text-xs sm:text-sm truncate">
                  {displayPosition}
                </p>
              )}
            </div>
          </footer>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
              Client Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 sm:p-8 animate-pulse">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-600 rounded mr-1"></div>
                  ))}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
              Client Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
              What Our Clients Say
            </h2>
            <p className="text-[#E9E7E2]/60 text-base">
              Unable to load testimonials at this time. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
              Client Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
              What Our Clients Say
            </h2>
            <p className="text-[#E9E7E2]/60 text-base">
              No testimonials available at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const maxIndex = Math.max(0, testimonials.length - testimonialsPerView);
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsPerView);

  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal
          className="text-center mb-8 sm:mb-12 md:mb-16"
          delay={0.1}
          mobileDelay={0.1}
          mobileAnimation="fade"
        >
          <span className="text-[#FF5001] text-sm uppercase tracking-widest font-medium">
            Client Stories
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#E9E7E2]/80 max-w-3xl mx-auto">
            Discover how we've helped brands transform their digital presence
            and achieve remarkable growth through strategic innovation.
          </p>
        </ScrollReveal>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
            >
              {visibleTestimonials.map((testimonial, index) =>
                renderTestimonialCard(testimonial, index)
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {showNavigation && testimonials.length > testimonialsPerView && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-[#1A1A1A] border border-[#333333] text-[#E9E7E2] hover:bg-[#FF5001] hover:border-[#FF5001] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === 0 && !autoPlay}
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="flex space-x-2">
                {[...Array(maxIndex + 1)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-[#FF5001] w-6"
                        : "bg-[#333333] hover:bg-[#FF5001]/50"
                    }`}
                    aria-label={`Go to testimonial set ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-[#1A1A1A] border border-[#333333] text-[#E9E7E2] hover:bg-[#FF5001] hover:border-[#FF5001] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === maxIndex && !autoPlay}
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}