import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zoolyum.com' },
    update: {},
    create: {
      email: 'admin@zoolyum.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample services
  const services = [
    {
      title: 'Brand Strategy',
      slug: 'brand-strategy',
      description: 'Comprehensive brand strategy development to establish your unique market position.',
      content: 'Our brand strategy service helps you define your brand identity, positioning, and messaging. We work with you to create a cohesive brand experience that resonates with your target audience and differentiates you from competitors.',
      imageUrl: '/placeholder.jpg',
      icon: 'target',
      featured: true,
      order: 1,
    },
    {
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'Data-driven digital marketing campaigns that drive growth and engagement.',
      content: 'Our digital marketing services include SEO, PPC, social media marketing, content marketing, and email campaigns. We use advanced analytics to optimize your campaigns and maximize ROI.',
      imageUrl: '/placeholder.jpg',
      icon: 'trending-up',
      featured: true,
      order: 2,
    },
    {
      title: 'Web Development',
      slug: 'web-development',
      description: 'Custom web development solutions built with modern technologies.',
      content: 'We create responsive, fast, and secure websites using the latest technologies. From simple landing pages to complex web applications, we deliver solutions that meet your business needs.',
      imageUrl: '/placeholder.jpg',
      icon: 'code',
      featured: false,
      order: 3,
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'User-centered design that creates exceptional digital experiences.',
      content: 'Our UI/UX design process focuses on understanding your users and creating intuitive, engaging interfaces. We conduct user research, create wireframes and prototypes, and design beautiful user interfaces.',
      imageUrl: '/placeholder.jpg',
      icon: 'palette',
      featured: true,
      order: 4,
    },
    {
      title: 'Content Creation',
      slug: 'content-creation',
      description: 'Engaging content that tells your story and connects with your audience.',
      content: 'From blog posts and social media content to video production and photography, we create compelling content that engages your audience and supports your marketing goals.',
      imageUrl: '/placeholder.jpg',
      icon: 'edit',
      featured: false,
      order: 5,
    },
    {
      title: 'SEO Optimization',
      slug: 'seo-optimization',
      description: 'Search engine optimization to improve your online visibility.',
      content: 'Our SEO services help improve your website\'s search engine rankings through keyword research, on-page optimization, technical SEO, and link building strategies.',
      imageUrl: '/placeholder.jpg',
      icon: 'search',
      featured: false,
      order: 6,
    },
    {
      title: 'Social Media Management',
      slug: 'social-media-management',
      description: 'Strategic social media management to build your online community.',
      content: 'We manage your social media presence across all platforms, creating engaging content, managing communities, and running targeted advertising campaigns to grow your following.',
      imageUrl: '/placeholder.jpg',
      icon: 'share-2',
      featured: false,
      order: 7,
    },
    {
      title: 'E-commerce Solutions',
      slug: 'e-commerce-solutions',
      description: 'Complete e-commerce platforms to sell your products online.',
      content: 'We build custom e-commerce solutions that provide seamless shopping experiences. From product catalogs to payment processing and inventory management, we handle it all.',
      imageUrl: '/placeholder.jpg',
      icon: 'shopping-cart',
      featured: true,
      order: 8,
    },
    {
      title: 'Analytics & Reporting',
      slug: 'analytics-reporting',
      description: 'Data analytics and reporting to measure and optimize performance.',
      content: 'We set up comprehensive analytics tracking and provide detailed reports on your marketing performance, website traffic, and business metrics to help you make data-driven decisions.',
      imageUrl: '/placeholder.jpg',
      icon: 'bar-chart',
      featured: false,
      order: 9,
    },
  ]

  for (const service of services) {
    const createdService = await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
    console.log(`✅ Service created: ${createdService.title}`)
  }
  // Create default contact settings
  const contactSettings = await prisma.contactSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      email: 'contact@zoolyum.com',
      phone: '+880 1601 000 950',
      address: '123 Business Ave\nSuite 100\nNew York, NY 10001',
      workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
      twitterUrl: 'https://twitter.com/zoolyum',
      linkedinUrl: 'https://linkedin.com/company/zoolyum',
      instagramUrl: 'https://instagram.com/zoolyum',
      behanceUrl: 'https://behance.net/zoolyum',
      enablePhoneField: true,
      requirePhoneField: false,
      autoReplyEnabled: true,
      autoReplyMessage: 'Thank you for contacting us! We will get back to you within 24 hours.',
      notificationEmail: 'admin@zoolyum.com',
      emailNotifications: true,
    },
  })

  console.log('✅ Contact settings created:', contactSettings.id)
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })