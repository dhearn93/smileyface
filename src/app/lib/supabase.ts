import { createClient } from '@supabase/supabase-js';

// Add more robust environment variable validation
const requiredEnvVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // Add any other required env vars
} as const;

Object.entries(requiredEnvVars).forEach(([name, value]) => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      'Make sure you have set up your environment variables properly in Vercel.'
    );
  }
});

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
); 