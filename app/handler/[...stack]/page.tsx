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
        router.push('/admin/dashboard');
      } else {
        // In production, load the stack server app
        try {
          const { stackServerApp } = await import('../../../stack');
          setStackApp(stackServerApp);
        } catch (error) {
          console.error('Failed to load Stack Auth server app:', error);
        }
      }
    };
    
    initializeParams();
  }, [params, router]);

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
        <div className="text-[#E9E7E2]">Loading authentication...</div>
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
