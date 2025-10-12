import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env not set. Provide VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_* equivalents).");
}

export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
