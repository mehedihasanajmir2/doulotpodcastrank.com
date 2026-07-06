import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    twitter: string;
    copyright: string;
  };
}

const DEFAULT_WEBSITE_DATA: WebsiteData = {
  logo: {
    textTop: 'Doulot Ali',
    textBottom: 'Gettop Growth',
  },
  hero: {
    tagline: 'Podcast SEO & Growth Agency',
    title: 'From Launch to Top Charts — We Make It Happen',
    description: 'Doulot Ali Gettop Growth helps podcasters boost visibility, attract more listeners, and grow their audience with expert SEO and marketing strategies tailored for every platform.',
    buttonText: 'Start Growing Today',
    statBadgeText: 'Join 200+ successful podcasters',
    imageLeft: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600',
    imageRight: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600',
  },
  about: {
    label: 'About Doulot Ali Gettop Growth',
    title: 'The Growth Engine Behind Successful Podcasts.',
    subtitle: 'Helping Podcasters Get Found, Heard, and Ranked',
    paragraphs: [
      'Doulot Ali Gettop Growth was built with one clear goal: to help podcasters grow through smart SEO and strategic marketing. We focus on increasing visibility across major podcast platforms so your show reaches the right audience at the right time.',
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
  contactInfo: {
    email: 'doulotaligettopgrowth@gmail.com',
    phone: '+880 1765-068860',
    address: 'Khoksa, Kushtia, Bangladesh',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    copyright: 'Copyright © 2026 Doulot Ali Gettop Growth, All rights reserved.',
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
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export function WebsiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WebsiteData>(DEFAULT_WEBSITE_DATA);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setAdminPanelOpen] = useState(false);

  // Load from localStorage on mount and sync with Firestore
  useEffect(() => {
    const savedData = localStorage.getItem('podcast_top_rank_media_data');
    if (savedData) {
      try {
        let parsed = JSON.parse(savedData);
        // Robust automatic migration of legacy names to Doulot Ali Gettop Growth
        const replaceOldRefs = (obj: any): any => {
          if (typeof obj === 'string') {
            return obj
              .replace(/PodcastTopRankMedia/g, 'Doulot Ali Gettop Growth')
              .replace(/podcasttoprankmedia@gmail\.com/g, 'doulotaligettopgrowth@gmail.com');
          } else if (Array.isArray(obj)) {
            return obj.map(replaceOldRefs);
          } else if (obj !== null && typeof obj === 'object') {
            const res: any = {};
            for (const key of Object.keys(obj)) {
              res[key] = replaceOldRefs(obj[key]);
            }
            return res;
          }
          return obj;
        };
        parsed = replaceOldRefs(parsed);
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse saved website data, using defaults', e);
      }
    }

    // Load fresh data from Firestore
    const loadFromFirestore = async () => {
      try {
        const docRef = doc(db, 'configs', 'website_data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as WebsiteData;
          setData(cloudData);
          localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(cloudData));
          console.log('Successfully synced data from Firestore');
        } else {
          console.log('No configurations found in Firestore. Seeding with default data...');
          await setDoc(docRef, DEFAULT_WEBSITE_DATA);
        }
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        
        // Structured Firestore error formatting for system diagnostic tracing
        const errMessage = error instanceof Error ? error.message : String(error);
        const errInfo = {
          error: errMessage,
          operationType: 'get',
          path: 'configs/website_data',
          authInfo: {
            userId: null,
            email: null,
            emailVerified: null,
            isAnonymous: null,
            tenantId: null
          }
        };
        console.error('Firestore Error Info:', JSON.stringify(errInfo));
      }
    };

    loadFromFirestore();

    const loggedIn = localStorage.getItem('podcast_top_rank_admin_logged_in');
    if (loggedIn === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const updateData = (newData: Partial<WebsiteData>) => {
    setData((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(updated));

      // Save to Firestore in the background
      const docRef = doc(db, 'configs', 'website_data');
      setDoc(docRef, updated).catch((err) => {
        console.error('Error saving updated data to Firestore:', err);
        const errMessage = err instanceof Error ? err.message : String(err);
        const errInfo = {
          error: errMessage,
          operationType: 'update',
          path: 'configs/website_data',
          authInfo: {
            userId: null,
            email: null,
            emailVerified: null,
            isAnonymous: null,
            tenantId: null
          }
        };
        console.error('Firestore Error Info (Update):', JSON.stringify(errInfo));
      });

      return updated;
    });
  };

  const resetToDefaults = () => {
    setData(DEFAULT_WEBSITE_DATA);
    localStorage.setItem('podcast_top_rank_media_data', JSON.stringify(DEFAULT_WEBSITE_DATA));

    // Reset in Firestore as well
    const docRef = doc(db, 'configs', 'website_data');
    setDoc(docRef, DEFAULT_WEBSITE_DATA).catch((err) => {
      console.error('Error resetting Firestore data to default:', err);
      const errMessage = err instanceof Error ? err.message : String(err);
      const errInfo = {
        error: errMessage,
        operationType: 'update',
        path: 'configs/website_data',
        authInfo: {
          userId: null,
          email: null,
          emailVerified: null,
          isAnonymous: null,
          tenantId: null
        }
      };
      console.error('Firestore Error Info (Reset):', JSON.stringify(errInfo));
    });
  };

  const login = (password: string): boolean => {
    // Accepts common logical administrative passwords for maximum convenience and robustness
    const normalized = password.trim().toLowerCase();
    if (normalized === 'admin' || normalized === 'gettop' || normalized === 'gettopgrowth' || normalized === 'doulot123') {
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
