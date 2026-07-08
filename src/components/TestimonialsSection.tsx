import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, PenTool, X, Check, Plus } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteContext';
import { motion, AnimatePresence } from 'motion/react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', // Female 1
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // Male 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', // Female 2
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', // Male 2
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'  // Female 3
];

export default function TestimonialsSection() {
  const { data, updateData } = useWebsiteData();
  const { testimonials } = data;
  const [activeSlide, setActiveSlide] = useState(0);

  // Review form states
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [newAvatar, setNewAvatar] = useState(AVATAR_PRESETS[0]);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const total = testimonials.length || 1;
  const slide1 = testimonials[activeSlide % total] || { id: 't1', name: 'User', role: 'Podcaster', quote: 'Great service!', stars: 5, avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200' };
  const slide2 = testimonials[(activeSlide + 1) % total] || slide1;

  // Display 2 cards at a time on desktop, 1 on mobile
  const visibleTestimonials = [slide1, slide2];

  const handleDotClick = (idx: number) => {
    setActiveSlide(idx);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newQuote.trim() || !newRole.trim()) {
      alert('Please fill in all fields (Name, Role, and Review description)!');
      return;
    }

    const newTestimonial = {
      id: Date.now(),
      name: newName.trim(),
      role: newRole.trim(),
      quote: newQuote.trim(),
      stars: newStars,
      avatar: newAvatar
    };

    const updatedTestimonials = [...testimonials, newTestimonial];
    updateData({ testimonials: updatedTestimonials });

    setSubmitSuccess(true);
    setNewName('');
    setNewRole('');
    setNewQuote('');
    setNewStars(5);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsWritingReview(false);
      // Auto-focus on the newly added review (which is at the end)
      setActiveSlide(updatedTestimonials.length - 1);
    }, 2000);
  };

  return (
    <section id="testimonials" className="py-20 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait and quotation badge overlay */}
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            style={{ willChange: "transform, opacity" }}
            className="lg:col-span-4 relative"
            id="testimonials-visual"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto lg:max-w-none border border-slate-800 bg-[#0B132B]">
              <img
                src={data.testimonialsImage || "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600"}
                alt="Happy listener with headphones looking up and smiling"
                className="w-full aspect-[4/5] object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Quotation icon circle bottom-left overlay */}
              <div className="absolute -bottom-4 -left-4 bg-slate-950/90 p-3 rounded-2xl shadow-xl border border-slate-800 z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 via-brand-purple to-brand-cyan text-white shadow-md shadow-purple-950/50">
                  <Quote className="h-6 w-6 fill-current rotate-180" />
                </div>
              </div>
            </div>
            
            {/* Backdrop lighting */}
            <div className="absolute -top-6 -left-6 h-32 w-32 bg-blue-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
          </motion.div>

          {/* Right Column: Quotes List Slider */}
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ willChange: "transform, opacity" }}
            className="lg:col-span-8 space-y-6 text-left"
            id="testimonials-reviews"
          >
            
            <div className="border-b border-slate-800/60 pb-4">
              {/* Magenta Tag */}
              <span className="text-xs font-bold tracking-widest text-brand-magenta uppercase block mb-1">
                Testimonials
              </span>

              {/* Slogan title */}
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                What they say about us
              </h2>
            </div>

            {/* Paragraph description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Real feedback from podcasters who've grown their audience, improved rankings, and scaled with confidence.
            </p>

            {/* Testimonials Slider */}
            <div className="space-y-6">
              {/* Slider cards container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <AnimatePresence mode="wait">
                  {visibleTestimonials.map((test, idx) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-[#0B132B]/80 rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-all h-full"
                      id={`testimonial-card-${test.id}`}
                    >
                      <div>
                        {/* 5 Golden Stars */}
                        <div className="flex items-center gap-1 text-amber-400 mb-4">
                          {Array.from({ length: test.stars }).map((_, sIdx) => (
                            <Star key={sIdx} className="h-4 w-4 fill-current" />
                          ))}
                        </div>

                        {/* Quote Text */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic relative z-10">
                          “{test.quote}”
                        </p>

                        {/* Admin Reply */}
                        {test.reply && (
                          <div className="mt-3 p-3 rounded-xl bg-violet-950/20 border border-violet-800/30 text-[11px] text-slate-300 leading-relaxed relative z-10 text-left">
                            <span className="font-bold text-violet-400 block mb-0.5">💬 Admin Response:</span>
                            {test.reply}
                          </div>
                        )}
                      </div>

                      {/* Author block */}
                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={test.avatar}
                            alt={test.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-800 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                              {test.name}
                            </h4>
                            <p className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider">
                              {test.role}
                            </p>
                          </div>
                        </div>
                        
                        {/* Giant background accent quote symbol */}
                        <Quote className="h-10 w-10 text-purple-950/40 fill-current rotate-180" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Indicator Slide Dots Navigator & Controls */}
              <div className="flex items-center justify-between gap-4 pt-4" id="testimonials-dots-nav">
                <div className="flex items-center gap-2">
                  {Array.from({ length: testimonials.length }).map((_, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => handleDotClick(dIdx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        activeSlide === dIdx ? 'w-6 bg-white' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                      }`}
                      aria-label={`Go to slide ${dIdx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSlide((prev) => (prev - 1 + total) % total)}
                    className="p-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev + 1) % total)}
                    className="p-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: Write a Review Form */}
            <div className="pt-6 border-t border-slate-800/40">
              <AnimatePresence mode="wait">
                {!isWritingReview ? (
                  <motion.div
                    key="write-review-btn-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <button
                      onClick={() => setIsWritingReview(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-brand-purple hover:from-violet-500 hover:to-brand-purple/90 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-purple-950/40 active:scale-95 transition-all"
                    >
                      <PenTool className="h-4 w-4" />
                      <span>✍️ Write a Review</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="review-form"
                    onSubmit={handleSubmitReview}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0B132B]/95 rounded-2xl p-5 sm:p-6 border border-brand-purple/40 shadow-[0_0_30px_rgba(139,92,246,0.15)] space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>✍️ Share Your Review</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsWritingReview(false)}
                        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {submitSuccess ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center py-6 text-center space-y-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <Check className="h-5 w-5 animate-bounce" />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-emerald-400">Review Added Successfully!</h4>
                        <p className="text-xs text-slate-300">Thank you! Your review has been successfully added to the live site.</p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">👤 Your Name</label>
                            <input
                              type="text"
                              required
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              placeholder="e.g. Mehedi Hasan"
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">💼 Role / Podcast</label>
                            <input
                              type="text"
                              required
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              placeholder="e.g. Host of Podcast / Podcaster"
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">⭐ Star Rating</label>
                          <div className="flex items-center gap-1.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewStars(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(null)}
                                className="text-xl transition-all duration-150 transform active:scale-125 focus:outline-none"
                              >
                                <Star
                                  className={`h-5 w-5 transition-all ${
                                    star <= (hoveredStar ?? newStars)
                                      ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                      : 'text-slate-700'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-[11px] font-mono font-bold text-slate-400 ml-2">
                              {newStars} / 5 Stars
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">✍️ Review Comment</label>
                          <textarea
                            required
                            rows={3}
                            value={newQuote}
                            onChange={(e) => setNewQuote(e.target.value)}
                            placeholder="Write your growth experience here..."
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all resize-none"
                          />
                        </div>

                        {/* Avatar Preset Selection */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">🎭 Choose Profile Photo</label>
                          <div className="flex items-center gap-2 flex-wrap">
                            {AVATAR_PRESETS.map((avatarUrl, index) => (
                              <button
                                type="button"
                                key={index}
                                onClick={() => setNewAvatar(avatarUrl)}
                                className={`relative h-9 w-9 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                                  newAvatar === avatarUrl
                                    ? 'border-brand-purple scale-110 ring-2 ring-brand-purple/30'
                                    : 'border-slate-800 hover:border-slate-600'
                                }`}
                              >
                                <img
                                  src={avatarUrl}
                                  alt={`Avatar preset ${index + 1}`}
                                  className="h-full w-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {newAvatar === avatarUrl && (
                                  <div className="absolute inset-0 bg-brand-purple/30 flex items-center justify-center">
                                    <Check className="h-3.5 w-3.5 text-white font-bold" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800/60">
                          <button
                            type="button"
                            onClick={() => setIsWritingReview(false)}
                            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-4 py-2 rounded-lg shadow-md shadow-emerald-950/20 active:scale-95 transition-all text-xs"
                          >
                            Submit Review
                          </button>
                        </div>
                      </>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

