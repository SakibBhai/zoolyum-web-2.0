const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCampaigns() {
  try {
    console.log('Checking all campaigns in database...');
    const campaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true
      }
    });
    
    console.log(`Total campaigns: ${campaigns.length}`);
    campaigns.forEach(c => {
      console.log(`- "${c.slug}" (${c.status}): ${c.title}`);
    });
    
    // Check specifically for sakib-bhai
    console.log('\nChecking for sakib-bhai campaign...');
    const sakibCampaign = await prisma.campaign.findUnique({
      where: { slug: 'sakib-bhai' }
    });
    
    if (sakibCampaign) {
      console.log('Found sakib-bhai campaign:');
      console.log('- Title:', sakibCampaign.title);
      console.log('- Status:', sakibCampaign.status);
      console.log('- ID:', sakibCampaign.id);
    } else {
      console.log('No campaign found with slug "sakib-bhai"');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaigns();