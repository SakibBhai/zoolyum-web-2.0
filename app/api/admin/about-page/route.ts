import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch about page content
export async function GET(request: NextRequest) {
  try {
    // Get the active about page content
    const aboutPage = await prisma.about_page.findFirst({
      where: {
        is_active: true
      },
      orderBy: {
        updated_at: 'desc'
      }
    })

    if (!aboutPage) {
      // Return default content if none exists
      return NextResponse.json({
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
        mission_content: "To transform brands through strategic thinking and creative excellence, creating meaningful connections between businesses and their audiences that drive sustainable growth.\n\nWe believe that exceptional brands are built on strategic foundations and brought to life through compelling storytelling and innovative design. Our mission is to help businesses harness the power of strategic brand development to achieve their goals and make a lasting impact in their markets.",
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
      })
    }

    return NextResponse.json(aboutPage)

  } catch (error) {
    console.error('Error fetching about page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about page content' },
      { status: 500 }
    )
  }
}

// POST - Create about page content
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Deactivate all existing about pages
    await prisma.about_page.updateMany({
      where: { is_active: true },
      data: { is_active: false }
    })

    // Create new about page
    const aboutPage = await prisma.about_page.create({
      data: {
        ...data,
        is_active: true
      }
    })

    // Revalidate the about page cache
    const { revalidateTag } = await import('next/cache')
    revalidateTag('about-page', 'default')

    return NextResponse.json({
      message: 'About page created successfully',
      aboutPage
    })

  } catch (error) {
    console.error('Error creating about page:', error)
    return NextResponse.json(
      { error: 'Failed to create about page content' },
      { status: 500 }
    )
  }
}

// PUT - Update about page content
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'About page ID is required' },
        { status: 400 }
      )
    }

    // Update about page
    const aboutPage = await prisma.about_page.update({
      where: { id },
      data: updateData
    })

    // Revalidate the about page cache
    const { revalidateTag } = await import('next/cache')
    revalidateTag('about-page', 'default')

    return NextResponse.json({
      message: 'About page updated successfully',
      aboutPage
    })

  } catch (error) {
    console.error('Error updating about page:', error)
    return NextResponse.json(
      { error: 'Failed to update about page content' },
      { status: 500 }
    )
  }
}
