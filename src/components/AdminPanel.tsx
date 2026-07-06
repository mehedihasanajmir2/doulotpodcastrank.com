import React, { useState } from 'react';
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
  FileText
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

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'episodes' | 'pricing' | 'testimonials' | 'team' | 'footer'>('hero');
  const [successMsg, setSuccessMsg] = useState('');

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
  const [localContact, setLocalContact] = useState(data.contactInfo);

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
            <h2 className="text-base sm:text-lg font-bold tracking-tight">Gettop Growth Admin Console</h2>
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
            { id: 'testimonials', name: 'Client Reviews', icon: MessageSquare },
            { id: 'team', name: 'Your Podcast Growth Team', icon: Users },
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
            {/* Easy Guide Banner */}
            <div className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-2">
                  <span>✨ Easy Content Editing Guide (Super Simple Steps)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Enter your new text or upload images in any input box below. <br />
                  2. Click the large green <strong className="text-emerald-400">"Save Changes"</strong> button at the top-right corner to instantly update the live website!
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl animate-bounce">
                🎉
              </div>
            </div>

            {/* Logo and Hero Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-violet-900/10 border border-violet-800/20 p-5">
                  <h3 className="text-sm font-bold text-violet-400 mb-1 flex items-center gap-1.5">
                    <span className="text-lg">🔴</span> <span>Change Logo Text</span>
                  </h3>
                  <p className="text-xs text-slate-400">These changes will instantly update the logo text across the website headers and footers.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">✍️ Logo Main Name (First Name)</label>
                      <input
                        type="text"
                        value={localLogo.textTop}
                        onChange={(e) => setLocalLogo({ ...localLogo, textTop: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        placeholder="e.g.: Doulot Ali"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">✍️ Logo Sub Text (Sub Name)</label>
                      <input
                        type="text"
                        value={localLogo.textBottom}
                        onChange={(e) => setLocalLogo({ ...localLogo, textBottom: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        placeholder="e.g.: Gettop Growth"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>🌟 Hero Section Layout</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">🔖 Hero Tagline (HERO TAGLINE)</label>
                      <input
                        type="text"
                        value={localHero.tagline}
                        onChange={(e) => setLocalHero({ ...localHero, tagline: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">📢 Main Title (MAIN TITLE)</label>
                      <input
                        type="text"
                        value={localHero.title}
                        onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none font-bold text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">✍️ Main Description (DESCRIPTION)</label>
                      <textarea
                        rows={3}
                        value={localHero.description}
                        onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4 text-sm focus:border-violet-500 focus:outline-none leading-relaxed text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🔘 Main Button Text (BUTTON TEXT)</label>
                        <input
                          type="text"
                          value={localHero.buttonText}
                          onChange={(e) => setLocalHero({ ...localHero, buttonText: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🏅 Round Badge Text (BADGE TEXT)</label>
                        <input
                          type="text"
                          value={localHero.statBadgeText}
                          onChange={(e) => setLocalHero({ ...localHero, statBadgeText: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <ImageUploader
                        value={localHero.imageLeft}
                        onChange={(val) => setLocalHero({ ...localHero, imageLeft: val })}
                        label="🖼️ Left Floating Banner Image"
                      />
                      <ImageUploader
                        value={localHero.imageRight}
                        onChange={(val) => setLocalHero({ ...localHero, imageRight: val })}
                        label="🖼️ Right Floating Banner Image"
                      />
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
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🏷️ Section Label (SECTION LABEL)</label>
                        <input
                          type="text"
                          value={localAbout.label}
                          onChange={(e) => setLocalAbout({ ...localAbout, label: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🔘 Button Text (BUTTON TEXT)</label>
                        <input
                          type="text"
                          value={localAbout.buttonText}
                          onChange={(e) => setLocalAbout({ ...localAbout, buttonText: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">📢 Main Title (MAIN TITLE)</label>
                      <input
                        type="text"
                        value={localAbout.title}
                        onChange={(e) => setLocalAbout({ ...localAbout, title: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none font-bold text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">💡 Subtitle / Slogan (SUBTITLE / SLOGAN)</label>
                      <input
                        type="text"
                        value={localAbout.subtitle}
                        onChange={(e) => setLocalAbout({ ...localAbout, subtitle: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none font-semibold text-slate-200"
                      />
                    </div>

                    {localAbout.paragraphs.map((para, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-300">📝 Paragraph {idx + 1}</label>
                        <textarea
                          rows={3}
                          value={para}
                          onChange={(e) => updateAboutParagraph(idx, e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm focus:border-violet-500 focus:outline-none leading-relaxed text-slate-200"
                        />
                      </div>
                    ))}

                    <div className="pt-2">
                      <ImageUploader
                        value={localAbout.image}
                        onChange={(val) => setLocalAbout({ ...localAbout, image: val })}
                        label="🖼️ Side Banner Image (About Us Section)"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>📊 Success Stats / Counter Section</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {localStats.map((stat, idx) => (
                      <div key={idx} className="space-y-3 p-4 rounded-xl bg-slate-900 border-2 border-slate-800/80 hover:border-violet-500/30 transition-all">
                        <span className="text-xs font-bold text-violet-400 block border-b border-slate-800 pb-1.5">📈 Stat Card #{idx + 1}</span>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">🔢 Metric Value (VALUE)</label>
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
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">📝 Metric Label (LABEL)</label>
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
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1">DESCRIPTION</label>
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
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1.5">📝 Episode Title (Title)</label>
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
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1.5">👤 Host Name (Host Name)</label>
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
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1.5">📁 Category (Category)</label>
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
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1.5">🔢 Episode Number (Episode No)</label>
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
                            </div>
                            <div>
                              <ImageUploader
                                value={ep.image}
                                onChange={(val) => {
                                  const updated = [...localEpisodes];
                                  updated[idx].image = val;
                                  setLocalEpisodes(updated);
                                }}
                                label="🖼️ Episode Cover Image"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5">🎵 MP3 Audio URL / Link</label>
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
                          </div>

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
                      <div key={cat.name} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-violet-400">📁 Category {idx + 1}: {cat.name}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 mb-1">📝 Category Name (NAME)</label>
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
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 mb-1">🎯 Category Slogan (TAGLINE)</label>
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
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">✍️ Category Description (DESCRIPTION)</label>
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
                        </div>
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
                      <div key={plan.name} className="p-4 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-3 hover:border-violet-500/20 transition-all">
                        <span className="text-xs font-bold text-violet-400">💵 Package #{idx + 1}: {plan.name}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">🎁 Plan Name (PLAN NAME)</label>
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
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">💰 Plan Price (PRICE $)</label>
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
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">✍️ Plan Description (DESCRIPTION)</label>
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
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">🚀 Package Features (FEATURES LIST) - <span className="text-violet-400">Write one feature per line</span></label>
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
                        </div>
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
                      <div key={step.id} className="p-4 rounded-xl bg-slate-900 border-2 border-slate-800 space-y-3">
                        <span className="text-xs font-bold text-violet-400">💡 Step #{idx + 1}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">📝 Step Title / Name (TITLE)</label>
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
                          </div>
                          <div>
                            <ImageUploader
                              value={step.image}
                              onChange={(val) => {
                                const updated = [...localProcess];
                                updated[idx].image = val;
                                setLocalProcess(updated);
                              }}
                              label="🖼️ Step Circle Image (Step Image)"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">✍️ Step Description (DESCRIPTION)</label>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials and Team Tab */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>💬 Client Reviews & Testimonials</span>
                      </h3>
                      <p className="text-xs text-slate-400">Edit, add, or remove nice testimonials from your clients here.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newTest = {
                          id: Date.now(),
                          name: 'New Client Name',
                          role: 'Founder / Creator',
                          quote: 'Amazing service! Their work significantly amplified our brand growth.',
                          stars: 5,
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                        };
                        setLocalTestimonials([...localTestimonials, newTest]);
                      }}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>➕ Add New Review</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {localTestimonials.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs">No reviews found! Click the button above to add a review.</div>
                    ) : (
                      localTestimonials.map((test, idx) => (
                        <div key={test.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative hover:border-violet-500/20 transition-all">
                          <span className="text-xs font-bold text-violet-400">💬 Review #{idx + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">👤 Client Name (CLIENT NAME)</label>
                              <input
                                type="text"
                                value={test.name}
                                onChange={(e) => {
                                  const updated = [...localTestimonials];
                                  updated[idx].name = e.target.value;
                                  setLocalTestimonials(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-bold text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">💼 Role / Designation (ROLE / DESIGNATION)</label>
                              <input
                                type="text"
                                value={test.role}
                                onChange={(e) => {
                                  const updated = [...localTestimonials];
                                  updated[idx].role = e.target.value;
                                  setLocalTestimonials(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">⭐ Star Rating (STARS 1-5)</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={test.stars}
                                onChange={(e) => {
                                  const updated = [...localTestimonials];
                                  updated[idx].stars = parseInt(e.target.value) || 5;
                                  setLocalTestimonials(updated);
                                }}
                                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white font-bold"
                              />
                            </div>
                            <div>
                              <ImageUploader
                                value={test.avatar}
                                onChange={(val) => {
                                  const updated = [...localTestimonials];
                                  updated[idx].avatar = val;
                                  setLocalTestimonials(updated);
                                }}
                                label="🖼️ Client Avatar"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">✍️ Review Quote (CLIENT QUOTE)</label>
                            <textarea
                              rows={3}
                              value={test.quote}
                              onChange={(e) => {
                                const updated = [...localTestimonials];
                                updated[idx].quote = e.target.value;
                                setLocalTestimonials(updated);
                              }}
                              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-300 leading-normal"
                            />
                          </div>

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
                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative hover:border-violet-500/20 transition-all">
                          <span className="text-xs font-bold text-violet-400">👥 Team Member #{idx + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">👤 Member Name (MEMBER NAME)</label>
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
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">💼 Role / Designation (ROLE / DESIGNATION)</label>
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
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">🔗 Facebook URL</label>
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
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">🔗 LinkedIn URL</label>
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
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1">🔗 Instagram URL</label>
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
                            </div>
                          </div>

                          <div>
                            <ImageUploader
                              value={mem.image}
                              onChange={(val) => {
                                const updated = [...localTeam];
                                updated[idx].image = val;
                                setLocalTeam(updated);
                              }}
                              label="TEAM MEMBER PHOTO"
                            />
                          </div>

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

            {/* Footer and Contacts Tab */}
            {activeTab === 'footer' && (
              <div className="space-y-6">
                <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-6 space-y-4">
                  <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>📞 Contact Details & Social Links</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">📧 Official Email Address (EMAIL ADDRESS)</label>
                        <input
                          type="email"
                          value={localContact.email}
                          onChange={(e) => setLocalContact({ ...localContact, email: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">📞 Phone Number / WhatsApp (PHONE NUMBER)</label>
                        <input
                          type="text"
                          value={localContact.phone}
                          onChange={(e) => setLocalContact({ ...localContact, phone: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">📍 Office Address (OFFICE ADDRESS)</label>
                      <input
                        type="text"
                        value={localContact.address}
                        onChange={(e) => setLocalContact({ ...localContact, address: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🔗 Facebook Profile Link (FACEBOOK URL)</label>
                        <input
                          type="text"
                          value={localContact.facebook}
                          onChange={(e) => setLocalContact({ ...localContact, facebook: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🔗 Instagram Profile Link (INSTAGRAM URL)</label>
                        <input
                          type="text"
                          value={localContact.instagram}
                          onChange={(e) => setLocalContact({ ...localContact, instagram: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-2">🔗 X / Twitter Profile Link (X / TWITTER URL)</label>
                        <input
                          type="text"
                          value={localContact.twitter}
                          onChange={(e) => setLocalContact({ ...localContact, twitter: e.target.value })}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-xs font-mono text-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">©️ Copyright Text (COPYRIGHT INFORMATION)</label>
                      <input
                        type="text"
                        value={localContact.copyright}
                        onChange={(e) => setLocalContact({ ...localContact, copyright: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none text-slate-300"
                      />
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
    </div>
  );
}
