"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { EnhancedCursor } from "@/components/enhanced-cursor"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <EnhancedCursor />
      {children}
    </SessionProvider>
  )
}
