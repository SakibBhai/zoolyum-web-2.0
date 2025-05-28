"use client"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Image from "next/image"

interface ImageRevealProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  imageClassName?: string
  delay?: number
  threshold?: number
  once?: boolean
  direction?: "left" | "right" | "top" | "bottom"
  mobileDirection?: "left" | "right" | "top" | "bottom"
  mobileDuration?: number
}

export function ImageReveal({
  src,
  alt,
  width,
  height,
  className = "",
  imageClassName = "",
  delay = 0,
  threshold = 0.2,
  once = true,
  direction = "left",
  mobileDirection,
  mobileDuration,
}: ImageRevealProps) {
  const { ref, controls, isMobile } = useScrollAnimation({
    threshold,
    once,
    delay,
  })

  // Use mobile-specific direction if provided and on mobile
  const effectiveDirection = isMobile && mobileDirection ? mobileDirection : direction

  // Define the direction of the reveal animation
  const getDirectionVariants = () => {
    const duration = isMobile ? mobileDuration || 0.6 : 0.8

    switch (effectiveDirection) {
      case "right":
        return {
          hidden: { clipPath: "inset(0 100% 0 0)" },
          visible: {
            clipPath: "inset(0 0% 0 0)",
            transition: { duration, ease: [0.22, 1, 0.36, 1], delay },
          },
        }
      case "top":
        return {
          hidden: { clipPath: "inset(100% 0 0 0)" },
          visible: {
            clipPath: "inset(0 0 0 0)",
            transition: { duration, ease: [0.22, 1, 0.36, 1], delay },
          },
        }
      case "bottom":
        return {
          hidden: { clipPath: "inset(0 0 100% 0)" },
          visible: {
            clipPath: "inset(0 0 0% 0)",
            transition: { duration, ease: [0.22, 1, 0.36, 1], delay },
          },
        }
      case "left":
      default:
        return {
          hidden: { clipPath: "inset(0 0 0 100%)" },
          visible: {
            clipPath: "inset(0 0 0 0%)",
            transition: { duration, ease: [0.22, 1, 0.36, 1], delay },
          },
        }
    }
  }

  const variants = getDirectionVariants()

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        className="h-full w-full"
        // Improve touch response
        whileTap={isMobile ? { scale: 1 } : undefined}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover ${imageClassName}`}
          sizes={isMobile ? "100vw" : `(max-width: 768px) 100vw, ${width}px`}
          priority={isMobile}
        />
      </motion.div>
    </div>
  )
}
