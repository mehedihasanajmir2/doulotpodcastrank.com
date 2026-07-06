import { motion } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteContext';

export default function StatsSection() {
  const { data } = useWebsiteData();
  const { stats } = data;

  return (
    <section className="py-12 bg-[#0b1229]/60 border-y border-slate-800/60" id="stats-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center justify-between">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 px-6 ${
                idx > 0 ? 'md:border-l border-slate-800/80' : ''
              }`}
              id={`stat-${idx}`}
            >
              {/* Giant Styled Number */}
              <div className={`font-display text-4xl sm:text-5xl font-black tracking-tight ${stat.color} leading-none`}>
                {stat.value}
              </div>

              {/* Text metadata */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {stat.label}
                </h4>
                <p className="text-xs text-slate-300 max-w-[200px] leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

