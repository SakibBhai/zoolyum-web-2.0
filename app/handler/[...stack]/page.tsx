'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StackHandler } from '@stackframe/stack';
import { getStackServerApp } from '@/lib/stack-server';

interface StackHandlerProps {
  params: Promise<{
    stack: string[];
  }>;
}

export default function StackAuthHandler({ params }: StackHandlerProps) {
  const router = useRouter();
  const [stackApp, setStackApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevelopmentMode] = useState(() => {
    return typeof window !== 'undefined' && 
           (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            process.env.NODE_ENV === 'development');
  });

  useEffect(() => {
    async function initializeStackApp() {
      try {
        if (isDevelopmentMode) {
          // In development, redirect to the main app
          router.push('/');
          return;
        }
        
        // Get the server app instance
        const serverApp = await getStackServerApp();
        setStackApp(serverApp);
      } catch (error) {
        console.error('Failed to initialize Stack Auth:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeStackApp();
  }, [isDevelopmentMode, router]);

  // Show loading state until initialized
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading...</div>
      </div>
    );
  }

  // If no stack app is available, show error
  if (!stackApp) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Authentication service temporarily unavailable</div>
      </div>
    );
  }

  // Render the Stack Auth handler with the server app
  try {
    return (
      <StackHandler
        app={stackApp}
        fullPage
      />
    );
  } catch (error) {
    console.error('Stack Auth Handler error:', error);
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Authentication service temporarily unavailable</div>
      </div>
    );
  }
}
