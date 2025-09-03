const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTestProject() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        clients: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });
    
    console.log('Recent projects:');
    projects.forEach(project => {
      console.log(`- ID: ${project.id}`);
      console.log(`  Name: ${project.name}`);
      console.log(`  Type: ${project.type}`);
      console.log(`  Status: ${project.status}`);
      console.log(`  Client: ${project.clients?.name || 'No client'}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTestProject();