"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/zoolyum',
      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@Zoolyum',
      icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/zoolyum/',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    },
    {
      name: 'X',
      href: 'https://x.com/',
      icon: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
    }
  ]

  const contactInfo = [
    { icon: Phone, text: '01601000950', href: 'tel:+8801601000950' },
    { icon: Mail, text: 'contact@zoolyum.com', href: 'mailto:contact@zoolyum.com' },
    { icon: MapPin, text: 'Mirpur 11, Dhaka', href: '/contact' }
  ]

  const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Our Team' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact Us' }
  ]

  const serviceLinks = [
    { href: '/services', label: 'Brand Strategy' },
    { href: '/services', label: 'Digital Transformation' },
    { href: '/services', label: 'Creative Direction' },
    { href: '/services', label: 'Visual Identity' }
  ]

  const connectLinks = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/blog', label: 'Blog' },
    { href: '/resources', label: 'Resources' },
    { href: '/newsletter', label: 'Newsletter' }
  ]

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/sitemap', label: 'Sitemap' }
  ]

  return (
    <footer className="bg-[#1A1A1A] border-t border-[#333333] text-[#E9E7E2] py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="text-[#FF5001] font-bold text-2xl sm:text-3xl hover:text-[#FF5001]/90 transition-colors touch-manipulation"
              >
                Zoolyum
              </Link>
              <p className="text-[#E9E7E2]/60 text-sm sm:text-base leading-relaxed mt-2 mb-6">
                Brand Strategy & Digital Innovation
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon
                  return (
                    <motion.a
                      key={`contact-${index}`}
                      href={contact.href}
                      className="group flex items-center space-x-3 text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors duration-200 touch-manipulation"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="text-[#FF5001] w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm sm:text-base">{contact.text}</span>
                    </motion.a>
                  )
                })}
              </div>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-3 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#FF5001] transition-all duration-300 touch-manipulation"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Company Links */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-bold text-lg sm:text-xl mb-4">Company</h3>
            <nav className="space-y-3">
              {companyLinks.map((link, index) => (
                <FooterLink key={link.href} href={link.href} delay={index * 0.05}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </motion.div>

          {/* Services Links */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-bold text-lg sm:text-xl mb-4">Services</h3>
            <nav className="space-y-3">
              {serviceLinks.map((link, index) => (
                <FooterLink key={`${link.href}-${index}`} href={link.href} delay={index * 0.05}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </motion.div>

          {/* Connect Links */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-bold text-lg sm:text-xl mb-4">Connect</h3>
            <nav className="space-y-3">
              {connectLinks.map((link, index) => (
                <FooterLink key={link.href} href={link.href} delay={index * 0.05}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#333333]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl sm:text-2xl font-semibold mb-4">
              Stay Updated
            </h4>
            <p className="text-[#E9E7E2]/60 text-sm sm:text-base mb-6">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#252525] border border-[#333333] rounded-lg text-[#E9E7E2] placeholder-[#E9E7E2]/50 focus:outline-none focus:border-[#FF5001] transition-colors touch-manipulation"
              />
              <motion.button
                className="px-6 py-3 bg-[#FF5001] text-white rounded-lg font-medium hover:bg-[#FF5001]/90 transition-colors flex items-center justify-center space-x-2 touch-manipulation"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Subscribe</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 sm:mt-16 pt-8 border-t border-[#333333]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-[#E9E7E2]/60 text-sm">
              <span>© {currentYear} Zoolyum. Made with</span>
              <Heart className="w-4 h-4 text-[#FF5001] fill-current" />
              <span>in Bangladesh</span>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={`${link.href}-${index}`}
                  href={link.href}
                  className="text-[#E9E7E2]/60 hover:text-[#FF5001] transition-colors text-sm touch-manipulation"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
  delay?: number
}

function FooterLink({ href, children, delay = 0 }: FooterLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        href={href}
        className="group flex items-center space-x-2 text-[#E9E7E2]/60 hover:text-[#FF5001] transition-all duration-200 text-sm sm:text-base touch-manipulation"
      >
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          {children}
        </span>
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200" />
      </Link>
    </motion.div>
  )
}
