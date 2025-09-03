const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestProject() {
  try {
    // First, create a test client
    const client = await prisma.clients.create({
      data: {
        name: 'Test Client Inc.',
        industry: 'Technology',
        contact_name: 'John Doe',
        email: 'john@testclient.com',
        phone: '+1-555-0123',
        status: 'active'
      }
    });
    
    console.log('Created test client:', client.id);
    
    // Create a test project
    const project = await prisma.project.create({
      data: {
        name: 'Test Portfolio Project',
        description: 'This is a test project for portfolio demonstration purposes.',
        type: 'Web Development',
        status: 'completed',
        priority: 'high',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-06-30'),
        progress: 100,
        estimated_budget: 50000.00,
        actual_budget: 48000.00,
        tasks_total: 25,
        tasks_completed: 25,
        manager: 'Project Manager',
        client_id: client.id
      }
    });
    
    console.log('Created test project:', project.id);
    console.log('Project details:', {
      id: project.id,
      name: project.name,
      type: project.type,
      status: project.status
    });
    
  } catch (error) {
    console.error('Error creating test project:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestProject();