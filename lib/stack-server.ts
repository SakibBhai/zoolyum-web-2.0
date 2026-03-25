// This file conditionally exports the stack server app
// to avoid server-only imports in client components

let stackServerApp: any = null;

export async function getStackServerApp() {
  if (process.env.NODE_ENV === 'development') {
    // Return a mock in development
    return {
      getUser: async () => ({
        id: 'dev-user',
        email: 'admin@zoolyum.com',
        displayName: 'Development Admin'
      })
    };
  }

  if (!stackServerApp) {
    // Dynamically import the actual stack app only in production
    try {
      const module = await import('../stack');
      stackServerApp = module.stackServerApp;
    } catch (error) {
      console.error('Failed to load Stack Auth:', error);
      return null;
    }
  }

  return stackServerApp;
}