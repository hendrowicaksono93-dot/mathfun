import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have the required keys to avoid "supabaseUrl is required" error
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
