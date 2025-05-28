"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useMouse } from "@/hooks/use-mouse"

export function CustomCursor() {
  const { x, y } = useMouse()
  const [cursorText, setCursorText] = useState("")
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if the element or its parent is interactive
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("data-interactive") === "true" ||
        target.closest("[data-interactive='true']")

      if (isInteractive) {
        setCursorVariant("hover")

        // Get custom text if available
        const text =
          target.getAttribute("data-cursor-text") ||
          target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text") ||
          ""
        setCursorText(text)
      } else {
        setCursorVariant("default")
        setCursorText("")
      }
    }

    window.addEventListener("mouseover", handleMouseOver)
    return () => window.removeEventListener("mouseover", handleMouseOver)
  }, [])

  const variants = {
    default: {
      x: x - 16,
      y: y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 80, 1, 0.2)",
      mixBlendMode: "difference" as const,
    },
    hover: {
      x: x - 40,
      y: y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(255, 80, 1, 0.4)",
      mixBlendMode: "difference" as const,
    },
  }

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] flex items-center justify-center text-[#161616] font-bold text-sm"
      variants={variants}
      animate={cursorVariant}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      {cursorText && <span>{cursorText}</span>}
    </motion.div>
  )
}
