import { NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if about_page table has any records
    const count = await prisma.about_page.count()

    if (count === 0) {
      // Create initial about page record
      const initialData = {
        hero_eyebrow: "About Us",
        hero_title: "Strategic Brand Alchemy for Modern Businesses",
        hero_description: "Zoolyum is a full-service brand strategy agency dedicated to transforming businesses into powerful market forces through strategic thinking and creative excellence.",
        hero_image_url: "/placeholder.svg?height=600&width=1200",
        story_title: "From Vision to Reality",
        story_paragraph_1: "Founded in 2013 by Sakib Chowdhury, Zoolyum began with a simple yet powerful vision: to help brands unlock their full potential through strategic thinking and creative excellence.",
        story_paragraph_2: "What started as a one-person consultancy has grown into a diverse team of strategists, designers, and digital experts united by a passion for transforming brands. Over the years, we've evolved our approach and expanded our capabilities, but our core mission remains unchanged.",
        story_paragraph_3: "Today, Zoolyum works with ambitious businesses across industries, from emerging startups to established enterprises, helping them navigate complex market challenges and seize new opportunities for growth.",
        story_image_url: "/placeholder.svg?height=600&width=500",
        mission_title: "Our Mission",
        mission_content: "To transform brands through strategic thinking and creative excellence, creating meaningful connections between businesses and their audiences that drive sustainable growth.",
        values: [
          {
            number: "01",
            title: "Strategic Excellence",
            description: "We believe in the power of strategic thinking to solve complex brand challenges and create meaningful impact."
          },
          {
            number: "02",
            title: "Creative Courage",
            description: "We embrace bold ideas and innovative approaches that help brands stand out in crowded markets."
          },
          {
            number: "03",
            title: "Collaborative Partnership",
            description: "We work as an extension of our clients' teams, fostering open communication and shared success."
          },
          {
            number: "04",
            title: "Measurable Impact",
            description: "We focus on creating work that delivers tangible results and drives business growth."
          }
        ],
        team_eyebrow: "Our Team",
        team_title: "Meet the Strategists & Creatives",
        team_description: "Our diverse team of experts brings together strategic thinking and creative excellence to deliver exceptional results for our clients.",
        cta_eyebrow: "Work With Us",
        cta_title: "Ready to Transform Your Brand?",
        cta_description: "Let's collaborate to create a strategic brand experience that resonates with your audience and drives meaningful results for your business.",
        cta_primary_text: "Start Your Project",
        cta_primary_url: "/contact",
        cta_secondary_text: "Explore Our Services",
        cta_secondary_url: "/services",
        is_active: true
      }

      await prisma.about_page.create({
        data: initialData
      })

      return NextResponse.json({
        success: true,
        message: 'Database initialized with default About page content'
      })
    }

    return NextResponse.json({
      success: true,
      message: `Database already has ${count} about page record(s)`
    })

  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      {
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
