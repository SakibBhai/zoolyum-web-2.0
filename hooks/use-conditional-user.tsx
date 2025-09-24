'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Mock user for development
const DEV_USER = {
  id: 'dev-user',
  email: 'admin@zoolyum.com',
  displayName: 'Development Admin',
  primaryEmail: 'admin@zoolyum.com',
  primaryEmailVerified: true,
  profileImageUrl: null,
  signedUpAt: new Date(),
  clientMetadata: {},
  serverMetadata: {},
  clientReadOnlyMetadata: {},
  serverReadOnlyMetadata: {},
  hasPassword: true,
  oauthProviders: [],
  selectedTeam: null,
  selectedTeamId: null
};

// Dynamically import Stack Auth hook for production
const useStackUser = dynamic(
  () => import('@stackframe/stack').then((mod) => mod.useUser),
  { ssr: false }
);

export function useConditionalUser() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(undefined);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hostname = window.location.hostname;
    const port = window.location.port;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || port === '3000' || port === '3001' || port === '3002';
    setIsDevelopment(isDev);
    
    if (isDev) {
      console.log('useConditionalUser: Development mode detected, using mock user');
      setUser(DEV_USER);
    }
  }, []);

  // Don't return anything until we're on the client
  if (!isClient) {
    return undefined;
  }

  // In development, return mock user
  if (isDevelopment) {
    return user;
  }

  // In production, use Stack Auth
  // This will be handled by the ConditionalStackProvider
  // If Stack Auth is not available, this will return null
  try {
    const stackUser = useStackUser();
    return stackUser;
  } catch (error) {
    console.warn('Stack Auth not available, user will be null');
    return null;
  }
}