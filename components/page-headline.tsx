"use client"

import { TextReveal } from "./scroll-animations/text-reveal"
import { ScrollReveal } from "./scroll-animations/scroll-reveal"
import { motion } from "framer-motion"

interface PageHeadlineProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center" | "right"
  size?: "small" | "medium" | "large"
  titleGradient?: boolean
  className?: string
}

export function PageHeadline({
  eyebrow,
  title,
  description,
  align = "center",
  size = "large",
  titleGradient = false,
  className = "",
}: PageHeadlineProps) {
  // Determine text alignment classes
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align]

  // Determine title size classes
  const titleSize = {
    small: "text-3xl md:text-4xl lg:text-5xl",
    medium: "text-4xl md:text-5xl lg:text-6xl",
    large: "text-5xl md:text-6xl lg:text-7xl",
  }[size]

  // Determine description size
  const descriptionSize = {
    small: "text-base md:text-lg",
    medium: "text-lg md:text-xl",
    large: "text-xl md:text-2xl",
  }[size]

  return (
    <ScrollReveal className={`flex flex-col ${alignClass} mb-12 md:mb-16 lg:mb-20 ${className}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#FF5001] text-sm md:text-base uppercase tracking-widest font-medium mb-3"
        >
          {eyebrow}
        </motion.span>
      )}

      <TextReveal
        type="words"
        mobileType="words"
        mobileStaggerDelay={0.02}
        className={`font-bold ${titleSize} ${titleGradient ? "gradient-headline" : ""} mb-4 md:mb-6`}
      >
        {title}
      </TextReveal>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${descriptionSize} text-[#E9E7E2]/80 max-w-3xl mx-auto`}
        >
          {description}
        </motion.p>
      )}
    </ScrollReveal>
  )
}
