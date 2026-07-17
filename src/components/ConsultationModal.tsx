import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  User, 
  Mail, 
  Mic, 
  MessageSquare, 
  Flame, 
  Calendar,
  Award,
  Zap,
  Star,
  Phone,
  Copy,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName?: string;
}

export default function ConsultationModal({ isOpen, onClose, selectedPlanName = '' }: ConsultationModalProps) {
  const { data } = useWebsiteData();
  const pricingPlans = data.pricingPlans || [];

  const activePlatforms = data.bookingPlatforms || {
    'YouTube': true,
    'Spotify': true,
    'Apple Podcast': true,
    'Google Podcast': true,
    'SoundCloud': true,
    'Not Launched': true
  };

  const platforms = [
    { name: 'YouTube' },
    { name: 'Spotify' },
    { name: 'Apple Podcast' },
    { name: 'Google Podcast' },
    { name: 'SoundCloud' },
    { name: 'Not Launched' }
  ].filter(p => activePlatforms[p.name] !== false);

  const defaultPlatformName = platforms[0]?.name || 'Spotify';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    podcastName: '',
    platform: defaultPlatformName,
    monthlyDownloads: '0 - 5,000',
    selectedPlan: '',
    message: '',
    contactType: 'WhatsApp',
    contactValue: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);

  // Synchronize state when modal opens or selectedPlanName / pricingPlans changes
  useEffect(() => {
    if (isOpen) {
      const standardPlan = pricingPlans[1] || pricingPlans[0];
      const defaultPlanStr = standardPlan ? `${standardPlan.name} ($${standardPlan.price})` : 'Standard Package ($999)';
      
      let initialPlan = defaultPlanStr;
      if (selectedPlanName) {
        const matchedPlan = pricingPlans.find(p => p.name.toLowerCase() === selectedPlanName.toLowerCase());
        if (matchedPlan) {
          initialPlan = `${matchedPlan.name} ($${matchedPlan.price})`;
        } else {
          initialPlan = selectedPlanName;
        }
      }

      setFormData(prev => ({
        ...prev,
        selectedPlan: initialPlan,
        platform: defaultPlatformName,
        monthlyDownloads: '0 - 5,000',
      }));
    }
  }, [isOpen, selectedPlanName, pricingPlans, defaultPlatformName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate an beautiful dynamic order/booking token
    const tokenPart = Math.floor(100000 + Math.random() * 900000);
    const tokenVal = `DPR-${tokenPart}`;
    setGeneratedToken(tokenVal);
    setCopiedToken(false);

    try {
      // Save directly to localStorage for instant local database persistence
      const existingBookings = localStorage.getItem('podcast_top_rank_bookings');
      let bookingsList: any[] = [];
      if (existingBookings) {
        try {
          bookingsList = JSON.parse(existingBookings);
          if (!Array.isArray(bookingsList)) {
            bookingsList = [];
          }
        } catch (e) {
          bookingsList = [];
        }
      }

      const newBooking = {
        id: tokenVal,
        token: tokenVal,
        name: formData.name,
        email: formData.email,
        podcastName: formData.podcastName || 'Not Provided',
        platform: formData.platform,
        monthlyDownloads: formData.monthlyDownloads,
        selectedPlan: formData.selectedPlan,
        message: formData.message || '',
        contactType: formData.contactType,
        contactValue: formData.contactValue,
        createdAt: new Date().toISOString()
      };

      bookingsList.unshift(newBooking);
      localStorage.setItem('podcast_top_rank_bookings', JSON.stringify(bookingsList));

      // Send automated email notification to Gmail or Business Mail
      const notificationConfig = data.emailNotification;
      if (notificationConfig?.enabled) {
        // Use the configured Web3Forms Access Key, or fallback to a standard helper key if available.
        // Web3Forms keys are completely free, so the admin can generate their own and save it in the Admin Panel
        const targetKey = notificationConfig.web3formKey;
        if (targetKey) {
          try {
            await fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                access_key: targetKey,
                subject: `🔥 New Order/Booking [${tokenVal}] Placed by ${formData.name}`,
                from_name: 'Podcast Ranking Hub Website Notification',
                title: `New Strategy Session Booking [${tokenVal}]`,
                "Booking Token": tokenVal,
                "Client Name": formData.name,
                "Client Email": formData.email,
                "Preferred Contact Method": formData.contactType,
                "Contact Account/Value": formData.contactValue,
                "Selected Package/Interest": formData.selectedPlan,
                "Podcast Name": formData.podcastName || 'Not Provided',
                "Target Platform": formData.platform,
                "Current Monthly Downloads": formData.monthlyDownloads,
                "Client Message/Goals": formData.message || 'No goals provided.',
                "Timestamp": new Date().toLocaleString(),
                "Go to Admin Panel": window.location.origin
              })
            });
            console.log('Automated email notification sent successfully!');
          } catch (emailErr) {
            console.error('Error sending email notification:', emailErr);
          }
        }
      }
    } catch (err) {
      console.error('Error saving booking to localStorage:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    const standardPlan = pricingPlans[1] || pricingPlans[0];
    const defaultPlanStr = standardPlan ? `${standardPlan.name} ($${standardPlan.price})` : 'Standard Package ($999)';
    
    setFormData({
      name: '',
      email: '',
      podcastName: '',
      platform: defaultPlatformName,
      monthlyDownloads: '0 - 5,000',
      selectedPlan: selectedPlanName || defaultPlanStr,
      message: '',
      contactType: 'WhatsApp',
      contactValue: '',
    });
    setGeneratedToken('');
    setCopiedToken(false);
    setSubmitted(false);
  };

  if (!isOpen) return null;

  // Dynamic Monthly Downloads with actual packages' target metrics
  const downloadRanges = [
    '0 - 5,000',
    ...pricingPlans.map(plan => {
      const downloadFeature = plan.features.find(f => f.toLowerCase().includes('download')) || plan.features[0] || 'Downloads';
      return downloadFeature;
    })
  ];

  // Dynamic packages from the database pricing plans
  const packages = [
    ...pricingPlans.map(plan => `${plan.name} ($${plan.price})`),
    'Custom Consulting'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          id="modal-backdrop"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#090D1E] border border-slate-800/80 shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col md:grid md:grid-cols-12 max-h-[92vh] md:max-h-none overflow-y-auto"
          id="consultation-modal-card"
        >
          {/* Top border color line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 z-10" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full p-2 text-slate-400 hover:bg-slate-800/60 hover:text-white transition-all border border-slate-800/50 bg-slate-900/50"
            id="close-modal-btn"
            aria-label="Close modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* LEFT COLUMN: Values, Trust & Social Proof */}
          {(() => {
            const booking = data.booking || {
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
            return (
              <div className="md:col-span-5 bg-gradient-to-b from-slate-950/90 to-[#0A0E23] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/50 relative overflow-hidden">
                {/* Background glowing sphere */}
                <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
                <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

                <div className="relative space-y-6">
                  {/* Brand Indicator */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[11px] font-semibold text-violet-300">
                    <Sparkles className="h-3 w-3 text-violet-400 animate-pulse" /> {booking.badgeText}
                  </div>

                  {/* Catchy Headline */}
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-white leading-tight font-display tracking-tight">
                      {booking.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">{booking.titleAccent}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {booking.description}
                    </p>
                  </div>

                  {/* What they get list */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-100">{booking.benefit1Title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{booking.benefit1Desc}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-100">{booking.benefit2Title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{booking.benefit2Desc}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-100">{booking.benefit3Title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{booking.benefit3Desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="pt-4 border-t border-slate-800/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-200">{booking.trustTitle}</div>
                      <div className="text-[10px] text-slate-400">{booking.trustDesc}</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial preview / Authority */}
                <div className="mt-8 pt-4 border-t border-slate-800/60 relative">
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current text-amber-400" />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-1.5">{booking.ratingText}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic leading-relaxed">
                    "{booking.quoteText}"
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <img 
                      src={booking.quoteImage} 
                      alt="Reviewer" 
                      className="h-6 w-6 rounded-full object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-semibold text-slate-400">{booking.quoteAuthor}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* RIGHT COLUMN: Interactive High-Polished Form */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center relative bg-slate-950/30">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4" id="consultation-form">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-violet-400" /> Book Strategy Session
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the fields below. Fields marked with <span className="text-violet-400">*</span> are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Your Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <User className="h-3 w-3 text-violet-400" /> Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 font-sans"
                      placeholder="e.g. John Doe"
                      id="input-name"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between w-full">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-violet-400" /> Email Address *
                      </span>
                      <span className="text-[9px] text-emerald-400 tracking-normal capitalize font-medium">Recommended</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 font-sans"
                      placeholder="e.g. john@example.com (Recommended)"
                      id="input-email"
                    />
                  </div>

                  {/* Podcast Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <Mic className="h-3 w-3 text-violet-400" /> Podcast Name (If launched)
                    </label>
                    <input
                      type="text"
                      value={formData.podcastName}
                      onChange={(e) => setFormData({ ...formData, podcastName: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 font-sans"
                      placeholder="e.g. The Creative Spark Show"
                      id="input-podcast-name"
                    />
                  </div>

                  {/* WhatsApp / Social Account Info (Alternative options requested by user) */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between w-full">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-violet-400" /> WhatsApp / Social Info *
                      </span>
                      <span className="text-[9px] text-emerald-400 tracking-normal capitalize font-medium">WhatsApp Recommended</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <select
                        value={formData.contactType}
                        onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                        className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-sans cursor-pointer shrink-0"
                      >
                        <option value="WhatsApp">WhatsApp (Recommended)</option>
                        <option value="Telegram">Telegram</option>
                        <option value="Skype">Skype</option>
                        <option value="Facebook">Facebook Profile</option>
                        <option value="Instagram">Instagram Profile</option>
                        <option value="LinkedIn">LinkedIn Profile</option>
                        <option value="Linktree">Linktree URL</option>
                        <option value="Spotify">Spotify Link</option>
                        <option value="Twitter">Twitter / X Profile</option>
                      </select>
                      <input
                        type="text"
                        required
                        value={formData.contactValue}
                        onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                        className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 font-sans"
                        placeholder={
                          formData.contactType === 'WhatsApp' ? 'e.g. +880 1700-000000 (Recommended)' :
                          formData.contactType === 'Telegram' ? 'e.g. @username' :
                          formData.contactType === 'Skype' ? 'e.g. live:username' :
                          formData.contactType === 'Facebook' ? 'e.g. facebook.com/username' :
                          formData.contactType === 'Instagram' ? 'e.g. instagram.com/username' :
                          formData.contactType === 'LinkedIn' ? 'e.g. linkedin.com/in/username' :
                          formData.contactType === 'Linktree' ? 'e.g. linktr.ee/username' :
                          formData.contactType === 'Spotify' ? 'e.g. open.spotify.com/...' :
                          formData.contactType === 'Twitter' ? 'e.g. x.com/username' :
                          'Enter profile link or account ID...'
                        }
                        id="input-contact-value"
                      />
                    </div>
                  </div>
                </div>

                {/* VISUAL CHOICE: Target Platform */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Target Platform
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {platforms.map((plat) => (
                      <button
                        type="button"
                        key={plat.name}
                        onClick={() => setFormData({ ...formData, platform: plat.name })}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-3 text-xs font-semibold transition-all duration-200 select-none ${
                          formData.platform === plat.name
                            ? 'border-violet-500 bg-violet-500/10 text-white shadow-lg shadow-violet-500/5'
                            : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{plat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CURRENT MONTHLY DOWNLOADS */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Current Monthly Downloads
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {downloadRanges.map((range) => (
                      <button
                        type="button"
                        key={range}
                        onClick={() => {
                          const idx = downloadRanges.indexOf(range);
                          let matchedPkg = formData.selectedPlan;
                          if (idx > 0) {
                            const plan = pricingPlans[idx - 1];
                            if (plan) {
                              matchedPkg = `${plan.name} ($${plan.price})`;
                            }
                          } else {
                            matchedPkg = 'Custom Consulting';
                          }
                          setFormData({
                            ...formData,
                            monthlyDownloads: range,
                            selectedPlan: matchedPkg
                          });
                        }}
                        className={`text-center rounded-xl border py-2 px-1 text-[10px] sm:text-xs font-semibold transition-all duration-200 select-none ${
                          formData.monthlyDownloads === range
                            ? 'border-violet-500 bg-violet-500/10 text-white shadow-lg shadow-violet-500/5'
                            : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TARGET PACKAGE INTEREST */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Package of Interest
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {packages.map((pkg) => {
                      const isSelected = formData.selectedPlan.toLowerCase() === pkg.toLowerCase() || 
                                         formData.selectedPlan.toLowerCase().includes(pkg.toLowerCase()) || 
                                         pkg.toLowerCase().includes(formData.selectedPlan.toLowerCase());
                      return (
                        <button
                          type="button"
                          key={pkg}
                          onClick={() => {
                            const idx = packages.indexOf(pkg);
                            let matchedDownloads = formData.monthlyDownloads;
                            if (idx < pricingPlans.length) {
                              const plan = pricingPlans[idx];
                              matchedDownloads = plan.features.find(f => f.toLowerCase().includes('download')) || plan.features[0] || 'Downloads';
                            } else {
                              matchedDownloads = '0 - 5,000';
                            }
                            setFormData({
                              ...formData,
                              selectedPlan: pkg,
                              monthlyDownloads: matchedDownloads
                            });
                          }}
                          className={`text-center rounded-xl border py-2 px-1 text-[10px] font-semibold transition-all duration-200 select-none leading-tight ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/5'
                              : 'border-slate-800/80 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {pkg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* What are your main podcast goals? */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-violet-400" /> What are your main goals / challenges?
                  </label>
                  <textarea
                    rows={2.5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-600 font-sans"
                    placeholder="e.g. Boost listeners on Apple, rank high for 'marketing' keyword, etc."
                    id="input-message"
                  />
                </div>

                {/* Form Actions / Submit Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Award className="h-3.5 w-3.5 text-cyan-400" /> Fast Response Guaranteed
                  </div>

                  <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition-all"
                      id="btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.35)] active:scale-98 disabled:opacity-70 select-none cursor-pointer"
                      id="btn-submit"
                    >
                      {loading ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Analyzing details...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Claim My Free Strategy Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="py-8 px-4 text-center" id="success-screen">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle2 className="h-9 w-9" />
                </motion.div>

                <h3 className="mt-5 text-2xl font-black font-display text-white tracking-tight">
                  Strategy Session Confirmed!
                </h3>
                <p className="mt-2 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Excellent choice, <strong className="text-cyan-300">{formData.name}</strong>! We have received your podcast insights for{' '}
                  <strong className="text-violet-400">{formData.podcastName || 'your upcoming channel'}</strong>.
                </p>

                {/* Token Section */}
                <div className="mt-6 max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
                  
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block mb-1">
                    Your Unique Booking Token
                  </span>
                  
                  <div className="flex items-center justify-center gap-2 bg-slate-950/60 rounded-xl px-4 py-3 border border-slate-800/80">
                    <span className="font-mono text-lg font-extrabold text-cyan-300 tracking-wider">
                      {generatedToken}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedToken);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="ml-2 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-all active:scale-95 border border-slate-700"
                      title="Copy Token to Clipboard"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <p className="mt-2.5 text-[11px] text-slate-400 leading-normal">
                    Please use this token when contacting us. This helps us recognize your order on our website instantly and serve you faster!
                  </p>
                </div>

                {/* Contact Actions Section */}
                <div className="mt-6 max-w-md mx-auto space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block text-center">
                    Talk Directly With Us (Lead Strategist)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WhatsApp Action */}
                    <a
                      href={`https://wa.me/${(data.contactInfo.phone || '+880 1765-068860').replace(/[^0-9]/g, '')}?text=Hi%20there%2C%20I%20just%20ordered%20a%20Podcast%20Strategy%20Session.%20My%20Booking%20Token%20is%20${generatedToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all active:scale-98"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      Chat on WhatsApp
                    </a>

                    {/* Email Action */}
                    <a
                      href={`mailto:${data.contactInfo.email || 'doulotaligettopgrowth@gmail.com'}?subject=Strategy%20Session%20Booking%20Token%20${generatedToken}&body=Hello%20Podcast%20Ranking%20Hub%20Team%2C%0A%0AMy%20booking%20token%20is%20${generatedToken}.%20Please%20let%20me%20know%20how%20we%20can%20proceed%20with%20our%20Podcast%20Strategy%20Session.%0A%0AThank%20you.`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs py-3 px-4 transition-all active:scale-98"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      Send an Email
                    </a>
                  </div>

                  {/* Manual details display */}
                  <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-3 text-[11px] text-slate-400 space-y-1 text-left">
                    <div className="flex justify-between items-center">
                      <span>WhatsApp Number:</span>
                      <strong className="text-slate-200">{data.contactInfo.phone || '+880 1765-068860'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Email Address:</span>
                      <strong className="text-slate-200">{data.contactInfo.email || 'doulotaligettopgrowth@gmail.com'}</strong>
                    </div>
                  </div>
                </div>

                {/* Animated receipt details card */}
                <div className="mt-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-sm mx-auto shadow-inner">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                    <span className="font-semibold text-slate-400">Target Channel</span>
                    <span className="text-slate-200 font-bold">{formData.platform}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                    <span className="font-semibold text-slate-400">Current Downloads</span>
                    <span className="text-slate-200 font-bold">{formData.monthlyDownloads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-400">Selected Interest</span>
                    <span className="text-cyan-300 font-bold">{formData.selectedPlan}</span>
                  </div>
                  {formData.contactValue && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                      <span className="font-semibold text-slate-400">{formData.contactType} Account</span>
                      <span className="text-violet-400 font-bold break-all">{formData.contactValue}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800/60 transition-all bg-slate-900/30"
                    id="btn-submit-another"
                  >
                    Submit Another
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 px-6 py-2.5 text-xs font-bold transition-all shadow-[0_4px_15px_rgba(6,182,212,0.3)]"
                    id="btn-close"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

