"use client"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface TextRevealProps {
  children: string | ReactNode
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
  type?: "words" | "chars" | "lines"
  staggerDelay?: number
  mobileType?: "words" | "chars" | "lines" | "none"
  mobileStaggerDelay?: number
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.2,
  once = true,
  type = "words",
  staggerDelay = 0.03,
  mobileType,
  mobileStaggerDelay,
}: TextRevealProps) {
  const { ref, controls, isMobile } = useScrollAnimation({
    threshold,
    once,
    delay,
  })

  // Use mobile-specific type if provided and on mobile
  const effectiveType = isMobile && mobileType !== undefined ? mobileType : type
  const effectiveStaggerDelay = isMobile && mobileStaggerDelay !== undefined ? mobileStaggerDelay : staggerDelay

  // If children is not a string, just wrap it in a motion div
  if (typeof children !== "string" || (isMobile && mobileType === "none")) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: isMobile ? 0.4 : 0.5, delay },
          },
        }}
      >
        {children}
      </motion.div>
    )
  }

  // Split text into words, chars, or lines
  const renderContent = () => {
    if (effectiveType === "chars") {
      return (
        <motion.span
          ref={ref}
          className={className}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: effectiveStaggerDelay,
                delayChildren: delay,
              },
            },
          }}
        >
          {Array.from(children).map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: isMobile ? 10 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: isMobile ? 0.3 : 0.4, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      )
    }

    if (effectiveType === "words") {
      const words = children.split(" ")
      return (
        <motion.span
          ref={ref}
          className={className}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: effectiveStaggerDelay,
                delayChildren: delay,
              },
            },
          }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: isMobile ? 10 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: isMobile ? 0.3 : 0.4, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
              {index !== words.length - 1 && "\u00A0"}
            </motion.span>
          ))}
        </motion.span>
      )
    }

    // Default to lines
    const lines = children.split("\n")
    return (
      <motion.span
        ref={ref}
        className={className}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: effectiveStaggerDelay,
              delayChildren: delay,
            },
          },
        }}
      >
        {lines.map((line, index) => (
          <motion.div
            key={index}
            className="block"
            variants={{
              hidden: { opacity: 0, y: isMobile ? 10 : 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: isMobile ? 0.3 : 0.4, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {line}
          </motion.div>
        ))}
      </motion.span>
    )
  }

  return renderContent()
}
