import React, { useState, useEffect } from 'react';
import { useWebsiteData } from '../context/WebsiteContext';
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
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ImageUploader from './ImageUploader';

export default function AdminPanel() {
  const {
    data,
    updateData,
    resetToDefaults,
    isAdminPanelOpen,
    setAdminPanelOpen,
    logout
  } = useWebsiteData();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'episodes' | 'pricing' | 'testimonials' | 'team' | 'booking' | 'footer'>('hero');
  const [successMsg, setSuccessMsg] = useState('');

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

  // States for locking/unlocking edit boxes
  const [unlockedFields, setUnlockedFields] = useState<Record<string, boolean>>({});
  const [promptForFieldId, setPromptForFieldId] = useState<{ id: string; label: string } | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleToggleLock = (fieldId: string, label: string) => {
    if (unlockedFields[fieldId]) {
      // If already unlocked, lock it back immediately without password
      setUnlockedFields(prev => ({ ...prev, [fieldId]: false }));
    } else {
      // If locked, open password prompt
      setPromptForFieldId({ id: fieldId, label });
      setPasswordInput('');
      setPasswordError('');
    }
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234' || passwordInput === 'admin') {
      if (promptForFieldId) {
        setUnlockedFields(prev => ({ ...prev, [promptForFieldId.id]: true }));
      }
      setPromptForFieldId(null);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password! Try "1234" or "admin".');
    }
  };

  // Reusable locked field wrapper component
  const LockedField = ({ fieldId, label, children }: { fieldId: string; label: string; children: React.ReactNode; key?: any }) => {
    const isUnlocked = !!unlockedFields[fieldId];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>
          <button
            type="button"
            onClick={() => handleToggleLock(fieldId, label)}
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

  // Sync local states when admin panel opens or website data is loaded/changed
  useEffect(() => {
    if (isAdminPanelOpen) {
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
      
      // Clear all unlocked boxes when entering Admin Panel
      setUnlockedFields({});
    } else {
      // Clear all unlocked boxes when exiting Admin Panel
      setUnlockedFields({});
    }
  }, [isAdminPanelOpen, data]);

  if (!isAdminPanelOpen) return null;

  const handleSave = () => {
    updateData({
      logo: localLogo,
      hero: localHero,
      about: localAbout,
      stats: localStats,
      teamMembers: localTeam,
      episodes: localEpisodes,
      categories: localCategories,
      pricingPlans: localPricing,
      processSteps: localProcess,
      testimonials: localTestimonials,
      testimonialsImage: localTestimonialsImage,
      booking: localBooking,
      bookingPlatforms: localBookingPlatforms,
      contactInfo: localContact,
    });
    setSuccessMsg('All changes successfully saved!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset everything to default? All custom edits will be lost.')) {
      resetToDefaults();
      // Reload states from the reset context
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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden" id="admin-panel-container">
      {/* Top Banner Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-md">
            <Settings className="h-5 w-5 animate-spin-slow text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Doulot Podcast Rank Admin Console</h2>
            <p className="text-xs text-slate-400 hidden sm:block">Customize your website's content instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden md:block text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold px-4 py-2 rounded-full"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
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
                      <div key={cat.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
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
                      <div key={plan.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4 hover:border-violet-500/20 transition-all">
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
                              updated[idx].features = e.target.value.split('\n').filter(f => f.trim() !== '');
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    </div>

                    <LockedField fieldId="contact-copyright" label="©️ Copyright Text (COPYRIGHT INFORMATION)">
                      <input
                        type="text"
                        value={localContact.copyright}
                        onChange={(e) => setLocalContact({ ...localContact, copyright: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-slate-300"
                      />
                    </LockedField>
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

      {/* Password Prompt Modal */}
      <AnimatePresence>
        {promptForFieldId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Unlock Field</h3>
                  <p className="text-xs text-slate-400">You are unlocking: <span className="text-violet-400 font-semibold">{promptForFieldId.label}</span></p>
                </div>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Enter Password</label>
                  <input
                    type="password"
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none placeholder:text-slate-700 font-bold"
                  />
                  {passwordError && (
                    <p className="text-xs text-rose-400 font-medium">{passwordError}</p>
                  )}
                  <p className="text-[10px] text-slate-500 italic">💡 Password is "1234" or "admin".</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPromptForFieldId(null)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 text-xs tracking-wide transition-all active:scale-95 shadow-lg shadow-violet-900/30"
                  >
                    Verify & Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
