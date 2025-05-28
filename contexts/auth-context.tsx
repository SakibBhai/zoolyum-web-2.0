"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getBrowserClient } from "@/lib/supabase"

type AdminUser = {
  id: string
  email: string
  name: string
  role: string
}

type AuthContextType = {
  user: User | null
  adminUser: AdminUser | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = getBrowserClient()

  // Fetch admin user data
  const fetchAdminUser = async (userId: string) => {
    try {
      // Changed from .single() to get() and then check if data exists
      const { data, error } = await supabase.from("admin_users").select("*").eq("id", userId).maybeSingle() // Use maybeSingle() instead of single()

      if (error) {
        console.error("Error fetching admin user:", error)
        setAdminUser(null)
        setIsAdmin(false)
        return
      }

      if (data) {
        setAdminUser(data as AdminUser)
        setIsAdmin(true)
      } else {
        setAdminUser(null)
        setIsAdmin(false)
      }
    } catch (err) {
      console.error("Error fetching admin user:", err)
      setAdminUser(null)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    // Get session from storage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        fetchAdminUser(session.user.id)
      } else {
        setAdminUser(null)
        setIsAdmin(false)
      }

      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        fetchAdminUser(session.user.id)
      } else {
        setAdminUser(null)
        setIsAdmin(false)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    adminUser,
    session,
    isLoading,
    isAdmin,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
