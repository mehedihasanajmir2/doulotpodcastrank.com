import React, { useState, useEffect } from 'react';
import { useWebsiteData, DEFAULT_WEBSITE_DATA } from '../context/WebsiteContext';
import {
  X,
  Save,
  RotateCcw,
  LogOut,
  Layout,
  Info,
  Mic,
  DollarSign,
  Users,
  Settings,
  Plus,
  Trash2,
  ListPlus,
  MessageSquare,
  HelpCircle,
  FileText,
  Calendar,
  Lock,
  Unlock,
  Mail,
  MessageCircle,
  ExternalLink,
  Database,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ImageUploader from './ImageUploader';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  isSupabaseConfigured,
  SUPABASE_SQL_SETUP
} from '../lib/supabase';

const AdminPanelContext = React.createContext<{
  unlockedFields: Record<string, boolean>;
  handleToggleLock: (fieldId: string, label: string) => void;
} | null>(null);

const LockedField = ({ fieldId, label, children }: { fieldId: string; label: string; children: React.ReactNode; key?: any }) => {
  const context = React.useContext(AdminPanelContext);
  if (!context) {
    throw new Error('LockedField must be used within an AdminPanelContext.Provider');
  }
  const isUnlocked = !!context.unlockedFields[fieldId];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>
        <button
          type="button"
          onClick={() => context.handleToggleLock(fieldId, label)}
          title={isUnlocked ? "Unlocked (Click to Lock)" : "Locked (Click to Unlock)"}
          className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-all border shrink-0 ${
            isUnlocked 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
          }`}
        >
          {isUnlocked ? (
            <Unlock className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-rose-400" />
          )}
        </button>
      </div>
      <div className={`transition-all duration-300 ${!isUnlocked ? "opacity-40 pointer-events-none select-none" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const {
    data,
    updateData,
    resetToDefaults,
    isAdminPanelOpen,
    setAdminPanelOpen,
    logout,
    firestoreError,
    clearFirestoreError,
    isSyncing,
    bookings,
    bookingsLoading,
    deleteBooking,
    syncWithDatabase,
    isDbConnected
  } = useWebsiteData();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'episodes' | 'pricing' | 'testimonials' | 'team' | 'booking' | 'footer' | 'bookings' | 'database'>('hero');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const defaultBooking = {
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
  };

  const defaultBookingPlatforms = {
    'YouTube': true,
    'Spotify': true,
    'Apple Podcast': true,
    'Google Podcast': true,
    'SoundCloud': true,
    'Not Launched': true
  };

  // Local editable states to avoid re-rendering entire page while typing
  const [localLogo, setLocalLogo] = useState(data.logo);
  const [localHero, setLocalHero] = useState(data.hero);
  const [localAbout, setLocalAbout] = useState(data.about);
  const [localStats, setLocalStats] = useState(data.stats);
  const [localTeam, setLocalTeam] = useState(data.teamMembers);
  const [localEpisodes, setLocalEpisodes] = useState(data.episodes);
  const [localCategories, setLocalCategories] = useState(data.categories);
  const [localPricing, setLocalPricing] = useState(data.pricingPlans);
  const [localProcess, setLocalProcess] = useState(data.processSteps);
  const [localTestimonials, setLocalTestimonials] = useState(data.testimonials);
  const [localTestimonialsImage, setLocalTestimonialsImage] = useState(data.testimonialsImage || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600');
  const [localBooking, setLocalBooking] = useState(data.booking || defaultBooking);
  const [localBookingPlatforms, setLocalBookingPlatforms] = useState(data.bookingPlatforms || defaultBookingPlatforms);
  const [localContact, setLocalContact] = useState(data.contactInfo);
  const [localEmailNotification, setLocalEmailNotification] = useState(data.emailNotification || { enabled: true, recipientEmail: 'doulotaligettopgrowth@gmail.com', web3formKey: '81e529bf-cc0a-4104-b8c3-def656e8d0fb' });

  // States for locking/unlocking edit boxes
  const [unlockedFields, setUnlockedFields] = useState<Record<string, boolean>>({});
  const [hasInitialized, setHasInitialized] = useState(false);

  // Supabase Database Config states
  const [localDbUrl, setLocalDbUrl] = useState(() => getSupabaseCredentials()?.url || '');
  const [localDbKey, setLocalDbKey] = useState(() => getSupabaseCredentials()?.anonKey || '');
  const [copiedSetup, setCopiedSetup] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSetup(true);
    setTimeout(() => setCopiedSetup(false), 2500);
  };

  const handleSaveSupabase = async () => {
    const url = localDbUrl.trim();
    const key = localDbKey.trim();

    if (!url || !key) {
      alert('Please fill out both the Supabase URL and Anon API Key fields.');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('The Supabase URL must start with http:// or https://');
      return;
    }

    saveSupabaseCredentials(url, key);
    setSuccessMsg('Supabase credentials updated! Connecting...');
    setTimeout(() => setSuccessMsg(''), 4000);
    await syncWithDatabase();
  };

  const handleDisconnectSupabase = async () => {
    if (window.confirm('Are you sure you want to disconnect from Supabase and fall back to local storage browser sandbox?')) {
      clearSupabaseCredentials();
      setLocalDbUrl('');
      setLocalDbKey('');
      setSuccessMsg('Disconnected from Supabase! Switched to browser fallback.');
      setTimeout(() => setSuccessMsg(''), 4000);
      await syncWithDatabase();
    }
  };

  // Clear unlocked fields whenever the admin panel open/close state toggles to enforce automatic relocking
  useEffect(() => {
    setUnlockedFields({});
  }, [isAdminPanelOpen]);

  useEffect(() => {
    if (!isAdminPanelOpen) return;
    syncWithDatabase();
  }, [isAdminPanelOpen, activeTab]);

  const handleToggleLock = (fieldId: string, label: string) => {
    if (unlockedFields[fieldId]) {
      // If already unlocked, lock it back immediately
      setUnlockedFields(prev => ({ ...prev, [fieldId]: false }));
      setSuccessMsg(`🔒 ${label} is locked.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      // If locked, unlock it immediately and show success message
      setUnlockedFields(prev => ({ ...prev, [fieldId]: true }));
      setSuccessMsg(`🔓 ${label} unlocked successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Unlocked fields are managed inside state and passed via React context


  // Sync local states when admin panel opens or website data is loaded/changed
  useEffect(() => {
    if (isAdminPanelOpen) {
      if (!hasInitialized) {
        setLocalLogo(data.logo);
        setLocalHero(data.hero);
        setLocalAbout(data.about);
        setLocalStats(data.stats);
        setLocalTeam(data.teamMembers);
        setLocalEpisodes(data.episodes);
        setLocalCategories(data.categories);
        setLocalPricing(data.pricingPlans);
        setLocalProcess(data.processSteps);
        setLocalTestimonials(data.testimonials);
        setLocalTestimonialsImage(data.testimonialsImage || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600');
        setLocalBooking(data.booking || defaultBooking);
        setLocalBookingPlatforms(data.bookingPlatforms || defaultBookingPlatforms);
        setLocalContact(data.contactInfo);
        setLocalEmailNotification(data.emailNotification || { enabled: true, recipientEmail: 'doulotaligettopgrowth@gmail.com', web3formKey: '81e529bf-cc0a-4104-b8c3-def656e8d0fb' });
        
        // Clear all unlocked boxes when entering Admin Panel
        setUnlockedFields({});
        setHasInitialized(true);
      }
    } else {
      // Clear all unlocked boxes when exiting Admin Panel
      setUnlockedFields({});
      setHasInitialized(false);
    }
  }, [isAdminPanelOpen, data, hasInitialized]);

  if (!isAdminPanelOpen) return null;

  const handleSave = () => {
    setIsSaveSuccess(true);
    // Clean up empty lines from pricing features list only when saving
    const cleanedPricing = localPricing.map(plan => ({
      ...plan,
      features: plan.features.filter(f => f.trim() !== '')
    }));

    updateData({
      logo: localLogo,
      hero: localHero,
      about: localAbout,
      stats: localStats,
      teamMembers: localTeam,
      episodes: localEpisodes,
      categories: localCategories,
      pricingPlans: cleanedPricing,
      processSteps: localProcess,
      testimonials: localTestimonials,
      testimonialsImage: localTestimonialsImage,
      booking: localBooking,
      bookingPlatforms: localBookingPlatforms,
      contactInfo: localContact,
      emailNotification: localEmailNotification,
    });
    setSuccessMsg('Changes saved instantly!');
    setTimeout(() => {
      setSuccessMsg('');
      setIsSaveSuccess(false);
    }, 2500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything to default? All custom edits will be lost.')) {
      resetToDefaults();
      // Reload states from the default configuration instantly
      setLocalLogo(DEFAULT_WEBSITE_DATA.logo);
      setLocalHero(DEFAULT_WEBSITE_DATA.hero);
      setLocalAbout(DEFAULT_WEBSITE_DATA.about);
      setLocalStats(DEFAULT_WEBSITE_DATA.stats);
      setLocalTeam(DEFAULT_WEBSITE_DATA.teamMembers);
      setLocalEpisodes(DEFAULT_WEBSITE_DATA.episodes);
      setLocalCategories(DEFAULT_WEBSITE_DATA.categories);
      setLocalPricing(DEFAULT_WEBSITE_DATA.pricingPlans);
      setLocalProcess(DEFAULT_WEBSITE_DATA.processSteps);
      setLocalTestimonials(DEFAULT_WEBSITE_DATA.testimonials);
      setLocalTestimonialsImage(DEFAULT_WEBSITE_DATA.testimonialsImage || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600');
      setLocalBooking(DEFAULT_WEBSITE_DATA.booking || defaultBooking);
      setLocalBookingPlatforms(DEFAULT_WEBSITE_DATA.bookingPlatforms || defaultBookingPlatforms);
      setLocalContact(DEFAULT_WEBSITE_DATA.contactInfo);
      setLocalEmailNotification(DEFAULT_WEBSITE_DATA.emailNotification || { enabled: true, recipientEmail: 'doulotaligettopgrowth@gmail.com', web3formKey: '81e529bf-cc0a-4104-b8c3-def656e8d0fb' });
      setSuccessMsg('Reset to default data completed!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Helper inputs handler
  const updateAboutParagraph = (index: number, val: string) => {
    const updated = [...localAbout.paragraphs];
    updated[index] = val;
    setLocalAbout({ ...localAbout, paragraphs: updated });
  };

  return (
    <AdminPanelContext.Provider value={{ unlockedFields, handleToggleLock }}>
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden" id="admin-panel-container">
      {/* Top Banner Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-md">
            <Settings className="h-5 w-5 animate-spin-slow text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Podcast Ranking Hub Admin Console</h2>
            <p className="text-xs text-slate-400 hidden sm:block">Customize your website's content instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="text-[10px] sm:text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
              >
                <span className="text-emerald-400">✓</span>
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 rounded-full font-bold px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm tracking-wide transition-all shadow-lg active:scale-95 ${
              isSaveSuccess 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-900/10'
            }`}
          >
            {isSaveSuccess ? (
              <>
                <span className="text-sm">✓</span>
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
                <span>{isSyncing ? 'Saving...' : 'Save Changes'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 transition-all active:scale-95"
            title="Reset changes"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 font-bold px-3 py-2 text-xs transition-all active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={() => setAdminPanelOpen(false)}
            className="rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 transition-all"
            title="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Cloud Sync Status/Error Banner */}
      {firestoreError && (
        <div className="bg-rose-500/10 border-b border-rose-500/30 text-rose-200 px-4 py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shrink-0" id="supabase-sync-warning">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-slate-950 font-bold text-[10px]">!</span>
            <div>
              <p className="font-semibold text-rose-300">Supabase Cloud Sync Alert</p>
              <p className="text-slate-300 mt-0.5">{firestoreError}</p>
              <p className="text-slate-400 mt-1">
                Your edits are active and saved safely in your browser's local cache, but syncing to your cloud Supabase database failed.
                Please ensure you have run the required table creation SQL scripts in your Supabase SQL Editor and that your credentials are correct.
              </p>
            </div>
          </div>
          <button 
            onClick={clearFirestoreError}
            className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 shrink-0 font-medium text-xs transition-all"
            id="acknowledge-sync-error"
          >
            Acknowledge
          </button>
        </div>
      )}
      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left Side Tab Navigation */}
        <aside className="w-full md:w-64 shrink-0 border-r border-slate-800 bg-slate-900/40 p-4 space-y-1 overflow-x-auto md:overflow-y-auto flex flex-row md:flex-col gap-2 md:gap-1 scrollbar-none">
          {[
            { id: 'hero', name: 'Logo & Hero Section', icon: Layout },
            { id: 'about', name: 'About & Stats', icon: Info },
            { id: 'episodes', name: 'Podcast & Category', icon: Mic },
            { id: 'pricing', name: 'Pricing Plans & Process', icon: DollarSign },
            { id: 'testimonials', name: 'What They Say (Reviews)', icon: MessageSquare },
            { id: 'team', name: 'Your Podcast Growth Team', icon: Users },
            { id: 'booking', name: 'Book Strategy Session', icon: Calendar },
            { id: 'footer', name: 'Footer & Contacts', icon: FileText },
            { id: 'bookings', name: 'Client Bookings', icon: ListPlus },
            { id: 'database', name: 'Database Setup', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all w-auto md:w-full ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-900/30'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Center Scrollable Form */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-4xl mx-auto space-y-8">


            {/* Logo and Hero Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-violet-900/10 border border-violet-800/20 p-5">
                  <h3 className="text-sm font-bold text-violet-400 mb-1 flex items-center gap-1.5">
                    <span className="text-lg">🔴</span> <span>Change Logo Text</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">These changes will instantly update the logo text across the website headers and footers.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LockedField fieldId="logo-textTop" label="✍️ Logo Main Name (First Name)">
                      <input
                        type="text"
                        value={localLogo.textTop}
                        onChange={(e) => setLocalLogo({ ...localLogo, textTop: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        placeholder="e.g.: Doulot"
                      />
                    </LockedField>
                    <LockedField fieldId="logo-textBottom" label="✍️ Logo Sub Text (Sub Name)">
                      <input
                        type="text"
                        value={localLogo.textBottom}
                        onChange={(e) => setLocalLogo({ ...localLogo, textBottom: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        placeholder="e.g.: Podcast Rank"
                      />
                    </LockedField>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>🌟 Hero Section Layout</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <LockedField fieldId="hero-tagline" label="🔖 Hero Tagline (HERO TAGLINE)">
                      <input
                        type="text"
                        value={localHero.tagline}
                        onChange={(e) => setLocalHero({ ...localHero, tagline: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                      />
                    </LockedField>

                    <LockedField fieldId="hero-title" label="📢 Main Title (MAIN TITLE)">
                      <input
                        type="text"
                        value={localHero.title}
                        onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none font-bold text-slate-100"
                      />
                    </LockedField>

                    <LockedField fieldId="hero-description" label="✍️ Main Description (DESCRIPTION)">
                      <textarea
                        rows={3}
                        value={localHero.description}
                        onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4 text-sm focus:border-violet-500 focus:outline-none leading-relaxed text-slate-200"
                      />
                    </LockedField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LockedField fieldId="hero-buttonText" label="🔘 Button Text (BUTTON TEXT)">
                        <input
                          type="text"
                          value={localHero.buttonText}
                          onChange={(e) => setLocalHero({ ...localHero, buttonText: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </LockedField>
                      <LockedField fieldId="hero-statBadgeText" label="🏅 Round Badge Text (BADGE TEXT)">
                        <input
                          type="text"
                          value={localHero.statBadgeText}
                          onChange={(e) => setLocalHero({ ...localHero, statBadgeText: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </LockedField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <LockedField fieldId="hero-imageLeft" label="🖼️ Left Floating Banner Image">
                        <ImageUploader
                          value={localHero.imageLeft}
                          onChange={(val) => setLocalHero({ ...localHero, imageLeft: val })}
                          label="Upload or Paste URL"
                        />
                      </LockedField>
                      <LockedField fieldId="hero-imageRight" label="🖼️ Right Floating Banner Image">
                        <ImageUploader
                          value={localHero.imageRight}
                          onChange={(val) => setLocalHero({ ...localHero, imageRight: val })}
                          label="Upload or Paste URL"
                        />
                      </LockedField>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About and Stats Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>ℹ️ About Us Section Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LockedField fieldId="about-label" label="🏷️ Section Label (SECTION LABEL)">
                        <input
                          type="text"
                          value={localAbout.label}
                          onChange={(e) => setLocalAbout({ ...localAbout, label: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </LockedField>
                      <LockedField fieldId="about-buttonText" label="🔘 Button Text (BUTTON TEXT)">
                        <input
                          type="text"
                          value={localAbout.buttonText}
                          onChange={(e) => setLocalAbout({ ...localAbout, buttonText: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </LockedField>
                    </div>

                    <LockedField fieldId="about-title" label="📢 Main Title (MAIN TITLE)">
                      <input
                        type="text"
                        value={localAbout.title}
                        onChange={(e) => setLocalAbout({ ...localAbout, title: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none font-bold text-slate-100"
                      />
                    </LockedField>

                    <LockedField fieldId="about-subtitle" label="💡 Subtitle / Slogan (SUBTITLE / SLOGAN)">
                      <input
                        type="text"
                        value={localAbout.subtitle}
                        onChange={(e) => setLocalAbout({ ...localAbout, subtitle: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none font-semibold text-slate-200"
                      />
                    </LockedField>

                    {localAbout.paragraphs.map((para, idx) => (
                      <LockedField key={idx} fieldId={`about-paragraph-${idx}`} label={`📝 Paragraph ${idx + 1}`}>
                        <textarea
                          rows={3}
                          value={para}
                          onChange={(e) => updateAboutParagraph(idx, e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm focus:border-violet-500 focus:outline-none leading-relaxed text-slate-200"
                        />
                      </LockedField>
                    ))}

                    <div className="pt-2">
                      <LockedField fieldId="about-image" label="🖼️ Side Banner Image (About Us Section)">
                        <ImageUploader
                          value={localAbout.image}
                          onChange={(val) => setLocalAbout({ ...localAbout, image: val })}
                          label="Upload or Paste URL"
                        />
                      </LockedField>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>📊 Success Stats / Counter Section</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {localStats.map((stat, idx) => (
                      <div key={idx} className="space-y-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/30 transition-all flex flex-col justify-between">
                        <span className="text-xs font-bold text-violet-400 block border-b border-slate-800 pb-1.5">📈 Stat Card #{idx + 1}</span>
                        <div className="space-y-4 pt-2">
                          <LockedField fieldId={`stat-value-${idx}`} label="🔢 Metric Value">
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const updated = [...localStats];
                                updated[idx].value = e.target.value;
                                setLocalStats(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-sm text-center font-bold text-emerald-400"
                            />
                          </LockedField>
                          <LockedField fieldId={`stat-label-${idx}`} label="📝 Metric Label">
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const updated = [...localStats];
                                updated[idx].label = e.target.value;
                                setLocalStats(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-200"
                            />
                          </LockedField>
                          <LockedField fieldId={`stat-desc-${idx}`} label="DESCRIPTION">
                            <textarea
                              rows={2}
                              value={stat.description}
                              onChange={(e) => {
                                const updated = [...localStats];
                                updated[idx].description = e.target.value;
                                setLocalStats(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-slate-300 leading-normal"
                            />
                          </LockedField>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Episodes and Categories Tab */}
            {activeTab === 'episodes' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>🎙️ Podcast Episodes List</span>
                      </h3>
                      <p className="text-xs text-slate-400">Manage audio or show episodes here.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newEp = {
                          id: `ep-${Date.now()}`,
                          title: 'New Podcast Episode',
                          host: 'Host Name',
                          episodes: 1,
                          category: 'Business',
                          image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=500',
                          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                        };
                        setLocalEpisodes([...localEpisodes, newEp]);
                      }}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>➕ Add New Episode</span>
                    </button>
                  </div>

                  <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                    {localEpisodes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">No episodes found! Click the button above to add a new episode.</div>
                    ) : (
                      localEpisodes.map((ep, idx) => (
                        <div key={ep.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative hover:border-violet-500/40 transition-all">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-violet-400">🎙️ Episode #{idx + 1}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <LockedField fieldId={`ep-title-${ep.id}`} label="📝 Episode Title (Title)">
                              <input
                                type="text"
                                value={ep.title}
                                onChange={(e) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].title = e.target.value;
                                  setLocalEpisodes(updated);
                                }}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs font-bold text-white"
                              />
                            </LockedField>
                            <LockedField fieldId={`ep-host-${ep.id}`} label="👤 Host Name (Host Name)">
                              <input
                                type="text"
                                value={ep.host}
                                onChange={(e) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].host = e.target.value;
                                  setLocalEpisodes(updated);
                                }}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200"
                              />
                            </LockedField>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <LockedField fieldId={`ep-category-${ep.id}`} label="📁 Category (Category)">
                              <input
                                type="text"
                                value={ep.category}
                                onChange={(e) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].category = e.target.value;
                                  setLocalEpisodes(updated);
                                }}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200"
                              />
                            </LockedField>
                            <LockedField fieldId={`ep-episodes-${ep.id}`} label="🔢 Episode Number (Episode No)">
                              <input
                                type="number"
                                value={ep.episodes}
                                onChange={(e) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].episodes = parseInt(e.target.value) || 0;
                                  setLocalEpisodes(updated);
                                }}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-200"
                              />
                            </LockedField>
                            <LockedField fieldId={`ep-image-${ep.id}`} label="🖼️ Cover Image">
                              <ImageUploader
                                value={ep.image}
                                onChange={(val) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].image = val;
                                  setLocalEpisodes(updated);
                                }}
                                label="Upload/URL"
                              />
                            </LockedField>
                          </div>

                          <LockedField fieldId={`ep-audioUrl-${ep.id}`} label="🎵 MP3 Audio URL / Link">
                            <input
                              type="text"
                              value={ep.audioUrl}
                              onChange={(e) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].audioUrl = e.target.value;
                                  setLocalEpisodes(updated);
                                }}
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-slate-400 font-mono"
                              placeholder="https://example.com/audio.mp3"
                            />
                          </LockedField>

                          {/* Delete Button */}
                          <div className="flex justify-end pt-2 border-t border-slate-800/60">
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this episode?')) {
                                  setLocalEpisodes(localEpisodes.filter(item => item.id !== ep.id));
                                }
                              }}
                              className="inline-flex items-center gap-1 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all border border-rose-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>🗑️ Delete Episode</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>📂 Podcast Categories</span>
                  </h3>
                  <div className="space-y-4">
                    {localCategories.map((cat, idx) => (
                      <div key={`category-${idx}`} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <span className="text-xs font-bold text-violet-400">📁 Category {idx + 1}: {cat.name}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          <LockedField fieldId={`cat-name-${idx}`} label="📝 Category Name (NAME)">
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => {
                                const updated = [...localCategories];
                                updated[idx].name = e.target.value;
                                setLocalCategories(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-bold"
                            />
                          </LockedField>
                          <LockedField fieldId={`cat-tagline-${idx}`} label="🎯 Category Slogan (TAGLINE)">
                            <input
                              type="text"
                              value={cat.tagline}
                              onChange={(e) => {
                                const updated = [...localCategories];
                                updated[idx].tagline = e.target.value;
                                setLocalCategories(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200"
                            />
                          </LockedField>
                        </div>
                        <LockedField fieldId={`cat-description-${idx}`} label="✍️ Category Description (DESCRIPTION)">
                          <textarea
                            rows={2}
                            value={cat.description}
                            onChange={(e) => {
                              const updated = [...localCategories];
                              updated[idx].description = e.target.value;
                              setLocalCategories(updated);
                            }}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 leading-normal"
                          />
                        </LockedField>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing and Process Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>💵 Our Service Pricing Plans</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {localPricing.map((plan, idx) => (
                      <div key={`pricing-${idx}`} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-violet-500/20 transition-all">
                        <span className="text-xs font-bold text-violet-400">💵 Package #{idx + 1}: {plan.name}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <LockedField fieldId={`pricing-name-${idx}`} label="🎁 Plan Name (PLAN NAME)">
                            <input
                              type="text"
                              value={plan.name}
                              onChange={(e) => {
                                const updated = [...localPricing];
                                updated[idx].name = e.target.value;
                                setLocalPricing(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-bold text-white"
                            />
                          </LockedField>
                          <LockedField fieldId={`pricing-price-${idx}`} label="💰 Plan Price (PRICE $)">
                            <input
                              type="number"
                              value={plan.price}
                              onChange={(e) => {
                                const updated = [...localPricing];
                                updated[idx].price = parseInt(e.target.value) || 0;
                                setLocalPricing(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-bold text-white"
                            />
                          </LockedField>
                        </div>

                        <LockedField fieldId={`pricing-description-${idx}`} label="✍️ Plan Description (DESCRIPTION)">
                          <textarea
                            rows={2}
                            value={plan.description}
                            onChange={(e) => {
                              const updated = [...localPricing];
                              updated[idx].description = e.target.value;
                              setLocalPricing(updated);
                            }}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 leading-normal"
                          />
                        </LockedField>

                        <LockedField fieldId={`pricing-features-${idx}`} label="🚀 Package Features (FEATURES LIST) - Write one per line">
                          <textarea
                            rows={4}
                            value={plan.features.join('\n')}
                            onChange={(e) => {
                              const updated = [...localPricing];
                              updated[idx].features = e.target.value.split('\n');
                              setLocalPricing(updated);
                            }}
                            placeholder="e.g.:&#10;5 New Episodes Edited&#10;Free Cover Art Design&#10;Social Media Promotion"
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 leading-relaxed font-sans"
                          />
                        </LockedField>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>💡 Our Services / Process Steps</span>
                  </h3>
                  <div className="space-y-4">
                    {localProcess.map((step, idx) => (
                      <div key={step.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                        <span className="text-xs font-bold text-violet-400">💡 Step #{idx + 1}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <LockedField fieldId={`step-title-${step.id}`} label="📝 Step Title / Name (TITLE)">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const updated = [...localProcess];
                                updated[idx].title = e.target.value;
                                setLocalProcess(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-bold text-white"
                            />
                          </LockedField>
                          <LockedField fieldId={`step-image-${step.id}`} label="🖼️ Step Circle Image (Step Image)">
                            <ImageUploader
                              value={step.image}
                              onChange={(val) => {
                                const updated = [...localProcess];
                                updated[idx].image = val;
                                setLocalProcess(updated);
                              }}
                              label="Upload/URL"
                            />
                          </LockedField>
                        </div>
                        <LockedField fieldId={`step-description-${step.id}`} label="✍️ Step Description (DESCRIPTION)">
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const updated = [...localProcess];
                              updated[idx].description = e.target.value;
                              setLocalProcess(updated);
                            }}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-slate-300 leading-normal"
                          />
                        </LockedField>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials and Team Tab */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                {/* Testimonial Section Main Photo */}
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span>🖼️ "What They Say" Section Main Image (ডান পাশের মূল ছবি)</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      "What they say about us" সেকশনের ডান পাশে যে মূল বড় ছবিটি রয়েছে, তা এখান থেকে পরিবর্তন করুন। নিচে ছবি আপলোড বা ওয়েবলিঙ্ক দিয়ে উপরের ডান কোনার <strong className="text-emerald-400">"Save Changes"</strong> বাটনে ক্লিক করে সেভ করুন।
                    </p>
                    <LockedField fieldId="testimonials-image" label="🖼️ Section Side Image (ডান পাশের ছবি)">
                      <ImageUploader
                        value={localTestimonialsImage}
                        onChange={(val) => setLocalTestimonialsImage(val)}
                        label="Upload or Paste URL"
                      />
                    </LockedField>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>💬 Client Reviews & Testimonials</span>
                      </h3>
                      <p className="text-xs text-slate-400">View your client reviews, reply to them, or delete reviews from your system.</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    {localTestimonials.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">No reviews found!</div>
                    ) : (
                      localTestimonials.map((test, idx) => (
                        <div key={test.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 relative hover:border-violet-500/20 transition-all">
                          <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
                            <span className="text-xs font-bold text-violet-400">💬 Review #{idx + 1}</span>
                            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800 text-[10px] text-amber-400 font-bold">
                              <span>{'★'.repeat(test.stars)}{'☆'.repeat(5 - test.stars)}</span>
                              <span className="text-slate-400 font-normal">({test.stars}/5)</span>
                            </div>
                          </div>

                          {/* Read-only client info layout */}
                          <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                            <img
                              src={test.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                              alt={test.name}
                              className="h-10 w-10 rounded-full object-cover border border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-white">{test.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{test.role}</div>
                            </div>
                          </div>

                          {/* Client's quote (Read-only) */}
                          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/40 text-xs text-slate-300 italic leading-relaxed">
                            “{test.quote}”
                          </div>

                          {/* Editable Reply Section */}
                          <LockedField fieldId={`testimonial-reply-${test.id}`} label="💬 Your Admin Reply (Response)">
                            <textarea
                              rows={2}
                              value={test.reply || ''}
                              onChange={(e) => {
                                const updated = [...localTestimonials];
                                updated[idx] = { ...test, reply: e.target.value };
                                setLocalTestimonials(updated);
                              }}
                              placeholder="Write a professional response to this client review..."
                              className="w-full rounded-lg bg-slate-950 border border-emerald-900/40 p-2.5 text-xs text-emerald-300 leading-normal focus:border-emerald-500 focus:outline-none placeholder:text-emerald-900/50"
                            />
                          </LockedField>

                          <div className="flex justify-end pt-2 border-t border-slate-800/50">
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this review?')) {
                                  setLocalTestimonials(localTestimonials.filter(item => item.id !== test.id));
                                }
                              }}
                              className="inline-flex items-center gap-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>🗑️ Delete Review</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Team Members Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>👥 Your Podcast Growth Team</span>
                      </h3>
                      <p className="text-xs text-slate-400">Manage team member details, profile photos, and social links for your growth team.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newMem = {
                          name: 'Team Member Name',
                          role: 'SEO Specialist',
                          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500',
                          socials: { facebook: '#', linkedin: '#', instagram: '#' }
                        };
                        setLocalTeam([...localTeam, newMem]);
                      }}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>➕ Add New Team Member</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {localTeam.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">No team members found! Click the button above to add a team member.</div>
                    ) : (
                      localTeam.map((mem, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 relative hover:border-violet-500/20 transition-all">
                          <span className="text-xs font-bold text-violet-400">👥 Team Member #{idx + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <LockedField fieldId={`team-name-${idx}`} label="👤 Member Name (MEMBER NAME)">
                              <input
                                type="text"
                                value={mem.name}
                                onChange={(e) => {
                                  const updated = [...localTeam];
                                  updated[idx].name = e.target.value;
                                  setLocalTeam(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-bold text-white"
                              />
                            </LockedField>
                            <LockedField fieldId={`team-role-${idx}`} label="💼 Role / Designation (ROLE / DESIGNATION)">
                              <input
                                type="text"
                                value={mem.role}
                                onChange={(e) => {
                                  const updated = [...localTeam];
                                  updated[idx].role = e.target.value;
                                  setLocalTeam(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200"
                              />
                            </LockedField>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <LockedField fieldId={`team-facebook-${idx}`} label="🔗 Facebook URL">
                              <input
                                type="text"
                                value={mem.socials?.facebook || ''}
                                onChange={(e) => {
                                  const updated = [...localTeam];
                                  updated[idx].socials = { ...updated[idx].socials, facebook: e.target.value };
                                  setLocalTeam(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300"
                                placeholder="#"
                              />
                            </LockedField>
                            <LockedField fieldId={`team-linkedin-${idx}`} label="🔗 LinkedIn URL">
                              <input
                                type="text"
                                value={mem.socials?.linkedin || ''}
                                onChange={(e) => {
                                  const updated = [...localTeam];
                                  updated[idx].socials = { ...updated[idx].socials, linkedin: e.target.value };
                                  setLocalTeam(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300"
                                placeholder="#"
                              />
                            </LockedField>
                            <LockedField fieldId={`team-instagram-${idx}`} label="🔗 Instagram URL">
                              <input
                                type="text"
                                value={mem.socials?.instagram || ''}
                                onChange={(e) => {
                                  const updated = [...localTeam];
                                  updated[idx].socials = { ...updated[idx].socials, instagram: e.target.value };
                                  setLocalTeam(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300"
                                placeholder="#"
                              />
                            </LockedField>
                          </div>

                          <LockedField fieldId={`team-image-${idx}`} label="TEAM MEMBER PHOTO">
                            <ImageUploader
                              value={mem.image}
                              onChange={(val) => {
                                const updated = [...localTeam];
                                updated[idx].image = val;
                                setLocalTeam(updated);
                              }}
                              label="Upload or Paste URL"
                            />
                          </LockedField>

                          {/* Delete Button */}
                          <div className="flex justify-end pt-2 border-t border-slate-800/60">
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this team member?')) {
                                  setLocalTeam(localTeam.filter((_, i) => i !== idx));
                                }
                              }}
                              className="inline-flex items-center gap-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all border border-rose-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>🗑️ Delete Member</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

             {/* Book Strategy Session Tab */}
            {activeTab === 'booking' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-6">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>🎯 Manage Target Platforms</span>
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose which platforms are active for your strategy services. Unchecking a platform will temporarily hide it from the <strong>Book Strategy Session</strong> modal form so clients cannot select it.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {[
                      { name: 'YouTube', desc: 'YouTube Video & Audio Podcasts' },
                      { name: 'Spotify', desc: 'Spotify Podcast Directories' },
                      { name: 'Apple Podcast', desc: 'Apple Podcasts Directory' },
                      { name: 'Google Podcast', desc: 'Google Podcasts Platform' },
                      { name: 'SoundCloud', desc: 'SoundCloud Audio Sharing' },
                      { name: 'Not Launched', desc: 'New Shows not launched yet' }
                    ].map((plat) => {
                      const isEnabled = localBookingPlatforms[plat.name] !== false;
                      return (
                        <div 
                          key={plat.name}
                          onClick={() => {
                            setLocalBookingPlatforms({
                              ...localBookingPlatforms,
                              [plat.name]: !isEnabled
                            });
                          }}
                          className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative flex flex-col justify-between select-none ${
                            isEnabled 
                              ? 'border-violet-500 bg-violet-600/10 text-white shadow-lg shadow-violet-500/5' 
                              : 'border-slate-800 bg-slate-950/40 text-slate-400 opacity-60 hover:opacity-100 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">
                              {plat.name}
                            </h4>
                            <p className="text-[11px] text-slate-400">{plat.desc}</p>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {isEnabled ? '● Active' : '○ Inactive'}
                            </span>
                            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${isEnabled ? 'bg-violet-500' : 'bg-slate-800'}`}>
                              <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Footer and Contacts Tab */}
            {activeTab === 'footer' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>📞 Contact Details & Social Links</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LockedField fieldId="contact-email" label="📧 Official Email Address (EMAIL ADDRESS)">
                        <input
                          type="email"
                          value={localContact.email}
                          onChange={(e) => setLocalContact({ ...localContact, email: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </LockedField>
                      <LockedField fieldId="contact-phone" label="📞 Phone Number / WhatsApp (PHONE NUMBER)">
                        <input
                          type="text"
                          value={localContact.phone}
                          onChange={(e) => setLocalContact({ ...localContact, phone: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </LockedField>
                    </div>

                    <LockedField fieldId="contact-address" label="📍 Office Address (OFFICE ADDRESS)">
                      <input
                        type="text"
                        value={localContact.address}
                        onChange={(e) => setLocalContact({ ...localContact, address: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                      />
                    </LockedField>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <LockedField fieldId="contact-facebook" label="🔗 Facebook Profile Link (FACEBOOK URL)">
                        <input
                          type="text"
                          value={localContact.facebook}
                          onChange={(e) => setLocalContact({ ...localContact, facebook: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </LockedField>
                      <LockedField fieldId="contact-instagram" label="🔗 Instagram Profile Link (INSTAGRAM URL)">
                        <input
                          type="text"
                          value={localContact.instagram}
                          onChange={(e) => setLocalContact({ ...localContact, instagram: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </LockedField>
                      <LockedField fieldId="contact-twitter" label="🔗 X / Twitter Profile Link (X / TWITTER URL)">
                        <input
                          type="text"
                          value={localContact.twitter}
                          onChange={(e) => setLocalContact({ ...localContact, twitter: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </LockedField>
                      <LockedField fieldId="contact-linkedin" label="🔗 LinkedIn Profile Link (LINKEDIN URL)">
                        <input
                          type="text"
                          value={localContact.linkedin || ''}
                          onChange={(e) => setLocalContact({ ...localContact, linkedin: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </LockedField>
                    </div>

                    <LockedField fieldId="contact-copyright" label="©️ Copyright Text (COPYRIGHT INFORMATION)">
                      <input
                        type="text"
                        value={localContact.copyright}
                        onChange={(e) => setLocalContact({ ...localContact, copyright: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-slate-300"
                      />
                    </LockedField>

                    {/* Automated Email Notifications Card */}
                    <div className="border border-slate-800/80 rounded-2xl bg-slate-950/40 p-5 mt-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>📧</span> <span>Automated Email Notifications (Gmail / Business Mail)</span>
                          </h4>
                          <p className="text-[11px] text-slate-400">Receive copies of all incoming client order bookings automatically.</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold ${localEmailNotification.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {localEmailNotification.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setLocalEmailNotification({ ...localEmailNotification, enabled: !localEmailNotification.enabled })}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${localEmailNotification.enabled ? 'bg-violet-500' : 'bg-slate-800'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${localEmailNotification.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>

                      {localEmailNotification.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Recipient Email Address</label>
                            <input
                              type="email"
                              value={localEmailNotification.recipientEmail}
                              onChange={(e) => setLocalEmailNotification({ ...localEmailNotification, recipientEmail: e.target.value })}
                              placeholder="e.g. yourbusiness@gmail.com"
                              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-slate-200"
                            />
                            <p className="text-[10px] text-slate-500">The destination email address where order notifications will be dispatched.</p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                              <span>Web3Forms Access Key</span>
                              <a 
                                href="https://web3forms.com/" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] text-violet-400 hover:underline hover:text-violet-300 normal-case font-medium flex items-center gap-0.5"
                              >
                                Get Free Key ↗
                              </a>
                            </label>
                            <input
                              type="text"
                              value={localEmailNotification.web3formKey}
                              onChange={(e) => setLocalEmailNotification({ ...localEmailNotification, web3formKey: e.target.value })}
                              placeholder="e.g. cb92b102-18da-48c6-bf10-3949f508c903"
                              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-mono focus:border-violet-500 focus:outline-none text-slate-200"
                            />
                            <p className="text-[10px] text-slate-500">Necessary to bypass secure server restrictions. Create a free key in 5 seconds via Web3Forms.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Bookings list Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6" id="admin-bookings-tab">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                        <span className="text-xl">📋</span> <span>Client Booking Requests</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Review direct consultations, podcast details, selected plans, and contact tokens.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={syncWithDatabase}
                      disabled={bookingsLoading}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {bookingsLoading ? 'Refreshing...' : '🔄 Refresh List'}
                    </button>
                  </div>

                  {bookingsLoading ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
                      <p className="text-xs text-slate-400">Loading strategy bookings from Database...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                      <span className="text-4xl block mb-2">🎈</span>
                      <h4 className="text-sm font-bold text-slate-300">No Booking Submissions Yet</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        When clients book strategy session audit on your website, their detailed requirements and contact tokens will show up here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking, index) => {
                        const dateFormatted = booking.createdAt 
                          ? new Date(booking.createdAt).toLocaleString() 
                          : 'Unknown Date';
                          
                        return (
                          <div 
                            key={booking.id || index}
                            className="border border-slate-800 bg-slate-900/60 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 relative overflow-hidden"
                          >
                            {/* Decorative line */}
                            <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b from-violet-600 to-indigo-600" />
                            
                            {/* Top info row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded-lg">
                                    {booking.token || booking.id || 'N/A'}
                                  </span>
                                  <h4 className="text-sm font-black text-white">{booking.name}</h4>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  Submitted: <span className="text-slate-300 font-medium">{dateFormatted}</span>
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-2">
                                {/* Delete action */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this booking? This action is permanent.')) {
                                      deleteBooking(booking.id);
                                    }
                                  }}
                                  className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-950/30 border border-rose-900/30 text-rose-400 hover:bg-rose-900/30 transition-all"
                                  title="Delete Booking record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Grid details block */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Email Address</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-200 font-semibold truncate block">{booking.email}</span>
                                  <a 
                                    href={`mailto:${booking.email}`}
                                    className="text-violet-400 hover:text-violet-300 shrink-0"
                                    title="Send client an email"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Preferred Contact</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-300 font-bold">{booking.contactType || 'WhatsApp'}</span>
                                  {booking.contactValue && (
                                    <>
                                      <span className="text-slate-400 font-medium font-mono truncate max-w-[120px]">({booking.contactValue})</span>
                                      {booking.contactType === 'WhatsApp' ? (
                                        <a 
                                          href={`https://wa.me/${booking.contactValue.replace(/[^0-9]/g, '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-400 hover:text-emerald-300 shrink-0"
                                          title="Open WhatsApp chat"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      ) : (
                                        <span className="text-slate-500 shrink-0">💬</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Selected Interest / Plan</span>
                                <span className="text-cyan-400 font-bold block truncate">{booking.selectedPlan || 'Free Audit'}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Podcast Platform</span>
                                <span className="text-slate-300 font-medium block">{booking.platform || 'Not Launched'}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Current Monthly Downloads</span>
                                <span className="text-indigo-400 font-semibold block">{booking.monthlyDownloads || '0'}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Podcast Name / ID</span>
                                <span className="text-violet-400 font-bold block truncate">{booking.podcastName || 'None'}</span>
                              </div>
                            </div>

                            {/* Message / Requirement detail */}
                            {booking.message && (
                              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 text-xs">
                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-black block mb-1">
                                  Client Message / Goals:
                                </span>
                                <p className="text-slate-300 leading-relaxed font-sans">{booking.message}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Database Setup Tab */}
            {activeTab === 'database' && (
              <div className="space-y-6" id="admin-database-tab">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-6">
                  {/* Tab Title */}
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <Database className="h-5 w-5 text-violet-400" />
                      <span>Configure Supabase Cloud Database</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Integrate with Supabase for absolute lifetime persistence of your website configs, customization changes, and customer booking details—entirely free of charge!
                    </p>
                  </div>

                  {/* Dynamic Status Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-800 bg-slate-950/40 rounded-xl p-4 flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${isSupabaseConfigured() && isDbConnected ? 'bg-emerald-500 animate-pulse' : isSupabaseConfigured() ? 'bg-amber-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`} />
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Database Mode</span>
                        <span className="text-xs font-bold text-slate-200">
                          {isSupabaseConfigured() && isDbConnected ? 'Cloud Production Server' : isSupabaseConfigured() ? 'Cloud Connection Error' : 'Offline Sandbox Fallback'}
                        </span>
                      </div>
                    </div>

                    <div className="border border-slate-800 bg-slate-950/40 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-lg">⚡</span>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Provider Tier</span>
                        <span className="text-xs font-bold text-violet-400">100% Free Lifetime Tier</span>
                      </div>
                    </div>

                    <div className="border border-slate-800 bg-slate-950/40 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-lg">🔄</span>
                      <div>
                        <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Synchronization</span>
                        <span className="text-xs font-bold text-slate-200">
                          {isSupabaseConfigured() && isDbConnected ? 'Active Realtime Cloud' : 'Browser LocalStorage'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Credentials Section */}
                  <div className="space-y-4">
                    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>🔑</span> <span>Supabase Connection API Credentials</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Input your Project URL and Anon API key to sync this website and bookings automatically to the cloud. Keep your keys secret.
                      </p>

                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">Supabase API URL</label>
                          <input
                            type="text"
                            value={localDbUrl}
                            onChange={(e) => setLocalDbUrl(e.target.value)}
                            placeholder="e.g.: https://your-project-id.supabase.co"
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-mono text-slate-200 focus:border-violet-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">Supabase Anon Public API Key</label>
                          <input
                            type="password"
                            value={localDbKey}
                            onChange={(e) => setLocalDbKey(e.target.value)}
                            placeholder="e.g.: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdGNo..."
                            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-mono text-slate-200 focus:border-violet-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={handleSaveSupabase}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Link & Sync Supabase Database</span>
                        </button>

                        {isSupabaseConfigured() && (
                          <button
                            type="button"
                            onClick={handleDisconnectSupabase}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/10 border border-rose-900/30 hover:bg-rose-950/30 active:scale-95 transition-all"
                          >
                            Disconnect Cloud Database
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SQL Setup Instructions */}
                  <div className="space-y-4">
                    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>🛠️</span> <span>First Time SQL Setup Instructions</span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Follow these simple 5 steps to establish the permanent database tables in Supabase:
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopySQL}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                        >
                          {copiedSetup ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedSetup ? 'Copied!' : 'Copy SQL Query'}</span>
                        </button>
                      </div>

                      <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1">
                        <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">supabase.com</a> and sign up for a 100% free lifetime account.</li>
                        <li>Create a new project (choose any project name and database password).</li>
                        <li>Once the project is initialized, click on the <span className="text-violet-400 font-bold">"SQL Editor"</span> tab on the left sidebar in your Supabase dashboard.</li>
                        <li>Click <span className="text-violet-400 font-bold">"New query"</span>, paste the copied SQL setup script below, and click <span className="text-violet-400 font-bold">"Run"</span>.</li>
                        <li>Go to <span className="text-violet-400 font-bold">"Project Settings" ➔ "API"</span> in your Supabase dashboard, copy your <span className="font-bold">Project URL</span> and <span className="font-bold">anon/public API key</span>, and paste them into the connection fields above!</li>
                      </ol>

                      <div className="space-y-1.5 pt-2">
                        <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider font-sans">SQL Setup Script</span>
                        <pre className="w-full h-40 rounded-xl bg-slate-950 border border-slate-800 p-4 text-[11px] font-mono text-slate-300 overflow-y-auto leading-relaxed select-all">
                          {SUPABASE_SQL_SETUP}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Save Reminder for Mobile */}
      <div className="md:hidden shrink-0 border-t border-slate-800 bg-slate-900 p-3 flex justify-between items-center gap-4">
        <span className="text-[11px] text-slate-400">Save changes to update the live preview</span>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs tracking-wide shadow-md shadow-emerald-900/20"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Password Prompt Modal is no longer needed since lock/unlock is instantaneous */}

    </div>
    </AdminPanelContext.Provider>
  );
}
