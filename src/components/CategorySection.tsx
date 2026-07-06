import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteContext';
import { motion, AnimatePresence } from 'motion/react';

export default function CategorySection() {
  const { data } = useWebsiteData();
  const { categories } = data;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Guard against out of bounds indices when category length changes
  const safeIndex = activeCategoryIndex >= categories.length ? 0 : activeCategoryIndex;
  const activeCategory = categories[safeIndex] || { name: 'Podcast SEO', tagline: 'Top Charts Target', description: 'Expert SEO optimization' };

  return (
    <section className="py-20 bg-transparent border-t border-slate-800" id="categories-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Cozy Microphoning image */}
          <div className="lg:col-span-4 relative" id="categories-visual">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-[#0B132B]">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600"
                alt="Condenser podcast microphone on dynamic scissor arm over a wooden workspace desk"
                className="w-full aspect-[4/3] sm:aspect-square object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Ambient accent lights */}
            <div className="absolute -bottom-8 -right-8 h-24 w-24 bg-brand-purple/20 rounded-full blur-2xl -z-10" />
          </div>

          {/* Center Column: List of Categories with right arrow triggers */}
          <div className="lg:col-span-4 space-y-3" id="categories-list">
            {categories.map((cat, idx) => {
              const isActive = safeIndex === idx;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all duration-300 ${
                    isActive
                      ? 'bg-[#131E3D] border-brand-purple shadow-md shadow-purple-950/50 scale-[1.02] text-white'
                      : 'bg-[#0B132B]/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700 text-slate-300'
                  }`}
                  id={`cat-btn-${cat.name.toLowerCase()}`}
                >
                  <span className={`font-display text-base font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {cat.name}
                  </span>
                  
                  {/* Circular purple arrow */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ${
                      isActive ? 'bg-brand-purple text-white rotate-0' : 'bg-purple-950 text-purple-400 -rotate-45'
                    }`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Descriptions & Details Box */}
          <div className="lg:col-span-4 space-y-6 text-left" id="categories-right-panel">
            {/* Magenta category tag */}
            <span className="text-xs font-bold tracking-widest text-brand-magenta uppercase block">
              Podcast Category
            </span>

            {/* Heading text */}
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight leading-tight">
              Taking Your Podcast to the Top of the Charts
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              From optimization to promotion, we turn your episodes into high-performing assets that drive downloads and visibility.
            </p>

            {/* Active Category Display Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0B132B]/90 border border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden"
              >
                {/* Decorative glowing top right circle */}
                <div className="absolute -top-10 -right-10 h-24 w-24 bg-brand-purple/5 rounded-full" />

                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  <Sparkles className="h-3 w-3" /> Focus Target
                </span>

                <h3 className="text-lg font-bold text-white mt-3 font-display">
                  {activeCategory.name} SEO
                </h3>
                
                <p className="text-xs font-semibold text-brand-magenta mt-1 italic">
                  "{activeCategory.tagline}"
                </p>

                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {activeCategory.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}

