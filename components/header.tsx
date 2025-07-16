"use client"

import type React from "react"

import { useState } from "react"
import { Menu } from "lucide-react"
import Image from "next/image"
import { MobileMenu } from "./mobile-menu"
import { EnhancedLink, EnhancedButton } from "./interactive-elements"
import { MagneticElement } from "./magnetic-element"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161616]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <MagneticElement
          as="a"
          href="/"
          className="flex items-center"
          strength={30}
          cursorType="link"
          cursorText="Home"
        >
          <Image
            src="/zoolyum-logo.png"
            alt="Zoolyum Logo"
            width={100}
            height={40}
            className="w-20 h-8 md:w-24 md:h-10 transition-all duration-300 hover:scale-105"
            priority
          />
        </MagneticElement>

        <nav className="hidden md:flex space-x-8">
          <NavLink href="/about" isActive={isActive("/about")}>
            About
          </NavLink>
          <NavLink href="/services" isActive={isActive("/services")}>
            Services
          </NavLink>
          <NavLink href="/portfolio" isActive={isActive("/portfolio")}>
            Portfolio
          </NavLink>

          <NavLink href="/contact" isActive={isActive("/contact")}>
            Contact
          </NavLink>

        </nav>

        <EnhancedButton
          className="md:hidden text-[#E9E7E2] p-2 rounded-md hover:bg-[#252525] transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          cursorText="Menu"
          effectType="burst"
        >
          <Menu className="h-6 w-6" />
        </EnhancedButton>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive: boolean
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <EnhancedLink
      href={href}
      className={`transition-colors duration-300 ${
        isActive ? "text-[#FF5001] font-medium" : "text-[#E9E7E2]/80 hover:text-[#FF5001]"
      }`}
      cursorText={children as string}
      effectType="pulse"
    >
      {children}
    </EnhancedLink>
  )
}
