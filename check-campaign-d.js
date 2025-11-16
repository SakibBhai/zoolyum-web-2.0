const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCampaignD() {
  try {
    console.log('Checking for campaign with slug "d"...');
    const campaign = await prisma.campaign.findUnique({
      where: { slug: 'd' }
    });
    
    if (campaign) {
      console.log('Campaign found:');
      console.log('- Title:', campaign.title);
      console.log('- Slug:', campaign.slug);
      console.log('- Status:', campaign.status);
      console.log('- ID:', campaign.id);
    } else {
      console.log('No campaign found with slug "d"');
    }
    
    // Also check all campaigns to see what exists
    console.log('\nAll campaigns in database:');
    const allCampaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true
      }
    });
    
    console.log('Total campaigns:', allCampaigns.length);
    allCampaigns.forEach(c => {
      console.log(`- "${c.slug}" (${c.status}): ${c.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaignD();