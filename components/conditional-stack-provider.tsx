'use client';

import { ReactNode, useState, useEffect } from 'react';

interface ConditionalStackProviderProps {
  children: ReactNode;
}

export default function ConditionalStackProvider({ 
  children
}: ConditionalStackProviderProps) {
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hostname = window.location.hostname;
    const port = window.location.port;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || port === '3000';
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

  // In production, dynamically import and use StackProvider with client app
  const { StackProvider, StackTheme, StackClientApp } = require('@stackframe/stack');
  
  // Create client-side stack app (this doesn't need server-only imports)
  const stackClientApp = new StackClientApp({
    tokenStore: 'nextjs-cookie'
  });
  
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
}