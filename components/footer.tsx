import type React from "react"
import { EnhancedLink, MagneticElement } from "./interactive-elements"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#333333]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <MagneticElement
              as="a"
              href="/"
              className="text-[#FF5001] font-bold text-2xl"
              strength={30}
              cursorType="link"
              cursorText="Home"
            >
              Zoolyum
            </MagneticElement>
            <p className="text-[#E9E7E2]/60 mt-2 mb-4">Brand Strategy & Digital Innovation</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="text-[#FF5001] mr-3 w-4 h-4" />
                <a href="mailto:contact@zoolyum.com" className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm">
                  contact@zoolyum.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="text-[#FF5001] mr-3 w-4 h-4" />
                <a href="tel:+8801601000950" className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm">
                  01601000950
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="text-[#FF5001] mr-3 w-4 h-4" />
                <span className="text-[#E9E7E2]/60 text-sm">Mirpur 11, Dhaka</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <div className="flex flex-col space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/team">Our Team</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <div className="flex flex-col space-y-2">
              <FooterLink href="/services">Brand Strategy</FooterLink>
              <FooterLink href="/services">Digital Transformation</FooterLink>
              <FooterLink href="/services">Creative Direction</FooterLink>
              <FooterLink href="/services">Visual Identity</FooterLink>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex flex-col space-y-2">
              <FooterLink href="/portfolio">Portfolio</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/resources">Resources</FooterLink>
              <FooterLink href="/newsletter">Newsletter</FooterLink>
            </div>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/zoolyum"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="Facebook"
              >
                <span className="sr-only">Facebook</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Zoolyum"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="YouTube"
              >
                <span className="sr-only">YouTube</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/zoolyum/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="X"
              >
                <span className="sr-only">X (Twitter)</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#E9E7E2]/60 text-sm">© {new Date().getFullYear()} Zoolyum. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm"
              data-cursor="link"
              data-cursor-text="Privacy"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm"
              data-cursor="link"
              data-cursor-text="Terms"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm"
              data-cursor="link"
              data-cursor-text="Sitemap"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <EnhancedLink
      href={href}
      className="text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors duration-300 text-sm"
      cursorText={children as string}
      effectType="pulse"
    >
      {children}
    </EnhancedLink>
  )
}
