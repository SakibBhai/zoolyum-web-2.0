'use client';

import { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface ConditionalStackProviderProps {
  children: ReactNode;
}

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
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hostname = window.location.hostname;
    const port = window.location.port;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || port === '3000' || port === '3001' || port === '3002';
    setIsDevelopment(isDev);
    
    if (isDev) {
      console.log('ConditionalStackProvider: Development mode detected, StackProvider disabled');
    }
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return <>{children}</>;
  }

  // In development, just return children without StackProvider
  if (isDevelopment) {
    return <>{children}</>;
  }

  // In production, use the dynamically imported StackProvider
  return (
    <StackProviderWrapper>
      {children}
    </StackProviderWrapper>
  );
}