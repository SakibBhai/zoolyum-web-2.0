"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useMouse } from "@/hooks/use-mouse"

type CursorVariant = "default" | "text" | "link" | "button" | "image" | "slider"

interface CursorState {
  variant: CursorVariant
  text?: string
  color?: string
  size?: number
}

export function EnhancedCursor() {
  const { x, y } = useMouse()
  const [cursorState, setCursorState] = useState<CursorState>({
    variant: "default",
    text: "",
    color: "#FF5001",
    size: 16,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Use motion values for smoother animation
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  // Add spring physics for more natural movement
  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Transform the cursor scale based on clicking state
  const cursorScale = useMotionValue(1)
  const cursorScaleSpring = useSpring(cursorScale, springConfig)

  // Set up cursor rotation based on movement
  const cursorRotate = useMotionValue(0)
  const cursorRotateSpring = useSpring(cursorRotate, { damping: 50, stiffness: 200 })

  // Track previous position to calculate velocity and direction
  const prevX = useRef(0)
  const prevY = useRef(0)

  // Cursor trail effect positions, initialized to 0
  const trailX = useTransform(cursorXSpring, (value) => value - 8)
  const trailY = useTransform(cursorYSpring, (value) => value - 8)

  useEffect(() => {
    // Show cursor after a short delay to prevent initial animation
    const timer = setTimeout(() => setIsVisible(true), 500)

    // Handle mouse enter/leave for the document
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Handle mouse down/up for click animation
    const handleMouseDown = () => {
      setIsClicking(true)
      cursorScale.set(0.8)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
      cursorScale.set(1)
    }

    // Handle element interactions
    const handleElementInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check for data attributes to determine cursor state
      const cursorType =
        target.getAttribute("data-cursor") ||
        (target.closest("[data-cursor]")?.getAttribute("data-cursor") as CursorVariant)

      const cursorText =
        target.getAttribute("data-cursor-text") ||
        target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text") ||
        ""

      const cursorColor =
        target.getAttribute("data-cursor-color") ||
        target.closest("[data-cursor-color]")?.getAttribute("data-cursor-color") ||
        "#FF5001"

      const cursorSize =
        target.getAttribute("data-cursor-size") ||
        target.closest("[data-cursor-size]")?.getAttribute("data-cursor-size")

      // Check if element or its parent is interactive
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("data-interactive") === "true" ||
        target.closest("[data-interactive='true']") ||
        cursorType

      if (isInteractive) {
        setCursorState({
          variant: cursorType || "link",
          text: cursorText,
          color: cursorColor,
          size: cursorSize ? Number.parseInt(cursorSize) : undefined,
        })
      } else {
        setCursorState({
          variant: "default",
          text: "",
          color: "#FF5001",
          size: 16,
        })
      }
    }

    // Add event listeners
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleElementInteraction)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleElementInteraction)
    }
  }, [cursorScale])

  // Update cursor position with physics
  useEffect(() => {
    cursorX.set(x)
    cursorY.set(y)

    // Calculate direction and velocity for rotation effect
    const dx = x - prevX.current
    const dy = y - prevY.current

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      // Calculate angle based on movement direction
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      cursorRotate.set(angle)
    }

    prevX.current = x
    prevY.current = y
  }, [x, y, cursorX, cursorY, cursorRotate])

  // Determine cursor size based on variant
  const getCursorSize = () => {
    if (cursorState.size) return cursorState.size

    switch (cursorState.variant) {
      case "default":
        return 16
      case "text":
        return 40
      case "link":
        return 60
      case "button":
        return 80
      case "image":
        return 100
      case "slider":
        return 50
      default:
        return 16
    }
  }

  // Get cursor content based on variant
  const getCursorContent = () => {
    if (cursorState.text) return cursorState.text

    switch (cursorState.variant) {
      case "link":
        return "View"
      case "button":
        return "Click"
      case "image":
        return "View"
      case "slider":
        return "Drag"
      default:
        return ""
    }
  }

  // Hide cursor on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center rounded-full mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: cursorScaleSpring,
          rotate: cursorState.variant === "default" ? cursorRotateSpring : 0,
          width: getCursorSize(),
          height: getCursorSize(),
          backgroundColor: cursorState.color,
          opacity: isVisible ? 1 : 0,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {getCursorContent() && (
          <span className="text-[#161616] font-medium text-xs whitespace-nowrap">{getCursorContent()}</span>
        )}
      </motion.div>

      {/* Cursor trail effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99] rounded-full bg-[#FF5001]/20 mix-blend-difference"
        style={{
          x: trailX,
          y: trailY,
          width: 16,
          height: 16,
          opacity: isVisible ? 0.5 : 0,
        }}
        transition={{ duration: 0.5, delay: 0.05 }}
      />
    </>
  )
}
