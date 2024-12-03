import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add debugging logs
if (typeof window !== 'undefined') {
  console.log('Supabase URL exists:', !!supabaseUrl);
  console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
}

if (!supabaseUrl || !supabaseAnonKey) {
  // More detailed error message
  throw new Error(
    `Missing Supabase environment variables. ` +
    `URL: ${!!supabaseUrl}, ` +
    `KEY: ${!!supabaseAnonKey}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 