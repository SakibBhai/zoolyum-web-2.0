import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Validate required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value.trim() === '')
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing Stack Auth environment variables:', missingVars.join(', '));
  console.error('📝 Please set these variables in your .env file:');
  console.error('   1. Go to https://app.stack-auth.com/');
  console.error('   2. Create a new project or select existing one');
  console.error('   3. Copy the required keys from your project settings');
  console.error('   4. Update your .env file with the actual values');
  
  // In development, we can continue with a mock, but log the issue
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔧 Development mode: Stack Auth will use mock authentication');
  } else {
    throw new Error(`Missing required Stack Auth environment variables: ${missingVars.join(', ')}`);
  }
}

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
});
