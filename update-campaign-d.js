const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCampaignD() {
  try {
    console.log('Updating campaign with slug "d" to PUBLISHED status...');
    
    const updatedCampaign = await prisma.campaign.update({
      where: { slug: 'd' },
      data: {
        status: 'PUBLISHED',
        title: 'Demo Campaign',
        shortDescription: 'A simple demo campaign for testing purposes.',
        content: '<h2>Welcome to our Demo Campaign</h2><p>This is a sample campaign page that showcases our campaign features. You can customize this content to match your needs.</p><p>Features include:</p><ul><li>Responsive design</li><li>Contact forms</li><li>Media galleries</li><li>Call-to-action buttons</li></ul>',
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
        successMessage: 'Thank you for your interest! We will get back to you soon.'
      }
    });
    
    console.log('Campaign updated successfully:');
    console.log('- Title:', updatedCampaign.title);
    console.log('- Status:', updatedCampaign.status);
    console.log('- Slug:', updatedCampaign.slug);
    console.log('\nYou can now access it at: http://localhost:3000/campaigns/d');
    
  } catch (error) {
    console.error('Error updating campaign:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCampaignD();