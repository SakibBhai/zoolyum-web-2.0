"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
  cursorText?: string
}

export function AnimatedLink({ href, children, className = "", cursorText = "" }: AnimatedLinkProps) {
  return (
    <Link href={href} className={className} data-cursor-text={cursorText}>
      <motion.span
        className="inline-block relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
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

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
  cursorText?: string
  disabled?: boolean
}

export function AnimatedButton({
  children,
  onClick,
  className = "",
  type = "button",
  cursorText = "",
  disabled = false,
}: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      data-cursor-text={cursorText}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
