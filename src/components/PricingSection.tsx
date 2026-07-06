import { Check, Sparkles, Flame, HelpCircle } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteContext';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
  onOpenConsultation: () => void;
}

export default function PricingSection({ onSelectPlan, onOpenConsultation }: PricingSectionProps) {
  const { data } = useWebsiteData();
  const { pricingPlans } = data;

  return (
    <section id="pricing" className="py-20 bg-transparent relative">
      {/* Background glow subtle effects */}
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Label, Header and Description */}
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

        {/* 3 Packages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const isPurple = plan.isHighlighted;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-left transition-all duration-300 hover:scale-[1.03] shadow-lg relative ${
                  isPurple
                    ? 'bg-brand-purple text-white ring-4 ring-purple-900/50 shadow-purple-950/50 scale-[1.03]'
                    : 'bg-[#0B132B]/80 text-white border border-slate-800'
                }`}
                id={`pricing-card-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Highlight badges for best value */}
                {isPurple && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-magenta text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-md">
                    <Flame className="h-3 w-3 fill-current" /> Most Popular
                  </div>
                )}


                <div>
                  {/* Top Header Row of card */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl font-bold tracking-tight">
                      {plan.name}
                    </h3>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        isPurple ? 'bg-white/20 text-white' : 'bg-purple-950 text-purple-300'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Slogan details */}
                  <p className={`text-xs leading-relaxed mb-6 ${isPurple ? 'text-purple-100' : 'text-slate-300'}`}>
                    {plan.description}
                  </p>

                  {/* Big price tag block */}
                  <div className="mb-6 flex items-baseline">
                    <div
                      className={`rounded-lg px-4 py-2 font-display text-2xl font-black ${
                        isPurple ? 'bg-white/15 text-white' : 'bg-brand-purple/20 text-purple-300'
                      }`}
                    >
                      $ {plan.price}
                    </div>
                    <span className={`text-[10px] font-semibold ml-2 uppercase tracking-wider ${isPurple ? 'text-purple-200' : 'text-slate-400'}`}>
                      One-time package
                    </span>
                  </div>

                  {/* Feature lists */}
                  <div className={`border-t pt-6 space-y-3 ${isPurple ? 'border-white/10' : 'border-slate-800'}`}>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold leading-tight">
                        <div className={`mt-0.5 rounded-full p-0.5 ${isPurple ? 'bg-white/20 text-white' : 'bg-purple-950 text-purple-300'}`}>
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <span className={isPurple ? 'text-purple-50' : 'text-slate-200'}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Button CTA */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all active:scale-97 ${
                      isPurple
                        ? 'bg-white text-brand-purple hover:bg-slate-50 shadow-md'
                        : 'bg-brand-purple text-white hover:bg-indigo-600 shadow-sm'
                    }`}
                    id={`pricing-btn-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Select Plan & Grow
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
