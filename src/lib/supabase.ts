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

  // 1. Check environment variables
  if (envUrl && envKey && !isPlaceholder(envUrl, envKey)) {
    return { url: envUrl, anonKey: envKey };
  }

  // 2. Check local storage
  const localUrl = localStorage.getItem('podcast_top_rank_supabase_url');
  const localKey = localStorage.getItem('podcast_top_rank_supabase_anon_key');

  if (localUrl && localKey && !isPlaceholder(localUrl, localKey)) {
    return { url: localUrl, anonKey: localKey };
  }

  // 3. Use default fallback credentials for live website synchronization across all users/devices
  const defaultUrl = 'https://uxdvxnlxzdeyguqkjcqn.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4ZHZ4bmx4emRleWd1cWtqY3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDYyMzAsImV4cCI6MjA5OTg4MjIzMH0.-5909nW9g2ZAiEfKdRIVD68O0CSR522YN6WIRfNgkMU';

  if (!isPlaceholder(defaultUrl, defaultKey)) {
    return { url: defaultUrl, anonKey: defaultKey };
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

-- IMPORTANT: If you already created an old bookings table, drop it first by running:
-- DROP TABLE IF EXISTS bookings;

-- 1. Create a table for Website Configurations
CREATE TABLE IF NOT EXISTS website_configs (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or allow public read/write if unsecured
ALTER TABLE website_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read and write access" ON website_configs;
CREATE POLICY "Allow public read and write access" ON website_configs
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Create a table for Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  podcast_name TEXT,
  platform TEXT,
  monthly_downloads TEXT,
  selected_plan TEXT,
  message TEXT,
  contact_type TEXT NOT NULL,
  contact_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read and write access for bookings" ON bookings;
CREATE POLICY "Allow public read and write access for bookings" ON bookings
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Enable Realtime Replication for Instant (Sub-second) Updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'website_configs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE website_configs;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
  END IF;
END $$;
`;
