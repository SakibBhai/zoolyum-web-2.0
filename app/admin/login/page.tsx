"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, Lock, AlertCircle } from "@/components/icons"

export default function AdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDevelopment, setIsDevelopment] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    setIsClient(true)
    // Check if we're in development mode
    setIsDevelopment(process.env.NODE_ENV === "development")

    // Check for errors in URL
    const errorParam = searchParams.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "AccessDenied":
          setError("You don't have admin access. Please contact the administrator.")
          break
        case "Configuration":
          setError("Authentication configuration error. Please try again later.")
          break
        default:
          setError("An error occurred during authentication.")
      }
    }
  }, [searchParams])

  // Auto-redirect in development mode
  useEffect(() => {
    if (!isClient || !isDevelopment) return

    const timer = setTimeout(() => {
      router.push("/admin/dashboard")
    }, 2000)

    return () => clearTimeout(timer)
  }, [isClient, isDevelopment, router])

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
      } else if (result?.ok) {
        // Success - redirect manually
        router.push("/admin/dashboard")
      }
    } catch (err) {
      setError("An error occurred during login")
      setIsLoading(false)
    }
  }

  const handleDevLogin = () => {
    router.push("/admin/dashboard")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF5001] animate-spin" />
      </div>
    )
  }

  // Development mode - auto redirect
  if (isDevelopment) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1A1A1A] border-[#333333]">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Shield className="w-16 h-16 text-[#FF5001]" />
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold text-[#E9E7E2]">
                Development Mode
              </CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Bypassing authentication... Redirecting to dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-[#FF5001] animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#E9E7E2]/60 mb-4">Auto-redirecting in 2 seconds...</p>
              <Button
                onClick={handleDevLogin}
                className="bg-[#FF5001] hover:bg-[#FF5001]/90 text-white"
              >
                Go to Dashboard Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Production mode - show login form
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5001]/5 to-transparent pointer-events-none" />

      <Card className="w-full max-w-md bg-[#1A1A1A] border-[#333333] relative z-10">
        <CardHeader className="space-y-4 pb-6">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF5001]/10 flex items-center justify-center border border-[#FF5001]/20">
              <Shield className="w-8 h-8 text-[#FF5001]" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-[#E9E7E2]">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-[#E9E7E2]/70">
              Secure access to Zoolyum Web management
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#E9E7E2]/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zoolyum.com"
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333333] rounded-lg text-[#E9E7E2] placeholder:text-[#E9E7E2]/40 focus:outline-none focus:border-[#FF5001] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#E9E7E2]/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333333] rounded-lg text-[#E9E7E2] placeholder:text-[#E9E7E2]/40 focus:outline-none focus:border-[#FF5001] transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF5001] hover:bg-[#FF5001]/90 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* OAuth Providers (if configured) */}
          {(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#333333]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1A1A1A] text-[#E9E7E2]/60">Or continue with</span>
              </div>
            </div>
          )}

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <Button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
              variant="outline"
              className="w-full border-[#333333] hover:bg-[#0A0A0A] text-[#E9E7E2]"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          )}

          {process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID && (
            <Button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/admin/dashboard" })}
              variant="outline"
              className="w-full border-[#333333] hover:bg-[#0A0A0A] text-[#E9E7E2]"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          )}

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={handleBackToHome}
              className="text-sm text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 rounded-lg bg-green-500/5 border border-green-500/10">
            <p className="text-xs text-green-400/90 leading-relaxed">
              <strong className="text-green-400">Secure Login:</strong> Your session is protected with HTTP-only cookies.
              Admin access is restricted to authorized users only.
            </p>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#333333]">
          <p className="text-xs text-center text-[#E9E7E2]/50">
            Protected by NextAuth • {new Date().getFullYear()} Zoolyum
          </p>
        </div>
      </Card>
    </div>
  )
}
