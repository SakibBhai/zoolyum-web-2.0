"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ClickRipple {
  id: number
  x: number
  y: number
}

export function ClickAnimation() {
  const [ripples, setRipples] = useState<ClickRipple[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only create ripples for interactive elements
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("data-interactive") === "true" ||
        target.closest("[data-interactive='true']")

      if (isInteractive) {
        const newRipple = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
        }

        setRipples((prev) => [...prev, newRipple])

        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
        }, 1000)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.7, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-12 h-12 rounded-full bg-[#FF5001]/30"
            style={{
              left: ripple.x - 24,
              top: ripple.y - 24,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
