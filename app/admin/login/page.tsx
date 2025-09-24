"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useConditionalUser } from "@/hooks/use-conditional-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const user = useConditionalUser()
  const router = useRouter()
  const [isDevelopment, setIsDevelopment] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const hostname = window.location.hostname
    const port = window.location.port
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || port === '3000' || port === '3001' || port === '3002'
    setIsDevelopment(isDev)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    if (user) {
      router.push("/admin/dashboard")
      return
    }

    // In development, redirect directly to dashboard (mock auth)
    if (isDevelopment) {
      console.log('Development mode: Redirecting to admin dashboard')
      router.push("/admin/dashboard")
    } else {
      // In production, redirect to Stack Auth sign-in page
      router.push("/handler/sign-in")
    }
  }, [user, router, isDevelopment, isClient])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A1A1A] border-[#333333]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#E9E7E2]">
            Redirecting to Login
          </CardTitle>
          <CardDescription className="text-center text-[#E9E7E2]/70">
            Please wait while we redirect you to the login page...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
