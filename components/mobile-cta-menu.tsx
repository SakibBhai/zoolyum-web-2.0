"use client"

import React, { useEffect, useState } from "react"
import { X, ArrowRight, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { EnhancedButton } from "./interactive-elements"

interface MobileCTAMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileCTAMenu({ isOpen, onClose }: MobileCTAMenuProps) {
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

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex"
          onClick={onClose}
        >
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-[#161616]/80 backdrop-blur-md" />
          
          {/* Phone Mock Container */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex-1 flex items-center justify-center p-4"
          >
            {/* Phone Mock Frame - Responsive sizing */}
            <div className="w-full max-w-[320px] mx-auto relative max-[480px]:w-[92%]">
              <div className="bg-[#1A1A1A] rounded-[2.5rem] p-6 border-4 border-[#333] shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#FF5001] rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-8 h-8 text-[#161616]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#E9E7E2]">
                    Get in Touch
                  </h3>
                  <p className="text-sm text-[#E9E7E2]/70">
                    Choose how you'd like to connect with us
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Options Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }}
            className="w-80 bg-[#1A1A1A] border-l border-[#333] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-6 border-b border-[#333]">
              <h2 className="text-lg font-bold text-[#E9E7E2] text-right flex-1">
                Contact Options
              </h2>
              <EnhancedButton
                className="text-[#E9E7E2] p-2 rounded-md hover:bg-[#252525] transition-colors ml-4"
                onClick={onClose}
                cursorText="Close"
                effectType="burst"
              >
                <X className="h-5 w-5" />
              </EnhancedButton>
            </div>

            {/* Menu Options */}
            <div className="flex-1 p-6 space-y-4">
              <div className="space-y-3">
                {/* Start Your Project Option */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="w-full bg-[#FF5001] text-[#161616] font-bold rounded-xl p-4 flex items-center justify-between group hover:bg-[#FF5001]/90 transition-all duration-300"
                    data-cursor="button"
                    data-cursor-text="Contact"
                  >
                    <div className="text-right flex-1">
                      <div className="font-bold">Start Your Project</div>
                      <div className="text-sm opacity-80">Get a custom quote</div>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Schedule Consultation Option */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Link
                    href="/contact#schedule"
                    onClick={onClose}
                    className="w-full border border-[#FF5001] text-[#FF5001] font-bold rounded-xl p-4 flex items-center justify-between group hover:bg-[#FF5001]/10 transition-all duration-300"
                    data-cursor="button"
                    data-cursor-text="Schedule"
                  >
                    <div className="text-right flex-1">
                      <div className="font-bold">Schedule Consultation</div>
                      <div className="text-sm opacity-80">Book a free call</div>
                    </div>
                    <Calendar className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Additional Options */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="pt-4 border-t border-[#333]"
                >
                  <div className="space-y-2">
                    <Link
                      href="/portfolio"
                      onClick={onClose}
                      className="w-full text-[#E9E7E2] font-medium rounded-lg p-3 flex items-center justify-between group hover:bg-[#252525] transition-all duration-300"
                      data-cursor="link"
                      data-cursor-text="Portfolio"
                    >
                      <span className="text-right flex-1">View Our Work</span>
                      <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/services"
                      onClick={onClose}
                      className="w-full text-[#E9E7E2] font-medium rounded-lg p-3 flex items-center justify-between group hover:bg-[#252525] transition-all duration-300"
                      data-cursor="link"
                      data-cursor-text="Services"
                    >
                      <span className="text-right flex-1">Our Services</span>
                      <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/about"
                      onClick={onClose}
                      className="w-full text-[#E9E7E2] font-medium rounded-lg p-3 flex items-center justify-between group hover:bg-[#252525] transition-all duration-300"
                      data-cursor="link"
                      data-cursor-text="About"
                    >
                      <span className="text-right flex-1">About Us</span>
                      <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#333] text-right">
              <p className="text-[#E9E7E2]/60 text-sm">
                Ready to transform your brand?
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mobile CTA Trigger Button Component
interface MobileCTATriggerProps {
  onOpen: () => void
}

export function MobileCTATrigger({ onOpen }: MobileCTATriggerProps) {
  return (
    <button
      onClick={onOpen}
      className="w-full px-6 py-4 bg-[#FF5001] text-[#161616] font-bold rounded-full hover:bg-[#FF5001]/90 transition-all duration-300 flex items-center justify-center group"
      data-cursor="button"
      data-cursor-text="Contact Options"
    >
      Get Started
      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  )
}