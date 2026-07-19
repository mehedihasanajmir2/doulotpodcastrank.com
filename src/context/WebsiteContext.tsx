import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import {
  TeamMember,
  PodcastEpisode,
  PricingPlan,
  ProcessStep,
  Testimonial,
  TEAM_MEMBERS,
  EPISODES,
  CATEGORIES,
  PRICING_PLANS,
  PROCESS_STEPS,
  TESTIMONIALS
} from '../data';

export interface WebsiteData {
  logo: {
    textTop: string;
    textBottom: string;
  };
  hero: {
    tagline: string;
    title: string;
    description: string;
    buttonText: string;
    statBadgeText: string;
    imageLeft: string;
    imageRight: string;
  };
  about: {
    label: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    image: string;
    buttonText: string;
  };
  stats: Array<{
    value: string;
    label: string;
    description: string;
    color: string;
  }>;
  teamMembers: TeamMember[];
  episodes: PodcastEpisode[];
  categories: Array<{
    name: string;
    tagline: string;
    description: string;
  }>;
  pricingPlans: PricingPlan[];
  processSteps: ProcessStep[];
  testimonials: Testimonial[];
  testimonialsImage: string;
  bookingPlatforms?: {
    [key: string]: boolean;
  };
  booking?: {
    badgeText: string;
    title: string;
    titleAccent: string;
    description: string;
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Title: string;
    benefit3Desc: string;
    trustTitle: string;
    trustDesc: string;
    ratingText: string;
    quoteText: string;
    quoteAuthor: string;
    quoteImage: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    facebook: string;
    indigo?: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    copyright: string;
  };
  emailNotification?: {
    enabled: boolean;
    recipientEmail: string;
    web3formKey: string;
  };
}

const migrateWebsiteData = (obj: any): any => {
  if (typeof obj === 'string') {
    return obj
      .replace(/Doulot Podcast Rank/g, 'Podcast Ranking Hub')
      .replace(/Doulot Ali Podcast Ranking Media/g, 'Podcast Ranking Hub')
      .replace(/PodcastTopRankMedia/g, 'Podcast Ranking Hub')
      .replace(/Doulot Ali Gettop Growth/g, 'Podcast Ranking Hub')
      .replace(/Podcast Ranking Media/g, 'Podcast Ranking Hub')
      .replace(/Gettop Growth/g, 'Podcast Ranking Hub');
  } else if (Array.isArray(obj)) {
    return obj.map(migrateWebsiteData);
  } else if (obj !== null && typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = migrateWebsiteData(obj[key]);
    }
    if (res.contactInfo && !res.contactInfo.linkedin) {
      res.contactInfo.linkedin = '#';
    }
    return res;
  }
  return obj;
};

export const DEFAULT_WEBSITE_DATA: WebsiteData = {
  logo: {
    textTop: 'Podcast',
    textBottom: 'Ranking Hub',
  },
  hero: {
    tagline: 'Podcast SEO & Growth Agency',
    title: 'From Launch to Top Charts — We Make It Happen',
    description: 'Podcast Ranking Hub helps podcasters boost visibility, attract more listeners, and grow their audience with expert SEO and marketing strategies tailored for every platform.',
    buttonText: 'Start Growing Today',
    statBadgeText: 'Join 200+ successful podcasters',
    imageLeft: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600',
    imageRight: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600',
  },
  about: {
    label: 'About Podcast Ranking Hub',
    title: 'The Growth Engine Behind Successful Podcasts.',
    subtitle: 'Helping Podcasters Get Found, Heard, and Ranked',
    paragraphs: [
      'Podcast Ranking Hub was built with one clear goal: to help podcasters grow through smart SEO and strategic marketing. We focus on increasing visibility across major podcast platforms so your show reaches the right audience at the right time.',
      'From keyword optimization and metadata strategy to promotion and growth planning, we use proven techniques that improve discoverability and drive real listener growth. Whether you\'re launching a new podcast or scaling an existing one, we help position your show to stand out in a crowded market.',
      'We don\'t believe in guesswork. We believe in strategy, data, and results.'
    ],
    image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    buttonText: 'More About Us',
  },
  stats: [
    {
      value: '1.8M',
      color: 'text-purple-400',
      label: 'Real Subscribers',
      description: 'Grow a loyal audience that actually listens.',
    },
    {
      value: '23K+',
      color: 'text-pink-400',
      label: 'Total Episodes Optimized',
      description: 'Maximize the reach of every episode.',
    },
    {
      value: '34+',
      color: 'text-[#00F5D4]',
      label: 'New Programs Launched',
      description: 'Expand your podcast network with ease.',
    },
  ],
  teamMembers: TEAM_MEMBERS,
  episodes: EPISODES,
  categories: CATEGORIES,
  pricingPlans: PRICING_PLANS,
  processSteps: PROCESS_STEPS,
  testimonials: TESTIMONIALS,
  testimonialsImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
  bookingPlatforms: {
    'YouTube': true,
    'Spotify': true,
    'Apple Podcast': true,
    'Google Podcast': true,
    'SoundCloud': true,
    'Not Launched': true
  },
  booking: {
    badgeText: '100% Free Strategy Audit',
    title: 'Get Your Custom',
    titleAccent: 'Podcast Blueprint',
    description: 'Submit your details and receive a bespoke optimization blueprint analyzed by our team to trigger explosive growth.',
    benefit1Title: 'Deep SEO Visibility Report',
    benefit1Desc: 'We analyze your keywords, titles, tags, and description fields.',
    benefit2Title: 'Top-Charts Formula',
    benefit2Desc: 'Actionable strategic steps tailored specifically to rank on your targeted platform.',
    benefit3Title: '30-Min Live Audit Call',
    benefit3Desc: 'Walk through results with a lead strategist, worth $199 entirely free.',
    trustTitle: '100% Secure & Confidential',
    trustDesc: 'Your ideas and analytics are kept private with our team.',
    ratingText: '4.9/5 RATING',
    quoteText: 'Their custom audit plan completely changed how we structured our titles. Downloads skyrocketed by 180%!',
    quoteAuthor: 'Emma G., Tech Talks Daily Host',
    quoteImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
  },
  contactInfo: {
    email: 'doulotaligettopgrowth@gmail.com',
    phone: '+880 1765-068860',
    address: 'Khoksa, Kushtia, Bangladesh',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#',
    copyright: 'Copyright © 2026 Podcast Ranking Hub, All rights reserved.',
  },
  emailNotification: {
    enabled: true,
    recipientEmail: 'doulotaligettopgrowth@gmail.com',
    web3formKey: '81e529bf-cc0a-4104-b8c3-def656e8d0fb',
  },
};

interface WebsiteContextType {
  data: WebsiteData;
  updateData: (newData: Partial<WebsiteData>) => void;
  resetToDefaults: () => void;
  isAdminLoggedIn: boolean;
  isAdminLoginOpen: boolean;
  setAdminLoginOpen: (open: boolean) => void;
  login: (password: string) => boolean;
  logout: () => void;
  isAdminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  firestoreError: string | null; // For backward compatibility with AdminPanel error message
  databaseError: string | null;
  clearFirestoreError: () => void;
  clearDatabaseError: () => void;
  isSyncing: boolean;
  isDbConnected: boolean;
  bookings: any[];
  bookingsLoading: boolean;
  fetchBookings: () => Promise<void>;
  addBooking: (booking: any) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  syncWithDatabase: () => Promise<void>;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export function WebsiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WebsiteData>(() => {
    const savedData = localStorage.getItem('podcast_top_rank_media_data');
    if (savedData) {
      try {
        let parsed = JSON.parse(savedData);
        return migrateWebsiteData(parsed);
      } catch (e) {
        console.error('Failed to parse saved website data, using defaults', e);
      }
    }
    return DEFAULT_WEBSITE_DATA;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setAdminPanelOpen] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const clearDatabaseError = () => setDatabaseError(null);
  const clearFirestoreError = () => setDatabaseError(null); // Keep alias for backward compatibility

  // Helper to load client-side bookings
  const loadLocalBookings = () => {
    const saved = localStorage.getItem('podcast_top_rank_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      } catch (e) {
        console.error('Failed to parse local bookings:', e);
      }
    }
  };

  // Sync data from Supabase
  const syncWithDatabase = async () => {
    if (!isSupabaseConfigured()) {
      setIsDbConnected(false);
      loadLocalBookings();
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsDbConnected(false);
      loadLocalBookings();
      return;
    }

    setIsSyncing(true);
    setDatabaseError(null);

    try {
      // 1. Fetch website configurations
      const { data: configData, error: configError } = await supabase
        .from('website_configs')
        .select('value')
        .eq('key', 'website_data')
        .maybeSingle();

      if (configError) {
        throw configError;
      }

      if (configData && configData.value) {
        const migrated = migrateWebsiteData(configData.value);
        setData(migrated);
        localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(migrated));
        setIsDbConnected(true);
      } else {
        // No config row exists in Supabase. Let's seed it!
        const { error: seedError } = await supabase
          .from('website_configs')
          .upsert({ key: 'website_data', value: data });

        if (seedError) {
          console.warn('Could not seed initial website data to Supabase (check if table is created):', seedError);
        } else {
          setIsDbConnected(true);
        }
      }

      // 2. Fetch bookings
      await fetchBookings();
    } catch (err: any) {
      console.warn('Supabase synchronization fallback initiated:', err);
      setIsDbConnected(false);
      
      let userFriendlyError = err.message || String(err);
      if (
        err.code === '42P01' || 
        userFriendlyError.includes('relation "website_configs" does not exist') || 
        userFriendlyError.includes('relation "bookings" does not exist') ||
        userFriendlyError.includes('42P01')
      ) {
        userFriendlyError = 'Database tables "website_configs" and "bookings" do not exist yet in your Supabase project. Please go to the "Database Setup" tab in the Admin Panel, copy the SQL setup script, and run it inside your Supabase SQL Editor.';
      } else if (
        userFriendlyError.includes('Failed to fetch') || 
        userFriendlyError.includes('FetchError') ||
        userFriendlyError.includes('NetworkError')
      ) {
        userFriendlyError = 'Could not connect to Supabase. Please double-check your internet connection, Supabase URL, and Anon Key configuration.';
      } else if (err.code === 'PGRST111' || userFriendlyError.includes('PGRST111')) {
        userFriendlyError = 'Invalid API key or URL. Please verify your Supabase URL and Anon Public Key are correct in the "Database Setup" tab.';
      }
      
      setDatabaseError(userFriendlyError);
      loadLocalBookings();
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch bookings from database
  const fetchBookings = async () => {
    setBookingsLoading(true);
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      loadLocalBookings();
      setBookingsLoading(false);
      return;
    }

    try {
      const { data: cloudBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (cloudBookings) {
        // Map database underscored keys back to camelCase for UI compatibility if needed, or support both
        const formatted = cloudBookings.map((b: any) => ({
          id: b.id,
          token: b.token,
          name: b.name,
          email: b.email,
          podcastName: b.podcast_name || b.podcastName || 'Not Provided',
          platform: b.platform || 'Spotify',
          monthlyDownloads: b.monthly_downloads || b.monthlyDownloads || '0 - 5,000',
          selectedPlan: b.selected_plan || b.selectedPlan || 'Free Audit',
          message: b.message || '',
          contactType: b.contact_type || b.contactType,
          contactValue: b.contact_value || b.contactValue,
          createdAt: b.created_at || b.createdAt
        }));

        setBookings(formatted);
        localStorage.setItem('podcast_top_rank_bookings', JSON.stringify(formatted));
      }
    } catch (err: any) {
      console.error('Failed to fetch bookings from Supabase:', err);
      loadLocalBookings();
    } finally {
      setBookingsLoading(false);
    }
  };

  // Save new booking
  const addBooking = async (booking: any) => {
    // 1. Save locally
    const existing = localStorage.getItem('podcast_top_rank_bookings');
    let list: any[] = [];
    if (existing) {
      try {
        list = JSON.parse(existing);
      } catch (e) {
        list = [];
      }
    }
    const newList = [booking, ...list];
    localStorage.setItem('podcast_top_rank_bookings', JSON.stringify(newList));
    setBookings(newList);

    // 2. Save to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('bookings').insert({
          id: booking.id,
          token: booking.token,
          name: booking.name,
          email: booking.email,
          podcast_name: booking.podcastName,
          platform: booking.platform,
          monthly_downloads: booking.monthlyDownloads,
          selected_plan: booking.selectedPlan,
          message: booking.message,
          contact_type: booking.contactType,
          contact_value: booking.contactValue,
          created_at: booking.createdAt
        });

        if (error) throw error;
        console.log('Booking successfully saved to Supabase!');
      } catch (err) {
        console.error('Failed to save booking to Supabase, fell back to local storage:', err);
      }
    }
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    // 1. Delete locally
    const saved = localStorage.getItem('podcast_top_rank_bookings');
    let list: any[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [];
      }
    }
    const updated = list.filter((b: any) => b.id !== id);
    localStorage.setItem('podcast_top_rank_bookings', JSON.stringify(updated));
    setBookings(updated);

    // 2. Delete from Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        console.log('Booking successfully deleted from Supabase!');
      } catch (err) {
        console.error('Failed to delete booking from Supabase:', err);
      }
    }
  };

  // Keep ref updated to avoid stale state in interval
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Keep ref updated for Admin Panel Open to skip overwrite during edit
  const isAdminPanelOpenRef = useRef(isAdminPanelOpen);
  useEffect(() => {
    isAdminPanelOpenRef.current = isAdminPanelOpen;
  }, [isAdminPanelOpen]);

  // Initial Sync effect and Realtime / Polling Setup
  useEffect(() => {
    const loggedIn = localStorage.getItem('podcast_top_rank_admin_logged_in');
    if (loggedIn === 'true') {
      setIsAdminLoggedIn(true);
    }
    syncWithDatabase();

    // 1. Setup Supabase Realtime Subscriptions for immediate (sub-second) updates
    const supabase = getSupabaseClient();
    let configChannel: any = null;
    let bookingsChannel: any = null;

    if (supabase && isSupabaseConfigured()) {
      try {
        configChannel = supabase
          .channel('website_configs_realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'website_configs', filter: 'key=eq.website_data' },
            (payload: any) => {
              console.log('Realtime website config update:', payload);
              // Skip background updates if Admin Panel is currently open to prevent locking/overwriting active work
              if (isAdminPanelOpenRef.current) {
                console.log('Skipping background configuration update: Admin Panel is open.');
                return;
              }
              if (payload.new && payload.new.value) {
                const migrated = migrateWebsiteData(payload.new.value);
                // Only update if it is different from current data
                if (JSON.stringify(dataRef.current) !== JSON.stringify(migrated)) {
                  setData(migrated);
                  localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(migrated));
                }
              }
            }
          )
          .subscribe();

        bookingsChannel = supabase
          .channel('bookings_realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'bookings' },
            () => {
              console.log('Realtime bookings update triggered');
              fetchBookings();
            }
          )
          .subscribe();
      } catch (e) {
        console.error('Failed to setup Supabase Realtime:', e);
      }
    }

    // 2. Setup short-polling (every 5 seconds) as a fallback in case Realtime is not enabled on Supabase dashboard
    const interval = setInterval(() => {
      const client = getSupabaseClient();
      if (!client || !isSupabaseConfigured()) return;
      
      const fetchLatestFromDb = async () => {
        try {
          // If admin panel is open, completely skip config fetching to prevent overwriting user edits in real-time
          if (!isAdminPanelOpenRef.current) {
            // Fetch website data
            const { data: configData } = await client
              .from('website_configs')
              .select('value')
              .eq('key', 'website_data')
              .maybeSingle();

            if (configData && configData.value) {
              const migrated = migrateWebsiteData(configData.value);
              const currentStr = JSON.stringify(dataRef.current);
              const nextStr = JSON.stringify(migrated);
              if (currentStr !== nextStr) {
                setData(migrated);
                localStorage.setItem('podcast_top_rank_media_data', nextStr);
              }
            }
          }

          // Fetch bookings
          const { data: cloudBookings } = await client
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

          if (cloudBookings) {
            const formatted = cloudBookings.map((b: any) => ({
              id: b.id,
              token: b.token,
              name: b.name,
              email: b.email,
              podcastName: b.podcast_name || b.podcastName || 'Not Provided',
              platform: b.platform || 'Spotify',
              monthlyDownloads: b.monthly_downloads || b.monthlyDownloads || '0 - 5,000',
              selectedPlan: b.selected_plan || b.selectedPlan || 'Free Audit',
              message: b.message || '',
              contactType: b.contact_type || b.contactType,
              contactValue: b.contact_value || b.contactValue,
              createdAt: b.created_at || b.createdAt
            }));
            
            setBookings((prev) => {
              const prevStr = JSON.stringify(prev);
              const nextStr = JSON.stringify(formatted);
              if (prevStr !== nextStr) {
                localStorage.setItem('podcast_top_rank_bookings', nextStr);
                return formatted;
              }
              return prev;
            });
          }
        } catch (e) {
          console.debug('Polling sync skipped:', e);
        }
      };

      fetchLatestFromDb();
    }, 5000);

    return () => {
      if (configChannel) {
        try { supabase?.removeChannel(configChannel); } catch(e){}
      }
      if (bookingsChannel) {
        try { supabase?.removeChannel(bookingsChannel); } catch(e){}
      }
      clearInterval(interval);
    };
  }, []);

  const updateData = async (newData: Partial<WebsiteData>) => {
    setIsSyncing(true);
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(updated));

    // Save to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('website_configs')
          .upsert({ key: 'website_data', value: updated, updated_at: new Date().toISOString() });

        if (error) throw error;
        setIsDbConnected(true);
        setDatabaseError(null);
      } catch (err: any) {
        console.error('Failed to save configuration to Supabase:', err);
        setDatabaseError(`Supabase Sync Error: ${err.message || String(err)}`);
      }
    }

    setTimeout(() => {
      setIsSyncing(false);
    }, 150);
  };

  const resetToDefaults = async () => {
    setIsSyncing(true);
    setData(DEFAULT_WEBSITE_DATA);
    localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(DEFAULT_WEBSITE_DATA));

    // Reset in Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('website_configs')
          .upsert({ key: 'website_data', value: DEFAULT_WEBSITE_DATA, updated_at: new Date().toISOString() });

        if (error) throw error;
        setIsDbConnected(true);
        setDatabaseError(null);
      } catch (err: any) {
        console.error('Failed to reset website configs in Supabase:', err);
        setDatabaseError(`Supabase Reset Error: ${err.message || String(err)}`);
      }
    }

    setTimeout(() => {
      setIsSyncing(false);
    }, 150);
  };

  const login = (password: string): boolean => {
    const trimmed = password.trim();
    if (trimmed === 'Doulot123@' || trimmed === 'doulot123@') {
      setIsAdminLoggedIn(true);
      setAdminLoginOpen(false);
      setAdminPanelOpen(true);
      localStorage.setItem('podcast_top_rank_admin_logged_in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminPanelOpen(false);
    localStorage.removeItem('podcast_top_rank_admin_logged_in');
  };

  return (
    <WebsiteContext.Provider
      value={{
        data,
        updateData,
        resetToDefaults,
        isAdminLoggedIn,
        isAdminLoginOpen,
        setAdminLoginOpen,
        login,
        logout,
        isAdminPanelOpen,
        setAdminPanelOpen,
        firestoreError: databaseError, // Alias for backward compatibility
        databaseError,
        clearFirestoreError,
        clearDatabaseError,
        isSyncing,
        isDbConnected,
        bookings,
        bookingsLoading,
        fetchBookings,
        addBooking,
        deleteBooking,
        syncWithDatabase
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsiteData() {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsiteData must be used within a WebsiteProvider');
  }
  return context;
}
