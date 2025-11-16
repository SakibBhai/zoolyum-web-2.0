const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSakibCampaign() {
  try {
    console.log('Updating sakib-bhai campaign status to PUBLISHED...');
    const campaign = await prisma.campaign.update({
      where: { slug: 'sakib-bhai' },
      data: { status: 'PUBLISHED' }
    });
    
    console.log('Campaign updated successfully:');
    console.log('- Title:', campaign.title);
    console.log('- Status:', campaign.status);
    console.log('- Slug:', campaign.slug);
    console.log('You can now access it at: http://localhost:3000/campaigns/sakib-bhai');
    
  } catch (error) {
    console.error('Error updating campaign:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSakibCampaign();