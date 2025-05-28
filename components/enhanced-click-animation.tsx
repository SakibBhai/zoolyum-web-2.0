"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ClickEffect {
  id: number
  x: number
  y: number
  color: string
  size: number
  type: "ripple" | "burst" | "pulse"
}

export function EnhancedClickAnimation() {
  const [effects, setEffects] = useState<ClickEffect[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only create effects for interactive elements
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("data-interactive") === "true" ||
        target.closest("[data-interactive='true']")

      if (isInteractive) {
        // Get custom effect properties if specified
        const effectType =
          target.getAttribute("data-click-effect") ||
          target.closest("[data-click-effect]")?.getAttribute("data-click-effect") ||
          "ripple"

        const effectColor =
          target.getAttribute("data-click-color") ||
          target.closest("[data-click-color]")?.getAttribute("data-click-color") ||
          "#FF5001"

        // Create new effect
        const newEffect = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          color: effectColor,
          size: Math.random() * 20 + 40, // Random size between 40-60px
          type: effectType as "ripple" | "burst" | "pulse",
        }

        setEffects((prev) => [...prev, newEffect])

        // Remove effect after animation completes
        setTimeout(() => {
          setEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
        }, 1000)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {effects.map((effect) => {
          // Different animation based on effect type
          if (effect.type === "burst") {
            return <BurstEffect key={effect.id} x={effect.x} y={effect.y} color={effect.color} size={effect.size} />
          } else if (effect.type === "pulse") {
            return <PulseEffect key={effect.id} x={effect.x} y={effect.y} color={effect.color} size={effect.size} />
          } else {
            // Default ripple effect
            return <RippleEffect key={effect.id} x={effect.x} y={effect.y} color={effect.color} size={effect.size} />
          }
        })}
      </AnimatePresence>
    </div>
  )
}

interface EffectProps {
  x: number
  y: number
  color: string
  size: number
}

function RippleEffect({ x, y, color, size }: EffectProps) {
  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 0 }}
      animate={{ opacity: 0, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: `${color}40`, // 25% opacity
      }}
    />
  )
}

function BurstEffect({ x, y, color, size }: EffectProps) {
  // Create 8 particles for the burst effect
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2
    return {
      id: i,
      angle,
      distance: size,
    }
  })

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 0.8,
            scale: 0.2,
            x: x,
            y: y,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            x: x + Math.cos(particle.angle) * particle.distance,
            y: y + Math.sin(particle.angle) * particle.distance,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: size / 4,
            height: size / 4,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      ))}
    </>
  )
}

function PulseEffect({ x, y, color, size }: EffectProps) {
  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 0.5 }}
      animate={[
        { opacity: 0.7, scale: 0.5, borderWidth: size / 10 },
        { opacity: 0, scale: 1.2, borderWidth: 1 },
      ]}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${size / 10}px solid ${color}`,
        backgroundColor: "transparent",
      }}
    />
  )
}
