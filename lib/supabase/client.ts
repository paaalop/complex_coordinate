import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a dummy client or handle it in a way that doesn't crash the build
    // In many cases, just returning the client with empty strings or placeholders is enough if it's only called during build
    return createBrowserClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder'
    );
  }

  return createBrowserClient(url, key)
}
