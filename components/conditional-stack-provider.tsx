'use client';

import { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface ConditionalStackProviderProps {
  children: ReactNode;
}

// Check if we're in development mode using environment variables
const isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                         process.env.NEXT_PUBLIC_BASE_URL?.includes('localhost') ||
                         process.env.VERCEL_ENV === 'development';

// Dynamically import StackProvider components with better error handling
const StackProviderWrapper = dynamic(
  () => import('@stackframe/stack').then((mod) => {
    const { StackProvider, StackTheme, StackClientApp } = mod;
    
    return function StackWrapper({ children }: { children: ReactNode }) {
      // Only create StackClientApp if environment variables are available
      const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
      const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
      
      if (!projectId || !publishableClientKey) {
        console.warn('Stack Auth environment variables not found, skipping provider');
        return <>{children}</>;
      }
      
      try {
        const stackClientApp = new StackClientApp({
          tokenStore: 'nextjs-cookie',
          projectId,
          publishableClientKey
        });
        
        return (
          <StackProvider app={stackClientApp}>
            <StackTheme>
              {children}
            </StackTheme>
          </StackProvider>
        );
      } catch (error) {
        console.error('Failed to initialize Stack Auth:', error);
        return <>{children}</>;
      }
    };
  }).catch((error) => {
    console.error('Failed to load Stack Auth module:', error);
    // Return a fallback component
    return function FallbackWrapper({ children }: { children: ReactNode }) {
      return <>{children}</>;
    };
  }),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function ConditionalStackProvider({ 
  children
}: ConditionalStackProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (isDevelopmentMode) {
      console.log('ConditionalStackProvider: Development mode detected, StackProvider disabled');
    }
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return <>{children}</>;
  }

  // In development, just return children without StackProvider
  if (isDevelopmentMode) {
    return <>{children}</>;
  }

  // In production, use the dynamically imported StackProvider
  return (
    <StackProviderWrapper>
      {children}
    </StackProviderWrapper>
  );
}