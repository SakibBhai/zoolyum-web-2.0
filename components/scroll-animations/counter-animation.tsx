"use client"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useEffect, useState } from "react"

interface CounterAnimationProps {
  end: number
  duration?: number
  mobileDuration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
  threshold?: number
  once?: boolean
  decimals?: number
}

export function CounterAnimation({
  end,
  duration = 1.5,
  mobileDuration,
  delay = 0,
  prefix = "",
  suffix = "",
  className = "",
  threshold = 0.2,
  once = true,
  decimals = 0,
}: CounterAnimationProps) {
  const { ref, isInView, isMobile } = useScrollAnimation({
    threshold,
    once,
    delay,
  })
  const [count, setCount] = useState(0)

  // Use mobile-specific duration if provided and on mobile
  const effectiveDuration = isMobile && mobileDuration !== undefined ? mobileDuration : duration

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    if (isInView) {
      // Shorter animation on mobile for better performance
      const animDuration = effectiveDuration * 1000

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / animDuration, 1)

        setCount(progress * end)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step)
        }
      }

      animationFrame = requestAnimationFrame(step)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isInView, end, effectiveDuration])

  const formatNumber = (num: number) => {
    return num.toFixed(decimals)
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
