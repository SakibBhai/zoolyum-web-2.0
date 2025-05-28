"use client"

import { useEffect } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.documentElement.classList.add("has-scrolled")
      } else {
        document.documentElement.classList.remove("has-scrolled")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smaller indicator on mobile
  const indicatorSize = isMobile ? { width: "5px", height: "8px" } : { width: "6px", height: "10px" }
  const containerSize = isMobile ? { width: "5rem", height: "8rem" } : { width: "6rem", height: "10rem" }

  return (
    <motion.div
      className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-40 pointer-events-none"
      style={{ y, opacity }}
    >
      <div className="text-[#FF5001] mb-2 text-xs md:text-sm">Scroll</div>
      <motion.div
        className="border-2 border-[#FF5001] rounded-full flex justify-center"
        style={{
          width: isMobile ? "1.25rem" : "1.5rem",
          height: isMobile ? "2.25rem" : "2.5rem",
        }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
      >
        <motion.div
          className="bg-[#FF5001] rounded-full mt-1.5"
          style={{
            width: isMobile ? "0.3rem" : "0.375rem",
            height: isMobile ? "0.6rem" : "0.75rem",
          }}
          animate={{ y: [0, isMobile ? 8 : 12, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 origin-left z-50"
      style={{
        scaleX,
        height: isMobile ? "2px" : "3px",
        backgroundColor: "#FF5001",
      }}
    />
  )
}
