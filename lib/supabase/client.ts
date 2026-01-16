import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, return a mock client to prevent build-time crashes.
  if (!url || !key) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => {},
        signOut: async () => {},
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
      }),
    } as any;
  }

  return createBrowserClient(url, key)
}
