const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSakibBhaiCampaign() {
  try {
    // Check if campaign already exists
    const existing = await prisma.campaign.findUnique({
      where: { slug: 'sakib-bhai' }
    });
    
    if (existing) {
      console.log('Campaign with slug "sakib-bhai" already exists:', existing.title);
      return;
    }
    
    // Create the campaign with slug 'sakib-bhai'
    const campaign = await prisma.campaign.create({
      data: {
        title: 'Sakib Bhai Campaign',
        slug: 'sakib-bhai',
        shortDescription: 'A comprehensive campaign showcasing Sakib Bhai\'s expertise and services.',
        description: 'Join Sakib Bhai\'s exclusive campaign designed to help you achieve your goals with proven strategies and personalized guidance.',
        content: '<h2>Welcome to Sakib Bhai\'s Campaign</h2><p>This campaign is designed to provide you with the best strategies and insights from Sakib Bhai. Whether you\'re looking to grow your business, improve your skills, or achieve personal goals, this campaign has everything you need.</p><h3>What You\'ll Get:</h3><ul><li>Expert guidance and mentorship</li><li>Proven strategies that work</li><li>Personalized support</li><li>Access to exclusive resources</li><li>Community of like-minded individuals</li></ul><p>Don\'t miss this opportunity to transform your journey with Sakib Bhai\'s proven methods.</p>',
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
            id: 'phone',
            name: 'phone',
            label: 'Phone Number',
            type: 'phone',
            required: false,
            placeholder: 'Enter your phone number'
          },
          {
            id: 'interest',
            name: 'interest',
            label: 'Area of Interest',
            type: 'select',
            required: true,
            options: ['Business Growth', 'Personal Development', 'Marketing Strategy', 'Leadership', 'Other']
          },
          {
            id: 'message',
            name: 'message',
            label: 'Tell us about your goals',
            type: 'textarea',
            required: false,
            placeholder: 'Share your goals and how Sakib Bhai can help you achieve them'
          }
        ],
        ctas: [
          {
            label: 'Join Now',
            url: '/contact'
          },
          {
            label: 'Learn More',
            url: '/about'
          },
          {
            label: 'View Services',
            url: '/services'
          }
        ],
        successMessage: 'Thank you for joining Sakib Bhai\'s campaign! We will contact you soon with next steps.',
        redirectUrl: null
      }
    });
    
    console.log('Campaign with slug "sakib-bhai" created successfully:', campaign.title);
    console.log('You can now access it at: http://localhost:3000/campaigns/sakib-bhai');
  } catch (error) {
    console.error('Error creating campaign:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSakibBhaiCampaign();