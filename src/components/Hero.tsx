import { ArrowRight, Sparkles, AudioLines } from 'lucide-react';
import { motion } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteContext';

interface HeroProps {
  onOpenConsultation: () => void;
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  const { data } = useWebsiteData();
  const { hero } = data;

  // Generate random heights for the dynamic equalizer bars at the bottom
  const equalizerBars = Array.from({ length: 70 }).map((_, i) => {
    // Generate heights that look like a natural audio curve, peaking in sections and fading
    const defaultHeight = Math.sin(i * 0.15) * 16 + 20 + Math.random() * 8;
    return Math.max(4, Math.min(48, defaultHeight));
  });

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-white flex items-center"
    >
      {/* Dashed Grid Background Element */}
      <div className="absolute inset-0 purple-grid-pattern opacity-60 pointer-events-none" />

      {/* Radiant Glowing Background Circles */}
      <div className="absolute top-20 left-10 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-20 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div
            className="lg:col-span-6 space-y-6"
            id="hero-left-content"
          >
            {/* Top Gradient Divider Line */}
            <motion.div
              initial={{ opacity: 0, x: "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                {hero.tagline}
              </span>
            </motion.div>

            {/* Giant Display Title */}
            <motion.h1
              initial={{ opacity: 0, x: "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.08]"
            >
              {hero.title}
            </motion.h1>

            {/* Paragraph Content */}
            <motion.p
              initial={{ opacity: 0, x: "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              {hero.description}
            </motion.p>

            {/* Call to Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.button
                initial={{ opacity: 0, x: "-100vw" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.4 }}
                onClick={onOpenConsultation}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-cyan text-slate-950 font-bold px-8 py-4 text-base tracking-wide shadow-md hover:shadow-cyan-400/20 hover:bg-[#00e2c4] active:scale-98 transition-all"
                id="hero-cta-btn"
              >
                {hero.buttonText}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, x: "-100vw" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.5 }}
                className="flex items-center gap-2 text-xs text-slate-400 font-medium ml-2 py-2"
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{hero.statBadgeText}</span>
              </motion.div>
            </div>
          </div>

          {/* Right Image Composition Column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            style={{ willChange: "opacity" }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
            id="hero-right-visual"
          >
            


            <div className="relative w-full max-w-lg flex items-center gap-4 sm:gap-6">
              
              {/* Card 1: Happy Young Woman Laughing (Floats higher / back) */}
              <div className="relative w-1/2 rounded-2xl overflow-hidden aspect-[3/4] shadow-xl border border-slate-800 bg-[#0B132B] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <img
                  src={hero.imageLeft}
                  alt="Happy young podcaster woman smiling and recording a session"
                  className="h-full w-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Centered Floating Beautiful Audio-V Widget (Bridges the two photos at the upper-middle side, smaller and elegant) */}
              <div className="absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2 z-20 w-[110px] sm:w-[130px] bg-slate-950/90 backdrop-blur-xl rounded-xl p-2 sm:p-2.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] border border-brand-cyan/30 transition-all duration-300 hover:border-brand-cyan/60 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-brand-cyan animate-ping" />
                    <span className="font-mono text-[8px] sm:text-[9px] font-bold text-slate-200 tracking-wider">AUDIO-V</span>
                  </div>
                  <span className="text-[7px] bg-brand-purple/20 text-brand-purple px-1 py-0.2 rounded font-mono font-bold tracking-tight">LIVE</span>
                </div>
                
                {/* Visualizer bars (more compact) */}
                <div className="flex items-end justify-between h-5 gap-[2px] mb-1 px-0.5">
                  {[40, 75, 95, 60, 35, 85, 50, 90, 45, 80].map((height, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${height * 0.25}%`, `${height}%`, `${height * 0.25}%`] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7 + Math.sin(i) * 0.3,
                        delay: i * 0.07,
                        ease: "easeInOut"
                      }}
                      className={`w-[2px] sm:w-[2.5px] rounded-full ${
                        i % 3 === 0 ? 'bg-gradient-to-t from-brand-purple to-pink-500' :
                        i % 2 === 0 ? 'bg-gradient-to-t from-brand-cyan to-blue-400' :
                        'bg-gradient-to-t from-violet-500 to-brand-magenta'
                      }`}
                    />
                  ))}
                </div>

                <div className="border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
                  <span className="text-[7px] text-slate-400 font-mono">STABLE</span>
                  <span className="text-[7px] text-brand-cyan font-mono font-bold animate-pulse">48.2 kHz</span>
                </div>
              </div>

              {/* Card 2: Experienced Male Podcaster (Offset-y / front) */}
              <div className="relative w-1/2 rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl border border-slate-800 bg-[#0B132B] mt-12 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <img
                  src={hero.imageRight}
                  alt="Professional experienced male podcast host recording with high-tech equipment"
                  className="h-full w-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient banner inside card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-white">
                  <div className="flex items-center gap-1.5">
                    <AudioLines className="h-4 w-4 text-brand-cyan" />
                    <div>
                      <h4 className="text-[11px] font-bold leading-tight">Pro Master Setup</h4>
                      <p className="text-[9px] text-slate-300">Live SEO Tracking Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backing Dashed Circle Decoration */}
              <div className="absolute -left-6 -top-6 h-24 w-24 border-2 border-dashed border-brand-purple/20 rounded-full -z-10 animate-spin [animation-duration:20s]" />
              <div className="absolute -right-6 -bottom-6 h-36 w-36 border-2 border-dashed border-brand-cyan/20 rounded-full -z-10 animate-spin [animation-duration:35s]" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Fading Audio Equalizer Visualizer at the very bottom border matching Screenshot */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent flex items-end justify-center select-none pointer-events-none">
        <div className="flex items-end justify-between w-full max-w-[90%] px-4 h-12 overflow-hidden gap-[3px] sm:gap-1.5 opacity-30">
          {equalizerBars.map((barHeight, idx) => {
            // Generate color palette based on position
            let barColor = 'bg-brand-purple/40';
            if (idx % 3 === 0) barColor = 'bg-brand-cyan/50';
            else if (idx % 5 === 0) barColor = 'bg-brand-magenta/40';
            else if (idx % 2 === 0) barColor = 'bg-indigo-400/40';

            // Add slight hover pulse
            return (
              <motion.div
                key={idx}
                animate={{ height: [barHeight * 0.4, barHeight, barHeight * 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1 + Math.sin(idx) * 0.5,
                  delay: (idx % 10) * 0.1,
                  ease: 'easeInOut',
                }}
                className={`w-[6px] sm:w-[10px] rounded-t-sm ${barColor} origin-bottom`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
