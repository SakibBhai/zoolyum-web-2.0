import type React from "react"
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

export const metadata = {
  title: "Zoolyum | Brand Strategy & Digital Innovation Agency",
  description:
    "Transforming brands through strategic thinking and creative excellence. We create digital experiences that resonate and inspire action.",
    generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}><StackProvider app={stackServerApp}><StackTheme>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </ThemeProvider>
      </StackTheme></StackProvider></body>
    </html>
  )
}
