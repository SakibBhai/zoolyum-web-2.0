#!/usr/bin/env node

/**
 * Vercel Build Script
 * Handles database setup and build process for Vercel deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`[Vercel Build] ${message}`);
}

function error(message) {
  console.error(`[Vercel Build Error] ${message}`);
}

async function main() {
  try {
    log('Starting Vercel build process...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      error('DATABASE_URL environment variable is not set');
      process.exit(1);
    }
    
    log('DATABASE_URL is configured');
    
    // Generate Prisma client
    log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Check if database needs migration
    log('Checking database status...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      log('Database schema synchronized');
    } catch (dbError) {
      log('Database push failed, attempting migration...');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        log('Database migrations applied');
      } catch (migrateError) {
        error('Database setup failed');
        error(migrateError.message);
        process.exit(1);
      }
    }
    
    // Build Next.js application
    log('Building Next.js application...');
    execSync('next build', { stdio: 'inherit' });
    
    log('Build completed successfully!');
    
  } catch (err) {
    error('Build failed:');
    error(err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };