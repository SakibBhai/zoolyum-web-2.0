'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StackHandlerProps {
  params: {
    stack: string[];
  };
}

export default function StackHandler({ params }: StackHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to admin dashboard in development
    // In production, this route should be handled by the actual Stack Auth handler
    router.push('/admin/dashboard');
  }, [router]);

  return <div>Redirecting...</div>;
}
