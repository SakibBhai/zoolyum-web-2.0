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
                <a href="mailto:hello@zoolyum.com" className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm">
                  hello@zoolyum.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="text-[#FF5001] mr-3 w-4 h-4" />
                <a href="tel:+15551234567" className="text-[#E9E7E2]/60 hover:text-[#FF5001] text-sm">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="text-[#FF5001] mr-3 w-4 h-4" />
                <span className="text-[#E9E7E2]/60 text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <div className="flex flex-col space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/team">Our Team</FooterLink>
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
                href="#"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="Twitter"
              >
                <span className="sr-only">Twitter</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-colors"
                data-cursor="link"
                data-cursor-text="Behance"
              >
                <span className="sr-only">Behance</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                    fill="currentColor"
                  />
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
