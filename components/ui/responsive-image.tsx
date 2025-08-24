"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

const DEFAULT_BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export function ResponsiveImage({
  src,
  alt,
  width = 800,
  height = 600,
  aspectRatio = "auto",
  className = "",
  priority = false,
  sizes,
  fill = false,
  objectFit = "cover",
  quality = 75,
  placeholder = "blur",
  blurDataURL = DEFAULT_BLUR_DATA_URL,
}: ResponsiveImageProps) {
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
      : `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${width}px`
  );

  const aspectClass = getAspectRatioClass();
  const containerClass = fill ? "relative" : aspectClass;
  const objectFitClass = `object-${objectFit}`;

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", containerClass, className)}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className={cn(objectFitClass, "transition-transform duration-300")}
          sizes={responsiveSizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", containerClass, className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn(objectFitClass, "w-full h-full transition-transform duration-300")}
        sizes={responsiveSizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      />
    </div>
  );
}

// Export common aspect ratio presets
export const AspectRatios = {
  SQUARE: "square" as const,
  VIDEO: "video" as const,
  PORTRAIT: "portrait" as const,
  LANDSCAPE: "landscape" as const,
  AUTO: "auto" as const,
};

// Export common responsive sizes presets
export const ResponsiveSizes = {
  FULL: "100vw",
  HALF: "(max-width: 768px) 100vw, 50vw",
  THIRD: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw",
  QUARTER: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  CARD: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px",
};