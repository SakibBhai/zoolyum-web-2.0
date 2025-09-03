const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProjects() {
  try {
    const count = await prisma.project.count();
    console.log('Projects count:', count);
    
    if (count > 0) {
      const projects = await prisma.project.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          status: true
        },
        take: 5
      });
      console.log('Sample projects:', projects);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjects();