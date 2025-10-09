// Test script to identify the source of the undefined length error
const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Testing Next.js build process...');
  
  // First, let's check if the issue is with environment variables
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  // Try to import and test Prisma client
  console.log('Testing Prisma client...');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  console.log('Prisma client created successfully');
  
  // Test a simple query
  prisma.$connect().then(() => {
    console.log('Database connection successful');
    return prisma.$disconnect();
  }).catch(err => {
    console.error('Database connection failed:', err.message);
  });
  
} catch (error) {
  console.error('Error in test script:', error.message);
  console.error('Stack trace:', error.stack);
}