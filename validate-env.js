#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates all required environment variables for multi-platform deployment
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const REQUIRED_VARS = {
  // Database
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL database connection string',
    example: 'postgresql://user:pass@host:5432/db?sslmode=require'
  },
  
  // Authentication
  NEXTAUTH_SECRET: {
    required: true,
    description: 'NextAuth.js secret key for JWT signing',
    example: 'your-secret-key-here'
  },
  NEXTAUTH_URL: {
    required: true,
    description: 'Base URL for authentication callbacks',
    example: 'http://localhost:3000'
  },
  
  // Stack Auth
  NEXT_PUBLIC_STACK_PROJECT_ID: {
    required: true,
    description: 'Stack Auth project ID (public)',
    example: 'your-project-id'
  },
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: {
    required: true,
    description: 'Stack Auth publishable client key (public)',
    example: 'pck_...'
  },
  STACK_SECRET_SERVER_KEY: {
    required: true,
    description: 'Stack Auth secret server key (private)',
    example: 'ssk_...'
  }
};

const OPTIONAL_VARS = {
  // Email
  RESEND_API_KEY: {
    description: 'Resend API key for email sending',
    example: 're_...'
  },
  
  // Payment
  STRIPE_SECRET_KEY: {
    description: 'Stripe secret key for payments',
    example: 'sk_...'
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    description: 'Stripe publishable key (public)',
    example: 'pk_...'
  },
  
  // Storage
  CLOUDFLARE_R2_ACCESS_KEY_ID: {
    description: 'Cloudflare R2 access key ID',
    example: 'your-access-key'
  },
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: {
    description: 'Cloudflare R2 secret access key',
    example: 'your-secret-key'
  },
  CLOUDFLARE_R2_BUCKET_NAME: {
    description: 'Cloudflare R2 bucket name',
    example: 'your-bucket'
  },
  
  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: {
    description: 'Google Analytics measurement ID',
    example: 'G-XXXXXXXXXX'
  }
};

function validateEnvironment() {
  console.log('🔍 Validating Environment Configuration\n');
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check required variables
  console.log('📋 Required Variables:');
  for (const [key, config] of Object.entries(REQUIRED_VARS)) {
    const value = process.env[key];
    
    if (!value || value.trim() === '' || value === 'your-' + key.toLowerCase().replace(/_/g, '-') + '-here') {
      console.log(`❌ ${key}: Missing or placeholder value`);
      console.log(`   Description: ${config.description}`);
      console.log(`   Example: ${config.example}\n`);
      hasErrors = true;
    } else {
      console.log(`✅ ${key}: Configured`);
    }
  }
  
  // Check optional variables
  console.log('\n🔧 Optional Variables:');
  for (const [key, config] of Object.entries(OPTIONAL_VARS)) {
    const value = process.env[key];
    
    if (!value || value.trim() === '') {
      console.log(`⚠️  ${key}: Not configured (optional)`);
      console.log(`   Description: ${config.description}`);
      hasWarnings = true;
    } else {
      console.log(`✅ ${key}: Configured`);
    }
  }
  
  // Check configuration files
  console.log('\n📁 Configuration Files:');
  const configFiles = [
    { file: '.env.example', description: 'Environment template' },
    { file: 'vercel.json', description: 'Vercel deployment config' },
    { file: 'netlify.toml', description: 'Netlify deployment config' },
    { file: 'railway.json', description: 'Railway deployment config' },
    { file: 'Dockerfile', description: 'Docker containerization' },
    { file: '.dockerignore', description: 'Docker ignore rules' },
    { file: 'DEPLOYMENT_GUIDE.md', description: 'Deployment documentation' }
  ];
  
  for (const { file, description } of configFiles) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`✅ ${file}: ${description}`);
    } else {
      console.log(`❌ ${file}: Missing - ${description}`);
      hasErrors = true;
    }
  }
  
  // Summary
  console.log('\n📊 Validation Summary:');
  
  if (hasErrors) {
    console.log('❌ Configuration has errors that must be fixed before deployment');
    console.log('   Please review the missing required variables and files above.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  Configuration is valid but has optional features not configured');
    console.log('   The application will work but some features may be limited.');
  } else {
    console.log('✅ All configurations are valid and ready for deployment!');
  }
  
  // Platform readiness
  console.log('\n🚀 Platform Deployment Readiness:');
  console.log('✅ Vercel: Ready (vercel.json configured)');
  console.log('✅ Netlify: Ready (netlify.toml configured)');
  console.log('✅ Railway: Ready (railway.json configured)');
  console.log('✅ Docker: Ready (Dockerfile and .dockerignore configured)');
  
  console.log('\n📚 Next Steps:');
  console.log('1. Review DEPLOYMENT_GUIDE.md for platform-specific instructions');
  console.log('2. Set environment variables in your chosen platform');
  console.log('3. Deploy using platform-specific commands');
  console.log('4. Test deployment with health check endpoints');
  
  return !hasErrors;
}

// Run validation
if (require.main === module) {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

module.exports = { validateEnvironment };