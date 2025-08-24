"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Image from "next/image";

interface ImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
  className?: string;
  imageClassName?: string;
  delay?: number;
  threshold?: number;
  once?: boolean;
  direction?: "left" | "right" | "top" | "bottom";
  mobileDirection?: "left" | "right" | "top" | "bottom";
  mobileDuration?: number;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

export function ImageReveal({
  src,
  alt,
  width = 800,
  height = 600,
  aspectRatio = "auto",
  className = "",
  imageClassName = "",
  delay = 0,
  threshold = 0.2,
  once = true,
  direction = "left",
  mobileDirection,
  mobileDuration,
  priority = false,
  sizes,
  fill = false,
}: ImageRevealProps) {
  const { ref, controls, isMobile } = useScrollAnimation({
    threshold,
    once,
    delay,
  });

  // Use mobile-specific direction if provided and on mobile
  const effectiveDirection =
    isMobile && mobileDirection ? mobileDirection : direction;

  // Define the direction of the reveal animation
  const getDirectionVariants = () => {
    const duration = isMobile ? mobileDuration || 0.6 : 0.8;

    switch (effectiveDirection) {
      case "right":
        return {
          hidden: { clipPath: "inset(0 100% 0 0)" },
          visible: {
            clipPath: "inset(0 0% 0 0)",
            transition: { duration, delay },
          },
        };
      case "top":
        return {
          hidden: { clipPath: "inset(100% 0 0 0)" },
          visible: {
            clipPath: "inset(0 0 0 0)",
            transition: { duration, delay },
          },
        };
      case "bottom":
        return {
          hidden: { clipPath: "inset(0 0 100% 0)" },
          visible: {
            clipPath: "inset(0 0 0% 0)",
            transition: { duration, delay },
          },
        };
      case "left":
      default:
        return {
          hidden: { clipPath: "inset(0 0 0 100%)" },
          visible: {
            clipPath: "inset(0 0 0 0%)",
            transition: { duration, delay },
          },
        };
    }
  };

  const variants = getDirectionVariants();

  // Get aspect ratio classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
        return "aspect-[4/3]";
      default:
        return "";
    }
  };

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill 
      ? "100vw"
      : isMobile 
        ? "100vw" 
        : `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${width}px`
  );

  const aspectClass = getAspectRatioClass();
  const containerClass = fill ? "relative" : aspectClass;

  return (
    <div ref={ref} className={`overflow-hidden ${containerClass} ${className}`}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        className={fill ? "absolute inset-0" : "h-full w-full"}
        // Improve touch response
        whileTap={isMobile ? { scale: 1 } : undefined}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          {...(fill ? { fill: true } : { width, height })}
          className={`object-cover transition-transform duration-300 hover:scale-105 ${fill ? "" : "w-full h-full"} ${imageClassName}`}
          sizes={responsiveSizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </motion.div>
    </div>
  );
}
