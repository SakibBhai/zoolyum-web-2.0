const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCampaignD() {
  try {
    // Check if campaign already exists
    const existing = await prisma.campaign.findUnique({
      where: { slug: 'd' }
    });
    
    if (existing) {
      console.log('Campaign with slug "d" already exists:', existing.title);
      return;
    }
    
    // Create the campaign with slug 'd'
    const campaign = await prisma.campaign.create({
      data: {
        title: 'Demo Campaign',
        slug: 'd',
        shortDescription: 'A simple demo campaign for testing purposes.',
        description: 'This is a test campaign created to demonstrate the campaign functionality.',
        content: '<h2>Welcome to our Demo Campaign</h2><p>This is a sample campaign page that showcases our campaign features. You can customize this content to match your needs.</p><p>Features include:</p><ul><li>Responsive design</li><li>Contact forms</li><li>Media galleries</li><li>Call-to-action buttons</li></ul>',
        status: 'PUBLISHED',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        imageUrls: ['/placeholder.svg'],
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
            id: 'message',
            name: 'message',
            label: 'Message',
            type: 'textarea',
            required: false,
            placeholder: 'Tell us about your interest'
          }
        ],
        ctas: [
          {
            label: 'Get Started',
            url: '/contact'
          },
          {
            label: 'Learn More',
            url: '/about'
          }
        ],
        successMessage: 'Thank you for your interest! We will get back to you soon.',
        redirectUrl: null
      }
    });
    
    console.log('Campaign with slug "d" created successfully:', campaign.title);
    console.log('You can now access it at: http://localhost:3000/campaigns/d');
  } catch (error) {
    console.error('Error creating campaign:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCampaignD();