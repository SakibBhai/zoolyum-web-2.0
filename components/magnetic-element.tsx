"use client"

import type React from "react"

import { useRef, useState, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

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
  const elementRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for x and y position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Add spring physics for smoother movement
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  // Handle mouse move for magnetic effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()

    // Calculate center of the element
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from mouse to center
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    // Calculate distance using Pythagorean theorem
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    // Only apply magnetic effect if within radius
    if (distance < radius) {
      // Calculate movement based on distance and strength
      // The closer to the center, the stronger the effect
      const magneticX = (distanceX / radius) * strength
      const magneticY = (distanceY / radius) * strength

      x.set(magneticX)
      y.set(magneticY)
    } else {
      // Reset position if outside radius
      x.set(0)
      y.set(0)
    }
  }

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  // Set data attributes for cursor interaction
  const dataAttributes = {
    "data-cursor": cursorType || "button",
    "data-cursor-text": cursorText || "",
    "data-cursor-color": cursorColor || "",
    "data-interactive": "true",
  }

  // Create component based on "as" prop
  const Component = motion[as] as any

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      href={as === "a" ? href : undefined}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...dataAttributes}
    >
      {children}
    </Component>
  )
}
