import { Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteContext';

interface AboutSectionProps {
  onOpenConsultation: () => void;
}

export default function AboutSection({ onOpenConsultation }: AboutSectionProps) {
  const { data } = useWebsiteData();
  const { about } = data;

  return (
    <section id="about" className="py-20 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Gradient Overlays */}
          <div className="lg:col-span-5 relative" id="about-visual-container">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0B132B] max-w-md mx-auto lg:max-w-none">
              <img
                src={about.image}
                alt="Professional podcast host in studio setting speaking into high-grade microphone"
                className="w-full aspect-[4/5] object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Bottom Left Floating Badged Icon with a pulse */}
              <div className="absolute -bottom-4 -left-4 bg-slate-950/90 p-3 rounded-2xl shadow-xl z-10 border border-slate-800">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple text-white shadow-md shadow-cyan-900/50">
                  <Mic className="h-6 w-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Backdrop visual accents */}
            <div className="absolute -top-6 -right-6 h-32 w-32 bg-purple-500/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-cyan-500/10 rounded-full blur-2xl -z-10" />
          </div>

          {/* Right Column: Copywriting and CTA */}
          <div className="lg:col-span-7 space-y-6 text-left" id="about-text-content">
            {/* Hot Pink Label */}
            <span className="text-xs font-bold tracking-widest text-brand-magenta uppercase block">
              {about.label}
            </span>

            {/* Section Header */}
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight">
              {about.title}
            </h2>

            {/* Slogan */}
            <p className="text-base sm:text-lg font-semibold text-slate-200 leading-snug">
              {about.subtitle}
            </p>

            {/* Body Description */}
            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {about.paragraphs.map((p, index) => (
                <p key={index} className={index === about.paragraphs.length - 1 ? "font-semibold text-slate-200 border-l-2 border-brand-cyan pl-3 py-1" : ""}>
                  {p}
                </p>
              ))}
            </div>

            {/* More About Us Action Button */}
            <div className="pt-4">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 font-bold px-7 py-3 text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-98"
                id="about-cta-btn"
              >
                {about.buttonText}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

