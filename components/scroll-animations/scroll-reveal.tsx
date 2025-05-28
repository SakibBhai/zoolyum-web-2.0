"use client"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  mobileDelay?: number
  threshold?: number
  once?: boolean
  animation?: "fade" | "slide" | "scale" | "fade-slide" | "fade-scale"
  direction?: "up" | "down" | "left" | "right"
  mobileAnimation?: "fade" | "slide" | "scale" | "fade-slide" | "fade-scale"
  mobileDirection?: "up" | "down" | "left" | "right"
  mobileDuration?: number
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  mobileDelay,
  threshold = 0.2,
  once = true,
  animation = "fade-slide",
  direction = "up",
  mobileAnimation,
  mobileDirection,
  mobileDuration,
}: ScrollRevealProps) {
  const { ref, controls, isMobile } = useScrollAnimation({
    threshold,
    once,
    delay,
    mobileDelay,
    mobileDuration,
  })

  // Use mobile-specific animation and direction if provided and on mobile
  const effectiveAnimation = isMobile && mobileAnimation ? mobileAnimation : animation
  const effectiveDirection = isMobile && mobileDirection ? mobileDirection : direction

  // Define animation variants based on the animation type and direction
  const getVariants = () => {
    // Adjust values for mobile
    const slideDistance = isMobile ? 20 : 50
    const scaleValue = isMobile ? 0.95 : 0.8

    switch (effectiveAnimation) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: isMobile ? mobileDuration || 0.4 : 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: isMobile && mobileDelay !== undefined ? mobileDelay : delay,
            },
          },
        }
      case "slide":
        return {
          hidden: {
            x: effectiveDirection === "left" ? -slideDistance : effectiveDirection === "right" ? slideDistance : 0,
            y: effectiveDirection === "up" ? slideDistance : effectiveDirection === "down" ? -slideDistance : 0,
          },
          visible: {
            x: 0,
            y: 0,
            transition: {
              duration: isMobile ? mobileDuration || 0.4 : 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: isMobile && mobileDelay !== undefined ? mobileDelay : delay,
            },
          },
        }
      case "scale":
        return {
          hidden: { scale: scaleValue, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: isMobile ? mobileDuration || 0.4 : 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: isMobile && mobileDelay !== undefined ? mobileDelay : delay,
            },
          },
        }
      case "fade-scale":
        return {
          hidden: { opacity: 0, scale: isMobile ? 0.95 : 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: isMobile ? mobileDuration || 0.4 : 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: isMobile && mobileDelay !== undefined ? mobileDelay : delay,
            },
          },
        }
      case "fade-slide":
      default:
        return {
          hidden: {
            opacity: 0,
            x: effectiveDirection === "left" ? -30 : effectiveDirection === "right" ? 30 : 0,
            y:
              effectiveDirection === "up"
                ? isMobile
                  ? 20
                  : 30
                : effectiveDirection === "down"
                  ? isMobile
                    ? -20
                    : -30
                  : 0,
          },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              duration: isMobile ? mobileDuration || 0.4 : 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: isMobile && mobileDelay !== undefined ? mobileDelay : delay,
            },
          },
        }
    }
  }

  const variants = getVariants()

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
