"use client"

import { useEffect } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#FF5001] origin-left z-50" style={{ scaleX }} />
}

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

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

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-40 pointer-events-none"
      style={{ y, opacity }}
    >
      <div className="text-[#FF5001] mb-2">Scroll</div>
      <motion.div
        className="w-6 h-10 border-2 border-[#FF5001] rounded-full flex justify-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
      >
        <motion.div
          className="w-1.5 h-3 bg-[#FF5001] rounded-full mt-2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
