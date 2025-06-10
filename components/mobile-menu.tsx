"use client"

import type React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import Link from "next/link"
import { EnhancedButton } from "./interactive-elements"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#161616]/95 backdrop-blur-md flex flex-col">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <EnhancedButton
          className="text-[#E9E7E2] p-2 rounded-md hover:bg-[#252525] transition-colors"
          onClick={onClose}
          cursorText="Close"
          effectType="burst"
        >
          <X className="h-6 w-6" />
        </EnhancedButton>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center">
        <ul className="space-y-6 text-center">
          <MobileMenuItem href="/" onClick={onClose}>
            Home
          </MobileMenuItem>
          <MobileMenuItem href="/about" onClick={onClose}>
            About
          </MobileMenuItem>
          <MobileMenuItem href="/services" onClick={onClose}>
            Services
          </MobileMenuItem>
          <MobileMenuItem href="/portfolio" onClick={onClose}>
            Portfolio
          </MobileMenuItem>
          <MobileMenuItem href="/team" onClick={onClose}>
            Team
          </MobileMenuItem>
          <MobileMenuItem href="/contact" onClick={onClose}>
            Contact
          </MobileMenuItem>
          <MobileMenuItem href="/admin/login" onClick={onClose}>
            Admin
          </MobileMenuItem>
        </ul>
      </nav>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="flex space-x-4 mb-6">
          <SocialIcon name="twitter" />
          <SocialIcon name="linkedin" />
          <SocialIcon name="instagram" />
          <SocialIcon name="behance" />
        </div>
        <p className="text-[#E9E7E2]/60 text-sm">© {new Date().getFullYear()} Zoolyum. All rights reserved.</p>
      </div>
    </div>
  )
}

interface MobileMenuItemProps {
  href: string
  onClick: () => void
  children: React.ReactNode
}

function MobileMenuItem({ href, onClick, children }: MobileMenuItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="text-2xl font-bold text-[#E9E7E2] hover:text-[#FF5001] transition-colors"
        data-cursor="link"
        data-cursor-text={children as string}
      >
        {children}
      </Link>
    </li>
  )
}

function SocialIcon({ name }: { name: string }) {
  return (
    <a
      href={`https://${name}.com`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors duration-300"
      data-cursor="link"
      data-cursor-text={name}
    >
      <span className="sr-only">{name}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}
