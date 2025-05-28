"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useTransform } from "framer-motion"

interface Card3DProps {
  children: ReactNode
  className?: string
  depth?: number
  perspective?: number
  glareIntensity?: number
  shadow?: boolean
  disabled?: boolean
  onClick?: () => void
  cursorText?: string
}

export function Card3D({
  children,
  className = "",
  depth = 30,
  perspective = 1000,
  glareIntensity = 0.15,
  shadow = true,
  disabled = false,
  onClick,
  cursorText,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Motion values for rotation and glare position
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue("50%")
  const glareY = useMotionValue("50%")
  const glareOpacity = useMotionValue(0)

  // Add spring physics for smoother animation
  const springConfig = { damping: 15, stiffness: 150 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  // Transform for the shadow to move opposite to the card tilt
  const shadowX = useTransform(rotateY, [-depth, 0, depth], [`${depth / 3}px`, "0px", `-${depth / 3}px`])
  const shadowY = useTransform(rotateX, [depth, 0, -depth], [`-${depth / 3}px`, "0px", `${depth / 3}px`])

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    // Calculate mouse position relative to card center (in percentage)
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const percentX = (e.clientX - centerX) / (rect.width / 2)
    const percentY = (e.clientY - centerY) / (rect.height / 2)

    // Apply rotation based on mouse position
    rotateX.set(-percentY * depth)
    rotateY.set(percentX * depth)

    // Update glare effect position
    const glarePercentX = ((e.clientX - rect.left) / rect.width) * 100
    const glarePercentY = ((e.clientY - rect.top) / rect.height) * 100
    glareX.set(`${glarePercentX}%`)
    glareY.set(`${glarePercentY}%`)
    glareOpacity.set(isHovering ? glareIntensity : 0)
  }

  // Reset card position when mouse leaves
  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
    setIsHovering(false)
  }

  // Set hovering state when mouse enters
  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovering(true)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor={disabled ? undefined : "card"}
      data-cursor-text={disabled ? undefined : cursorText}
    >
      {/* Card content with 3D rotation */}
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main content */}
        <div className="relative w-full h-full z-10">{children}</div>

        {/* Glare effect overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[inherit]"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.8) 0%, transparent 80%)`,
          }}
        />
      </motion.div>

      {/* Shadow effect */}
      {shadow && (
        <motion.div
          className="absolute -z-10 inset-0 rounded-[inherit] opacity-0 bg-black/20 blur-lg"
          style={{
            opacity: useTransform(glareOpacity, [0, glareIntensity], [0, 0.3]),
            translateX: shadowX,
            translateY: shadowY,
          }}
        />
      )}
    </motion.div>
  )
}
