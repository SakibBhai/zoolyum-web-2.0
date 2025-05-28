"use client"

import React from "react"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface StaggerRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  mobileStaggerDelay?: number
  threshold?: number
  once?: boolean
  animation?: "fade" | "slide" | "scale" | "fade-slide" | "fade-scale"
  direction?: "up" | "down" | "left" | "right"
  mobileAnimation?: "fade" | "slide" | "scale" | "fade-slide" | "fade-scale"
  mobileDirection?: "up" | "down" | "left" | "right"
  mobileDuration?: number
}

export function StaggerReveal({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  mobileStaggerDelay,
  threshold = 0.1,
  once = true,
  animation = "fade-slide",
  direction = "up",
  mobileAnimation,
  mobileDirection,
  mobileDuration,
}: StaggerRevealProps) {
  const { ref, controls, isMobile } = useScrollAnimation({
    threshold,
    once,
    delay,
  })

  // Use mobile-specific animation and direction if provided and on mobile
  const effectiveAnimation = isMobile && mobileAnimation ? mobileAnimation : animation
  const effectiveDirection = isMobile && mobileDirection ? mobileDirection : direction
  const effectiveStaggerDelay = isMobile && mobileStaggerDelay !== undefined ? mobileStaggerDelay : staggerDelay

  // Define animation variants based on the animation type and direction
  const getContainerVariants = () => {
    return {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: effectiveStaggerDelay,
          delayChildren: delay,
        },
      },
    }
  }

  const getItemVariants = () => {
    // Adjust values for mobile
    const slideDistance = isMobile ? 20 : 50
    const scaleValue = isMobile ? 0.95 : 0.8
    const duration = isMobile ? mobileDuration || 0.4 : 0.5

    switch (effectiveAnimation) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
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
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
          },
        }
      case "scale":
        return {
          hidden: { scale: scaleValue, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
          },
        }
      case "fade-scale":
        return {
          hidden: { opacity: 0, scale: isMobile ? 0.95 : 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
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
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
          },
        }
    }
  }

  const containerVariants = getContainerVariants()
  const itemVariants = getItemVariants()

  // Limit the number of animated children on mobile for performance
  const childrenArray = React.Children.toArray(children)
  const maxAnimatedItems = isMobile ? 6 : childrenArray.length

  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={controls} variants={containerVariants}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child

        // For mobile, only animate the first few items for performance
        if (isMobile && index >= maxAnimatedItems) {
          return (
            <motion.div key={index} initial={{ opacity: 1 }}>
              {child}
            </motion.div>
          )
        }

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            // Improve touch response
            whileTap={isMobile ? { scale: 1 } : undefined}
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
