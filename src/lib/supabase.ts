import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Get credentials from env or localStorage
export function getSupabaseCredentials(): SupabaseConfig | null {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL;
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY;

  const isPlaceholder = (url: string | undefined, key: string | undefined) => {
    if (!url || !key) return true;
    return (
      url.includes('your-supabase-project-id') ||
      key.includes('your-supabase-anon-public-key') ||
      url.trim() === '' ||
      key.trim() === ''
    );
  };

  if (envUrl && envKey && !isPlaceholder(envUrl, envKey)) {
    return { url: envUrl, anonKey: envKey };
  }

  const localUrl = localStorage.getItem('podcast_top_rank_supabase_url');
  const localKey = localStorage.getItem('podcast_top_rank_supabase_anon_key');

  if (localUrl && localKey && !isPlaceholder(localUrl, localKey)) {
    return { url: localUrl, anonKey: localKey };
  }

  return null;
}

// Save credentials dynamically
export function saveSupabaseCredentials(url: string, anonKey: string): void {
  localStorage.setItem('podcast_top_rank_supabase_url', url.trim());
  localStorage.setItem('podcast_top_rank_supabase_anon_key', anonKey.trim());
}

// Clear credentials
export function clearSupabaseCredentials(): void {
  localStorage.removeItem('podcast_top_rank_supabase_url');
  localStorage.removeItem('podcast_top_rank_supabase_anon_key');
}

// Check if configured
export function isSupabaseConfigured(): boolean {
  return getSupabaseCredentials() !== null;
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig: SupabaseConfig | null = null;

// Get initialized Supabase client
export function getSupabaseClient(): SupabaseClient | null {
  const credentials = getSupabaseCredentials();
  if (!credentials) {
    cachedClient = null;
    lastUsedConfig = null;
    return null;
  }

  // If credentials changed or not initialized yet, create a new client
  if (
    !cachedClient ||
    !lastUsedConfig ||
    lastUsedConfig.url !== credentials.url ||
    lastUsedConfig.anonKey !== credentials.anonKey
  ) {
    try {
      cachedClient = createClient(credentials.url, credentials.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      lastUsedConfig = credentials;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
}

// SQL Script helper for the user to copy-paste into Supabase SQL Editor
export const SUPABASE_SQL_SETUP = `-- Copy and paste this into your Supabase SQL Editor to create the required tables:

-- 1. Create a table for Website Configurations
CREATE TABLE IF NOT EXISTS website_configs (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or allow public read/write if unsecured
ALTER TABLE website_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write access" ON website_configs
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Create a table for Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  company TEXT,
  contact_type TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write access for bookings" ON bookings
  FOR ALL USING (true) WITH CHECK (true);
`;
