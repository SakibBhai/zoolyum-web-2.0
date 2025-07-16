"use client"

import React from "react"
import { EnhancedCursor } from "@/components/enhanced-cursor"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnhancedCursor />
      {children}
    </>
  )
}
