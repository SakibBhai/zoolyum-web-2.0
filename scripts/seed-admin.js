const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('1225@Zoolyum', 12);
    
    // Create or update admin user
    const adminUser = await prisma.adminUser.upsert({
      where: { email: 'sakib@zoolyum.com' },
      update: {
        password: hashedPassword,
        name: 'Sakib Admin',
        role: 'ADMIN'
      },
      create: {
        email: 'sakib@zoolyum.com',
        password: hashedPassword,
        name: 'Sakib Admin',
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created/updated successfully:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin()
  .then(() => {
    console.log('\n🎉 Admin seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Admin seeding failed:', error);
    process.exit(1);
  });