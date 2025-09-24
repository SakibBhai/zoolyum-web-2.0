'use client';

import { useState, useEffect } from 'react';

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

// Conditionally import Stack Auth hook for production
let useStackUser: any = null;
if (typeof window !== 'undefined') {
  try {
    const stackModule = require('@stackframe/stack');
    useStackUser = stackModule.useUser;
  } catch (error) {
    console.warn('Stack Auth not available:', error);
  }
}

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

  // In production, use Stack Auth if available
  if (useStackUser) {
    try {
      const stackUser = useStackUser();
      return stackUser;
    } catch (error) {
      console.warn('Stack Auth error:', error);
      return null;
    }
  }

  // Fallback if Stack Auth is not available
  console.warn('Stack Auth not available, user will be null');
  return null;
}