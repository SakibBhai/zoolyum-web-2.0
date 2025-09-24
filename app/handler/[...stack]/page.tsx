'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

interface StackHandlerProps {
  params: Promise<{
    stack: string[];
  }>;
}

// Dynamically import Stack Auth handler to avoid SSR issues
const StackHandler = dynamic(
  () => import('@stackframe/stack').then((mod) => mod.StackHandler),
  { ssr: false }
);

export default function StackAuthHandler({ params }: StackHandlerProps) {
  const router = useRouter();
  const [stackParams, setStackParams] = useState<string[]>([]);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [stackApp, setStackApp] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setStackParams(resolvedParams.stack);
      
      // Check if we're in development mode
      const hostname = window.location.hostname;
      const port = window.location.port;
      const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || port === '3000' || port === '3001' || port === '3002';
      setIsDevelopment(isDev);
      
      // In development, redirect to admin dashboard (mock auth)
      if (isDev) {
        console.log('Development mode: Redirecting to admin dashboard');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000); // Add small delay to show loading message
      } else {
        // In production, create a client-side Stack app
        try {
          const { StackApp } = await import('@stackframe/stack');
          const clientApp = new StackApp({
            projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
            publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
          });
          setStackApp(clientApp);
        } catch (error) {
          console.error('Failed to load Stack Auth client app:', error);
        }
      }
      
      setIsInitialized(true);
    };
    
    initializeParams();
  }, [params, router]);

  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Loading authentication...</div>
      </div>
    );
  }

  // In development, show loading state while redirecting
  if (isDevelopment) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Redirecting to admin dashboard...</div>
      </div>
    );
  }

  // In production, show loading state until stack app is loaded
  if (!stackApp) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#E9E7E2]">Failed to load authentication. Please check your configuration.</div>
      </div>
    );
  }

  // In production, use the actual Stack Auth handler
  return (
    <StackHandler
      fullPage
      app={stackApp}
    />
  );
}
