import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName?: string;
}

export default function ConsultationModal({ isOpen, onClose, selectedPlanName = '' }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    podcastName: '',
    platform: 'Spotify',
    monthlyDownloads: '0 - 5,000',
    selectedPlan: selectedPlanName || 'Standard Package',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      podcastName: '',
      platform: 'Spotify',
      monthlyDownloads: '0 - 5,000',
      selectedPlan: selectedPlanName || 'Standard Package',
      message: '',
    });
    setSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          id="modal-backdrop"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0B132B] border border-slate-800 shadow-2xl"
          id="consultation-modal-card"
        >
          {/* Header Graphic */}
          <div className="h-2 bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-cyan" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
            id="close-modal-btn"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 md:p-8" id="consultation-form">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-950/80 px-3 py-1 text-xs font-semibold text-purple-300">
                  <Sparkles className="h-3.5 w-3.5" /> Grow Your Show
                </span>
                <h3 className="mt-2 text-2xl font-bold font-display text-white">
                  Book Your Podcast Strategy Consultation
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Fill out this short form, and our growth experts will audit your podcast and design a custom blueprint.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Your Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all placeholder:text-slate-600"
                    placeholder="John Doe"
                    id="input-name"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all placeholder:text-slate-600"
                    placeholder="john@example.com"
                    id="input-email"
                  />
                </div>

                {/* Podcast Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Podcast Name (If launched)
                  </label>
                  <input
                    type="text"
                    value={formData.podcastName}
                    onChange={(e) => setFormData({ ...formData, podcastName: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all placeholder:text-slate-600"
                    placeholder="The Creative Spark"
                    id="input-podcast-name"
                  />
                </div>

                {/* Target Platform */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Primary Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all"
                    id="input-platform"
                  >
                    <option className="bg-[#0B132B]">Spotify</option>
                    <option className="bg-[#0B132B]">YouTube</option>
                    <option className="bg-[#0B132B]">Apple Podcasts</option>
                    <option className="bg-[#0B132B]">SoundCloud</option>
                    <option className="bg-[#0B132B]">Google Podcasts</option>
                    <option className="bg-[#0B132B]">Not Launched Yet</option>
                  </select>
                </div>

                {/* Monthly Downloads */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Current Monthly Downloads
                  </label>
                  <select
                    value={formData.monthlyDownloads}
                    onChange={(e) => setFormData({ ...formData, monthlyDownloads: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all"
                    id="input-downloads"
                  >
                    <option className="bg-[#0B132B]">0 - 5,000</option>
                    <option className="bg-[#0B132B]">5,000 - 20,000</option>
                    <option className="bg-[#0B132B]">20,000 - 100,000</option>
                    <option className="bg-[#0B132B]">100,000+</option>
                  </select>
                </div>

                {/* Growth Plan Interest */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Target Package interest
                  </label>
                  <select
                    value={formData.selectedPlan}
                    onChange={(e) => setFormData({ ...formData, selectedPlan: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all"
                    id="input-plan"
                  >
                    <option className="bg-[#0B132B]">Starter Package ($499)</option>
                    <option className="bg-[#0B132B]">Standard Package ($999)</option>
                    <option className="bg-[#0B132B]">Premium Package ($1899)</option>
                    <option className="bg-[#0B132B]">Custom Enterprise Consulting</option>
                  </select>
                </div>
              </div>

              {/* Message / Goals */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  What are your main podcast goals?
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-[#060b1e] px-3 py-2 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all placeholder:text-slate-600"
                  placeholder="Tell us about your audience, current challenges, and goals..."
                  id="input-message"
                />
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all"
                  id="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 px-6 py-2.5 text-sm font-semibold transition-all shadow-md active:scale-98 disabled:opacity-70"
                  id="btn-submit"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      Analyzing Podcast...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Get My Strategy Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center" id="success-screen">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-900/50"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <h3 className="mt-4 text-2xl font-bold font-display text-white">
                Application Submitted Successfully!
              </h3>
              <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                Thank you, <strong className="text-brand-cyan">{formData.name}</strong>! We have received details for{' '}
                <strong className="text-brand-cyan">{formData.podcastName || 'your upcoming podcast'}</strong>.
              </p>
              <div className="mt-6 bg-[#060b1e] border border-slate-800 rounded-xl p-4 text-left text-xs text-slate-200 space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Platform:</span>
                  <span>{formData.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Monthly Downloads:</span>
                  <span>{formData.monthlyDownloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Plan Selected:</span>
                  <span>{formData.selectedPlan}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-purple-300 font-medium">
                Our operations team (led by Azad Khan) will email you at {formData.email} in 2-4 hours.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full px-5 py-2 text-xs font-semibold border border-slate-800 text-slate-300 hover:bg-slate-800 bg-transparent transition-all"
                  id="btn-submit-another"
                >
                  Submit Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-brand-cyan text-slate-950 hover:bg-[#00e2c4] px-5 py-2 text-xs font-semibold transition-all"
                  id="btn-close"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
