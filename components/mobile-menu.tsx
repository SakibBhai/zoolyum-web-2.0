"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  
  const isActive = (path: string) => pathname === path

  // Handle swipe to close
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onClose()
    }
  }

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

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/team', label: 'Team' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/contact', label: 'Contact' },
  ]

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
    { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
  ]

  const contactInfo = [
    { icon: Phone, text: '+880 1234 567890', href: 'tel:+8801234567890' },
    { icon: Mail, text: 'hello@zoolyum.com', href: 'mailto:hello@zoolyum.com' },
    { icon: MapPin, text: 'Dhaka, Bangladesh', href: '#' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-[#161616]/98 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu Content */}
          <motion.div 
            ref={menuRef}
            className="relative h-full flex flex-col overflow-y-auto bg-[#161616] border-l border-[#333333]/50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
          >
            {/* Header with close button */}
            <div className="flex justify-end p-4 sm:p-6">
              <motion.button
                onClick={onClose}
                className="p-2 text-[#E9E7E2] rounded-lg hover:bg-[#252525]/50 transition-colors touch-manipulation"
                whileTap={{ scale: 0.95 }}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 sm:px-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, staggerChildren: 0.05 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between w-full p-5 rounded-xl transition-all duration-200 touch-manipulation min-h-[60px] active:scale-[0.98] ${
                        isActive(item.href) 
                          ? 'bg-[#FF5001]/10 text-[#FF5001] border border-[#FF5001]/20 shadow-lg shadow-[#FF5001]/5' 
                          : 'text-[#E9E7E2] hover:bg-[#252525]/50 hover:text-[#FF5001] active:bg-[#252525]/70'
                      }`}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <span className="text-lg sm:text-xl font-medium">{item.label}</span>
                      <motion.div
                        animate={{
                          x: isActive(item.href) ? 4 : 0,
                          scale: isActive(item.href) ? 1.1 : 1
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                className="mt-8 pt-8 border-t border-[#333333]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-medium text-[#E9E7E2]/60 uppercase tracking-wider mb-4">
                  Get in Touch
                </h3>
                <div className="space-y-3">
                  {contactInfo.map((contact, index) => {
                    const Icon = contact.icon
                    return (
                      <motion.a
                        key={index}
                        href={contact.href}
                        className="flex items-center space-x-3 p-3 rounded-lg text-[#E9E7E2]/80 hover:text-[#FF5001] hover:bg-[#252525]/30 transition-all duration-200 touch-manipulation min-h-[48px] active:scale-[0.98]"
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ x: 2 }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{contact.text}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>
            </nav>

            {/* Footer */}
            <motion.footer 
              className="p-4 sm:p-6 border-t border-[#333333]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Social Links */}
              <div className="flex justify-center space-x-6 mb-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="p-3 rounded-full text-[#E9E7E2]/60 hover:text-[#FF5001] hover:bg-[#252525]/30 transition-all duration-200 touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-90"
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    aria-label={social.name}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>
              
              {/* Copyright */}
              <p className="text-center text-xs text-[#E9E7E2]/40">
                © 2024 Zoolyum. All rights reserved.
              </p>
            </motion.footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
