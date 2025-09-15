#!/usr/bin/env node

/**
 * Health check script for Docker containers
 * Validates application health and database connectivity
 */

const http = require('http');
const { PrismaClient } = require('@prisma/client');

const PORT = process.env.PORT || 3000;
const HEALTH_CHECK_TIMEOUT = 5000;

/**
 * Perform HTTP health check
 */
function httpHealthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET',
      timeout: HEALTH_CHECK_TIMEOUT,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve({ status: 'healthy', service: 'http' });
      } else {
        reject(new Error(`HTTP health check failed with status: ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(new Error(`HTTP health check failed: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HTTP health check timed out'));
    });

    req.end();
  });
}

/**
 * Perform database health check
 */
async function databaseHealthCheck() {
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    return { status: 'healthy', service: 'database' };
  } catch (error) {
    throw new Error(`Database health check failed: ${error.message}`);
  }
}

/**
 * Perform memory health check
 */
function memoryHealthCheck() {
  const memUsage = process.memoryUsage();
  const totalMemory = memUsage.heapTotal;
  const usedMemory = memUsage.heapUsed;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;

  // Consider unhealthy if memory usage is above 90%
  if (memoryUsagePercent > 90) {
    throw new Error(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`);
  }

  return {
    status: 'healthy',
    service: 'memory',
    usage: `${memoryUsagePercent.toFixed(2)}%`,
    details: {
      heapUsed: `${Math.round(usedMemory / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(totalMemory / 1024 / 1024)}MB`,
    },
  };
}

/**
 * Main health check function
 */
async function performHealthCheck() {
  const checks = [];
  const errors = [];

  try {
    // HTTP health check
    const httpCheck = await httpHealthCheck();
    checks.push(httpCheck);
  } catch (error) {
    errors.push({ service: 'http', error: error.message });
  }

  try {
    // Database health check (only if DATABASE_URL is provided)
    if (process.env.DATABASE_URL) {
      const dbCheck = await databaseHealthCheck();
      checks.push(dbCheck);
    }
  } catch (error) {
    errors.push({ service: 'database', error: error.message });
  }

  try {
    // Memory health check
    const memoryCheck = memoryHealthCheck();
    checks.push(memoryCheck);
  } catch (error) {
    errors.push({ service: 'memory', error: error.message });
  }

  // Return results
  const result = {
    timestamp: new Date().toISOString(),
    status: errors.length === 0 ? 'healthy' : 'unhealthy',
    checks,
    errors,
    uptime: process.uptime(),
    version: process.env.npm_package_version || 'unknown',
  };

  return result;
}

/**
 * Run health check and exit with appropriate code
 */
async function main() {
  try {
    const result = await performHealthCheck();
    
    if (result.status === 'healthy') {
      console.log('✅ Health check passed');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    } else {
      console.error('❌ Health check failed');
      console.error(JSON.stringify(result, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Health check crashed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Health check received SIGTERM, exiting...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Health check received SIGINT, exiting...');
  process.exit(0);
});

// Run the health check
if (require.main === module) {
  main();
}

module.exports = {
  performHealthCheck,
  httpHealthCheck,
  databaseHealthCheck,
  memoryHealthCheck,
};