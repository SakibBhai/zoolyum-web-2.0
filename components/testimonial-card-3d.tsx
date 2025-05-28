"use client"

import { motion } from "framer-motion"
import { Card3D } from "./card-3d"

interface TestimonialCardProps {
  quote: string
  author: string
  company: string
  delay?: number
}

export function TestimonialCard3D({ quote, author, company, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card3D depth={10} glareIntensity={0.1} cursorText="Testimonial">
        <div className="bg-[#212121] p-8 rounded-2xl border border-[#333333] h-full transform-gpu">
          <div className="text-[#FF5001] mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 11L8 17H5L7 11H5V5H11V11H10ZM18 11L16 17H13L15 11H13V5H19V11H18Z" fill="currentColor" />
            </svg>
          </div>
          <p className="text-lg mb-6">{quote}</p>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#333333] mr-4"></div>
            <div>
              <h4 className="font-bold">{author}</h4>
              <p className="text-sm text-[#E9E7E2]/70">{company}</p>
            </div>
          </div>
        </div>
      </Card3D>
    </motion.div>
  )
}
