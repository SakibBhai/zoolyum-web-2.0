"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConditionalUser } from "@/hooks/use-conditional-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const user = useConditionalUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user, router])

  useEffect(() => {
    // Redirect to Stack Auth sign-in page
    router.push("/handler/sign-in")
  }, [router])

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
