'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StackHandlerProps {
  params: Promise<{
    stack: string[];
  }>;
}

export default function StackHandler({ params }: StackHandlerProps) {
  const router = useRouter();
  const [stackParams, setStackParams] = useState<string[]>([]);

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setStackParams(resolvedParams.stack);
      
      // Always redirect to admin dashboard in development
      // In production, this route should be handled by the actual Stack Auth handler
      router.push('/admin/dashboard');
    };
    
    initializeParams();
  }, [params, router]);

  return <div>Redirecting...</div>;
}
