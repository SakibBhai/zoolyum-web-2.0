"use client"

import { useEffect } from "react"
import { useAnimation, useInView } from "framer-motion"
import { useRef } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface UseScrollAnimationProps {
  threshold?: number
  once?: boolean
  delay?: number
  mobileDelay?: number
  mobileDuration?: number
}

export function useScrollAnimation({
  threshold = 0.2,
  once = true,
  delay = 0,
  mobileDelay,
  mobileDuration,
}: UseScrollAnimationProps = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const controls = useAnimation()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Adjust delay and duration for mobile
  const effectiveDelay = isMobile && mobileDelay !== undefined ? mobileDelay : delay
  const effectiveDuration = isMobile && mobileDuration !== undefined ? mobileDuration : 0.6

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  return {
    ref,
    controls,
    isInView,
    isMobile,
    variants: {
      hidden: { opacity: 0, y: isMobile ? 20 : 30 }, // Smaller offset on mobile
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: effectiveDuration,
          ease: [0.22, 1, 0.36, 1],
          delay: effectiveDelay,
        },
      },
    },
  }
}
