import { useWebsiteData } from '../context/WebsiteContext';

export default function ProcessSection() {
  const { data } = useWebsiteData();
  const { processSteps } = data;

  return (
    <section className="py-20 bg-transparent border-y border-slate-800/60" id="process-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Hot Pink label */}
        <span className="text-xs font-bold tracking-widest text-brand-magenta uppercase block">
          How Podcasts Grow
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight mt-2">
          How We Start Your Podcast Growth Journey
        </h2>

        {/* Subtext description */}
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed mb-16">
          A simple, proven process designed to analyze, optimize, and position your podcast for long-term visibility and rankings.
        </p>

        {/* Grid of 4 cards (2 columns on large screens, 1 on small) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {processSteps.map((step) => {
            const isImageLeft = step.layout === 'image-left';
            return (
              <div
                key={step.id}
                className="bg-[#0B132B] rounded-2xl overflow-hidden border border-slate-800 shadow-md transition-all duration-300 hover:shadow-lg hover:border-purple-900/50 flex flex-col sm:flex-row items-stretch"
                id={`process-card-${step.id}`}
              >
                {/* Image panel */}
                <div
                  className={`w-full sm:w-2/5 relative shrink-0 aspect-square sm:aspect-auto min-h-[200px] ${
                    !isImageLeft ? 'order-1 sm:order-2' : ''
                  }`}
                >
                  <img
                    src={step.image}
                    alt={`${step.title} illustration at PodcastTopRankMedia`}
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/30" />
                </div>

                {/* Text Content panel */}
                <div
                  className={`w-full sm:w-3/5 p-6 flex flex-col justify-center text-left ${
                    !isImageLeft ? 'order-2 sm:order-1' : ''
                  }`}
                >
                  {/* Small gradient decorative line */}
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan mb-4" />
                  
                  {/* Heading */}
                  <h3 className="text-lg font-bold font-display text-white leading-snug">
                    {step.title}
                  </h3>


                  {/* Body Copy */}
                  <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
