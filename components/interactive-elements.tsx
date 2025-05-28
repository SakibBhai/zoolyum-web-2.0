"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface EnhancedLinkProps {
  href: string
  children: ReactNode
  className?: string
  cursorText?: string
  cursorColor?: string
  magnetic?: boolean
  magneticStrength?: number
  effectType?: "ripple" | "burst" | "pulse"
}

export function EnhancedLink({
  href,
  children,
  className = "",
  cursorText = "",
  cursorColor = "#FF5001",
  magnetic = false,
  magneticStrength = 30,
  effectType = "ripple",
}: EnhancedLinkProps) {
  // If magnetic effect is enabled, use MagneticElement
  if (magnetic) {
    return (
      <MagneticElement
        as="a"
        href={href}
        className={className}
        strength={magneticStrength}
        cursorType="link"
        cursorText={cursorText}
        cursorColor={cursorColor}
      >
        <span data-click-effect={effectType} data-click-color={cursorColor}>
          {children}
        </span>
      </MagneticElement>
    )
  }

  // Otherwise use standard motion link
  return (
    <Link href={href} className={className}>
      <motion.span
        className="inline-block relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        data-cursor="link"
        data-cursor-text={cursorText}
        data-cursor-color={cursorColor}
        data-click-effect={effectType}
        data-click-color={cursorColor}
      >
        {children}
        <motion.span
          className="absolute left-0 right-0 bottom-0 h-[2px] bg-current origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.span>
    </Link>
  )
}

interface EnhancedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
  cursorText?: string
  cursorColor?: string
  disabled?: boolean
  magnetic?: boolean
  magneticStrength?: number
  effectType?: "ripple" | "burst" | "pulse"
}

export function EnhancedButton({
  children,
  onClick,
  className = "",
  type = "button",
  cursorText = "",
  cursorColor = "#FF5001",
  disabled = false,
  magnetic = false,
  magneticStrength = 40,
  effectType = "ripple",
}: EnhancedButtonProps) {
  // If disabled, return standard button without effects
  if (disabled) {
    return (
      <button type={type} onClick={onClick} className={className} disabled>
        {children}
      </button>
    )
  }

  // If magnetic effect is enabled, use MagneticElement
  if (magnetic) {
    return (
      <MagneticElement
        as="button"
        className={className}
        strength={magneticStrength}
        onClick={onClick}
        cursorType="button"
        cursorText={cursorText}
        cursorColor={cursorColor}
      >
        <span data-click-effect={effectType} data-click-color={cursorColor}>
          {children}
        </span>
      </MagneticElement>
    )
  }

  // Otherwise use standard motion button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      data-cursor="button"
      data-cursor-text={cursorText}
      data-cursor-color={cursorColor}
      data-click-effect={effectType}
      data-click-color={cursorColor}
    >
      {children}
    </motion.button>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export function FloatingElement({ children, className = "", amplitude = 10, duration = 4 }: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [`-${amplitude}px`, `${amplitude}px`, `-${amplitude}px`],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      data-cursor="image"
    >
      {children}
    </motion.div>
  )
}

interface RevealTextProps {
  children: string
  className?: string
  delay?: number
}

export function RevealText({ children, className = "", delay = 0 }: RevealTextProps) {
  const words = children.split(" ")

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: delay + wordIndex * 0.05 + charIndex * 0.03,
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

interface MagneticElementProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  as?: "div" | "button" | "a"
  onClick?: () => void
  href?: string
  cursorType?: string
  cursorText?: string
  cursorColor?: string
}

export function MagneticElement({
  children,
  className = "",
  strength = 40,
  radius = 150,
  as = "div",
  onClick,
  href,
  cursorType,
  cursorText,
  cursorColor,
}: MagneticElementProps) {
  return null
}
