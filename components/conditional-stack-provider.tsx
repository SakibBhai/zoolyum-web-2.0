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

// Dynamically import StackProvider components
const StackProviderWrapper = dynamic(
  () => import('@stackframe/stack').then((mod) => {
    const { StackProvider, StackTheme, StackClientApp } = mod;
    
    return function StackWrapper({ children }: { children: ReactNode }) {
      const stackClientApp = new StackClientApp({
        tokenStore: 'nextjs-cookie',
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
        publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!
      });
      
      return (
        <StackProvider app={stackClientApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      );
    };
  }),
  { ssr: false }
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