import { Play, User, Calendar, FolderHeart, Headphones, ChevronRight } from 'lucide-react';
import { PodcastEpisode } from '../data';
import { useWebsiteData } from '../context/WebsiteContext';

interface PodcastSectionProps {
  onPlayEpisode: (episode: PodcastEpisode) => void;
  onOpenConsultation: () => void;
}

export default function PodcastSection({ onPlayEpisode, onOpenConsultation }: PodcastSectionProps) {
  const { data } = useWebsiteData();
  const { episodes } = data;
  
  // Platform icons in miniature form
  const platforms = [

    { name: 'Youtube', color: '#FF0000', icon: (
      <svg className="h-3 w-3 fill-current text-white" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.028 0 12 0 12s0 3.972.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.525 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108c.502-1.865.502-5.837.502-5.837s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ), bgColor: 'bg-red-600' },
    { name: 'Spotify', color: '#1DB954', icon: (
      <svg className="h-3 w-3 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12 .007a12 12 0 1 0 12 12A12 12 0 0 0 12 .007zm5.5 17.339a.75.75 0 0 1-1.03.25c-2.821-1.72-6.371-2.111-10.553-1.159a.75.75 0 1 1-.33-1.46c4.568-1.041 8.5-1.579 11.666.361a.75.75 0 0 1 .247 1.008zm1.469-3.268a.938.938 0 0 1-1.288.309c-3.228-1.984-8.151-2.559-11.968-1.401a.937.937 0 1 1-.54-1.79c4.369-1.321 9.8-1.028 13.488 1.238a.938.938 0 0 1 .308 1.244zm.129-3.41c-3.87-2.3-10.252-2.511-13.98-1.38a1.125 1.125 0 1 1-.65-2.15c4.289-1.3 11.341-1.05 15.82 1.61a1.125 1.125 0 1 1-1.19 1.92z" />
      </svg>
    ), bgColor: 'bg-emerald-500' },
    { name: 'Google Podcast', color: '#EA4335', icon: (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="4" y1="9" x2="4" y2="15" className="stroke-white" />
        <line x1="12" y1="3" x2="12" y2="21" className="stroke-white" />
        <line x1="20" y1="9" x2="20" y2="15" className="stroke-white" />
      </svg>
    ), bgColor: 'bg-blue-500' },
    { name: 'Soundcloud', color: '#FF5500', icon: (
      <svg className="h-3 w-3 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12 12.002v3.997c0 .553.447.999 1 .999h7c.553 0 1-.446 1-.999v-3c0-.553-.447-1-1-1h-1v-1a4 4 0 0 0-4-4c-1.57 0-2.98.91-3.64 2.29-.39-.18-.81-.29-1.26-.29a2.5 2.5 0 0 0-2.31 1.54 1.5 1.5 0 0 0-.69-.17 1.5 1.5 0 0 0-1.5 1.5c0 .06.01.12.02.18-.32-.1-.66-.16-1.02-.16a2 2 0 0 0-2 2c0 .91.61 1.68 1.44 1.91.17.06.37.09.56.09h1.5l1.5-7.997c.05-.28.3-.47.58-.42.28.05.47.3.42.58l-1 7.839h1l1-8.839c.03-.28.27-.49.55-.46.28.03.49.27.46.55l-1 8.749h1l1.5-11.841c.03-.28.28-.48.56-.44.28.03.48.28.44.56L12 12.002z" />
      </svg>
    ), bgColor: 'bg-orange-500' },
    { name: 'Apple Podcast', color: '#872EC4', icon: (
      <svg className="h-3 w-3 fill-none stroke-current text-white" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ), bgColor: 'bg-purple-600' },
  ];

  return (
    <section id="services" className="py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-14">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight">
              Podcasts That Rank,
              <br />
              Reach, and Grow
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              We help podcasters increase visibility, attract the right audience, and rank higher on Spotify, Apple Podcasts, and Google Podcasts through proven SEO strategies.
            </p>
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 font-bold px-6 py-2.5 text-sm tracking-wide shadow-sm hover:shadow-md transition-all shrink-0"
              id="podcasts-more-btn"
            >
              More Podcast
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="group bg-[#0B132B] rounded-2xl overflow-hidden shadow-md border border-slate-800 flex flex-col justify-between transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-900/50 hover:shadow-xl"
              id={`podcast-card-${episode.id}`}
            >
              <div>
                {/* Thumbnail with overlay Play trigger */}
                <div className="relative aspect-[1.4] overflow-hidden bg-[#070B1E]">
                  <img
                    src={episode.image}
                    alt={episode.title}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle black overlay on hover */}
                  <div className="absolute inset-0 bg-slate-950/35 group-hover:bg-slate-950/50 transition-all duration-300 flex items-center justify-center" />
                  
                  {/* Play Episode Floating Interactive Overlay Button */}
                  <button
                    onClick={() => onPlayEpisode(episode)}
                    className="absolute bottom-4 left-4 bg-[#070A15]/95 hover:bg-[#121933] text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border border-slate-800 transition-transform hover:scale-105 active:scale-95"
                    id={`play-btn-${episode.id}`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-white shadow-sm">
                      <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase">Play Episode</span>
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug group-hover:text-brand-cyan transition-colors line-clamp-2">
                    {episode.title}
                  </h3>
                  
                  {/* Metadata labels */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-slate-800 text-[11px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-brand-purple" />
                      {episode.host}
                    </span>
                    <span className="flex items-center gap-1">
                      <Headphones className="h-3.5 w-3.5 text-brand-magenta" />
                      Episodes: {episode.episodes}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderHeart className="h-3.5 w-3.5 text-brand-cyan" />
                      {episode.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Listen on Platform Row */}
              <div className="px-5 py-4 bg-[#0E1B3D] border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Listen on:
                </span>
                <div className="flex items-center gap-1.5">
                  {platforms.map((plat) => (
                    <div
                      key={plat.name}
                      title={`Available on ${plat.name}`}
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${plat.bgColor} hover:scale-115 transition-transform shadow-sm cursor-pointer`}
                    >
                      {plat.icon}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
