const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestCampaign() {
  try {
    // Check if campaign already exists
    const existing = await prisma.campaign.findUnique({
      where: { slug: 'zoolyum-digital-marketing-2024' }
    });
    
    if (existing) {
      console.log('Campaign already exists:', existing.title);
      return;
    }
    
    // Create the campaign
    const campaign = await prisma.campaign.create({
      data: {
        title: 'Zoolyum Digital Marketing 2024',
        slug: 'zoolyum-digital-marketing-2024',
        shortDescription: 'Transform your business with our comprehensive digital marketing solutions for 2024.',
        description: 'Join our exclusive digital marketing campaign designed to boost your online presence and drive results.',
        content: 'Our 2024 digital marketing campaign offers cutting-edge strategies, personalized solutions, and measurable results to help your business thrive in the digital landscape.',
        status: 'PUBLISHED',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        imageUrls: ['/placeholder.jpg'],
        videoUrls: [],
        enableForm: true,
        formFields: [
          {
            id: 'name',
            name: 'name',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'email',
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'Enter your email address'
          },
          {
            id: 'company',
            name: 'company',
            label: 'Company Name',
            type: 'text',
            required: false,
            placeholder: 'Enter your company name'
          }
        ],
        ctas: [
          {
            label: 'Get Started Today',
            url: '/contact'
          },
          {
            label: 'Learn More',
            url: '/services'
          }
        ],
        successMessage: 'Thank you for your interest! We will contact you soon.',
        redirectUrl: null
      }
    });
    
    console.log('Campaign created successfully:', campaign.title);
  } catch (error) {
    console.error('Error creating campaign:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestCampaign();