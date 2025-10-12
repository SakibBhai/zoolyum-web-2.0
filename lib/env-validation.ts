/**
 * Environment variable validation for build-time and runtime
 */

export interface EnvConfig {
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  NODE_ENV: string;
  VERCEL?: string;
  NEXT_PUBLIC_STACK_PROJECT_ID?: string;
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY?: string;
  STACK_SECRET_SERVER_KEY?: string;
}

export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

/**
 * Validates required environment variables
 * @param required - Array of required environment variable names
 * @param optional - Array of optional environment variable names
 * @returns Validated environment configuration
 */
export function validateEnv(
  required: (keyof EnvConfig)[] = [],
  optional: (keyof EnvConfig)[] = []
): Partial<EnvConfig> {
  const env: Partial<EnvConfig> = {};
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of required) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      env[key] = value as any;
    }
  }

  // Check optional variables
  for (const key of optional) {
    const value = process.env[key];
    if (value) {
      env[key] = value as any;
    } else {
      warnings.push(`Optional environment variable ${key} is not set`);
    }
  }

  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.warn('Environment warnings:', warnings);
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    throw new EnvValidationError(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return env;
}

/**
 * Validates database URL format and accessibility
 */
export function validateDatabaseUrl(url?: string): boolean {
  if (!url) return false;
  
  // Check if it's a placeholder URL (used during build)
  if (url.includes('placeholder')) {
    console.warn('Using placeholder DATABASE_URL - database operations will fail');
    return false;
  }

  // Basic URL format validation
  try {
    const parsed = new URL(url);
    return ['postgresql:', 'postgres:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Gets environment configuration with validation
 */
export function getEnvConfig(): EnvConfig {
  const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
  
  if (isBuildTime) {
    // During build, only validate critical variables
    return {
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@placeholder:5432/placeholder',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'build-time-placeholder',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      NODE_ENV: process.env.NODE_ENV || 'production',
      VERCEL: process.env.VERCEL,
    };
  }

  // Runtime validation
  return validateEnv(
    ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'NODE_ENV'],
    ['VERCEL', 'NEXT_PUBLIC_STACK_PROJECT_ID', 'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY', 'STACK_SECRET_SERVER_KEY']
  ) as EnvConfig;
}

/**
 * Checks if we're in a serverless environment
 */
export function isServerless(): boolean {
  return !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
}

/**
 * Gets database connection configuration for serverless
 */
export function getDatabaseConfig() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    throw new EnvValidationError('DATABASE_URL is required');
  }

  if (isServerless()) {
    // Ensure connection pooling parameters for serverless
    const urlObj = new URL(url);
    
    // Add connection pooling parameters if not present
    if (!urlObj.searchParams.has('connection_limit')) {
      urlObj.searchParams.set('connection_limit', '1');
    }
    if (!urlObj.searchParams.has('pool_timeout')) {
      urlObj.searchParams.set('pool_timeout', '20');
    }
    if (!urlObj.searchParams.has('sslmode')) {
      urlObj.searchParams.set('sslmode', 'require');
    }

    return urlObj.toString();
  }

  return url;
}