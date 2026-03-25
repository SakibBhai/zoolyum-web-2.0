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
  console.warn('⚠️  Missing Stack Auth environment variables:', missingVars.join(', '));
  console.warn('📝 Please set these variables in your .env file for full authentication:');
  console.warn('   1. Go to https://app.stack-auth.com/');
  console.warn('   2. Create a new project or select existing one');
  console.warn('   3. Copy the required keys from your project settings');
  console.warn('   4. Update your .env file with the actual values');
  console.warn('🔧 Running in development mode with mock authentication');
}

// Only create the StackServerApp if all required variables are present
// Otherwise, export null and let the calling code handle it
export const stackServerApp = (missingVars.length > 0) ? null : new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
});
