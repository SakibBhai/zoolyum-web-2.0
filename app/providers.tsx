"use client"

import type { ReactNode } from "react"
import { EnhancedCursor } from "@/components/enhanced-cursor"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <EnhancedCursor />
      {children}
    </>
  )
}
