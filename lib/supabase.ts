// This file is now deprecated - use prisma client instead
// The application should use Prisma with Neon database instead of Supabase

import { prisma } from './db';

/**
 * This function is a compatibility layer for code that was previously using Supabase
 * It returns an object with methods that mimic Supabase's API but use Prisma instead
 * 
 * @deprecated Use prisma client directly instead
 */
export function getBrowserClient() {
  // Return a client that uses Prisma instead of Supabase
  return {
    from: (table: string) => ({
      select: () => ({
        eq: (field: string, value: any) => ({
          single: async () => {
            try {
              // Convert table name to PascalCase for Prisma model name
              const modelName = table.charAt(0).toUpperCase() + table.slice(1);
              // @ts-ignore - Dynamic access to prisma models
              const result = await prisma[table].findFirst({
                where: { [field]: value }
              });
              return { data: result, error: null };
            } catch (error) {
              console.error(`Error in getBrowserClient.from.select.eq.single:`, error);
              return { data: null, error };
            }
          },
          data: [],
          error: null,
        }),
        data: [],
        error: null,
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            try {
              // @ts-ignore - Dynamic access to prisma models
              const result = await prisma[table].create({
                data
              });
              return { data: result, error: null };
            } catch (error) {
              console.error(`Error in getBrowserClient.from.insert.select.single:`, error);
              return { data: null, error };
            }
          },
        }),
      }),
      update: (data: any) => ({
        eq: (field: string, value: any) => ({
          select: () => ({
            single: async () => {
              try {
                // @ts-ignore - Dynamic access to prisma models
                const result = await prisma[table].update({
                  where: { [field]: value },
                  data
                });
                return { data: result, error: null };
              } catch (error) {
                console.error(`Error in getBrowserClient.from.update.eq.select.single:`, error);
                return { data: null, error };
              }
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (field: string, value: any) => ({
          data: null,
          error: null,
        }),
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
}