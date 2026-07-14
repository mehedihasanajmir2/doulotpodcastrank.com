import { Check, Sparkles, Flame, HelpCircle } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteContext';
import { motion } from 'motion/react';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
  onOpenConsultation: () => void;
}

export default function PricingSection({ onSelectPlan, onOpenConsultation }: PricingSectionProps) {
  const { data } = useWebsiteData();
  const { pricingPlans } = data;

  return (
    <section id="pricing" className="py-20 bg-transparent relative overflow-x-hidden">
      {/* Background glow subtle effects */}
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Label, Header and Description */}
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="flex flex-col items-center"
        >
          <span className="text-xs font-bold tracking-widest text-brand-magenta uppercase block">
            Choose a Plan
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight mt-2">
            Choose Your Podcast Growth Plan
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
            Flexible plans designed to help you increase visibility, rank higher, and grow your audience with confidence.
          </p>

          {/* Discover More Accent CTA */}
          <div className="mt-6 mb-16">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 font-bold px-7 py-3 text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-98"
              id="pricing-discover-more-btn"
            >
              Discover More
            </button>
          </div>
        </motion.div>

        {/* 3 Packages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const nameLower = plan.name.toLowerCase();
            let styles = {
              bgClass: 'bg-gradient-to-b from-[#1b0a33] via-[#0c041a] to-[#04010a] border-2 border-violet-500 hover:border-violet-400 shadow-[0_0_35px_rgba(139,92,246,0.3)] ring-1 ring-violet-500/30',
              priceBgClass: 'bg-violet-900/40 text-white border border-violet-500/50 px-4 py-1.5 font-bold rounded-lg',
              badgeClass: 'bg-violet-600 text-white font-bold',
              checkIconClass: 'bg-violet-500 text-white border border-violet-400/40',
              btnClass: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold shadow-lg shadow-violet-900/40',
              textMutedClass: 'text-white font-bold',
              textNormalClass: 'text-white font-bold',
              badgeIcon: <Sparkles className="h-3 w-3 text-white fill-current" />,
              badgeText: 'Standard Package',
              hasBadge: true
            };

            if (nameLower.includes('starter')) {
              styles = {
                bgClass: 'bg-gradient-to-b from-[#05243a] via-[#02101a] to-[#01050a] border-2 border-cyan-500 hover:border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/20',
                priceBgClass: 'bg-cyan-900/40 text-white border border-cyan-500/50 px-4 py-1.5 font-bold rounded-lg',
                badgeClass: 'bg-cyan-600 text-white font-bold',
                checkIconClass: 'bg-cyan-500 text-white border border-cyan-400/40',
                btnClass: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold shadow-lg shadow-cyan-950/40',
                textMutedClass: 'text-white font-bold',
                textNormalClass: 'text-white font-bold',
                badgeIcon: <Sparkles className="h-3 w-3 text-white fill-current" />,
                badgeText: 'Starter Package',
                hasBadge: true
              };
            } else if (nameLower.includes('premium')) {
              styles = {
                bgClass: 'bg-gradient-to-b from-[#331c0a] via-[#1a0e05] to-[#0a0502] border-2 border-amber-500 hover:border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/20',
                priceBgClass: 'bg-amber-900/40 text-white border border-amber-500/50 px-4 py-1.5 font-bold rounded-lg',
                badgeClass: 'bg-amber-600 text-white font-bold',
                checkIconClass: 'bg-amber-500 text-white border border-amber-400/40',
                btnClass: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold shadow-lg shadow-amber-950/40',
                textMutedClass: 'text-white font-bold',
                textNormalClass: 'text-white font-bold',
                badgeIcon: <Flame className="h-3 w-3 text-white fill-current" />,
                badgeText: 'Premium Package',
                hasBadge: true
              };
            }

            return (
               <motion.div
                 key={plan.name}
                 initial={{ x: 120, opacity: 0 }}
                 whileInView={{ x: 0, opacity: 1 }}
                 viewport={{ once: true, margin: "-50px" }}
                 whileHover={{ y: -8 }}
                 transition={{
                   x: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 },
                   opacity: { duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 },
                   y: { duration: 0.3, ease: "easeOut" }
                 }}
                 style={{ willChange: "transform, opacity" }}
                 className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-lg relative transition-shadow duration-300 ${styles.bgClass}`}
                 id={`pricing-card-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
               >
                 {/* Highlight badge for specific statuses */}
                 {styles.hasBadge && (
                   <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-md ${
                     nameLower.includes('starter') ? 'bg-cyan-600' : nameLower.includes('premium') ? 'bg-amber-600' : 'bg-violet-600'
                   }`}>
                     {styles.badgeIcon} {styles.badgeText}
                   </div>
                 )}


                 <div>
                   {/* Top Header Row of card */}
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="font-display text-2xl font-black tracking-tight text-white">
                       {plan.name}
                     </h3>
                     <div className={`h-6 w-6 rounded-full flex items-center justify-center ${styles.checkIconClass}`}>
                       <Check className="h-4 w-4" strokeWidth={3} />
                     </div>
                   </div>

                   {/* Slogan details */}
                   <p className="text-sm leading-relaxed mb-6 text-white font-extrabold drop-shadow-md">
                     {plan.description}
                   </p>

                   {/* Big price tag block */}
                   <div className="mb-6 flex items-baseline">
                     <div className={`font-display text-3xl font-black text-white ${styles.priceBgClass} drop-shadow`}>
                       $ {plan.price}
                     </div>
                     <span className="text-xs font-black ml-3 uppercase tracking-wider text-white drop-shadow-sm">
                       One-time package
                     </span>
                   </div>

                   {/* Feature lists */}
                   <div className={`border-t pt-6 space-y-3 ${nameLower.includes('starter') ? 'border-cyan-500/20' : nameLower.includes('premium') ? 'border-amber-500/20' : 'border-violet-500/20'}`}>
                     {plan.features.map((feature, fIdx) => (
                       <div key={fIdx} className="flex items-start gap-3 text-sm font-bold leading-tight">
                         <div className={`mt-0.5 rounded-full p-0.5 ${styles.checkIconClass}`}>
                           <Check className="h-3.5 w-3.5" strokeWidth={3} />
                         </div>
                         <span className="text-white font-extrabold text-sm drop-shadow-sm">{feature}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Card Button CTA */}
                 <div className="mt-8 pt-4">
                   <button
                     onClick={() => onSelectPlan(plan.name)}
                     className={`w-full py-3 px-4 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all active:scale-97 ${styles.btnClass}`}
                     id={`pricing-btn-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                   >
                     Select Plan & Grow
                   </button>
                 </div>
               </motion.div>
             );
           })}
        </div>
        
      </div>
    </section>
  );
}
