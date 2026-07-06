import { Youtube, Music, Radio, Globe, Podcast } from 'lucide-react';

export default function TrustSection() {
  const platforms = [
    {
      name: 'Youtube',
      color: 'text-red-400',
      bgColor: 'bg-red-950/30',
      icon: (
        <svg className="h-6 w-6 fill-current text-red-500" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.028 0 12 0 12s0 3.972.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.525 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108c.502-1.865.502-5.837.502-5.837s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Spotify',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/30',
      icon: (
        <svg className="h-6 w-6 fill-current text-emerald-400" viewBox="0 0 24 24">
          <path d="M12 .007a12 12 0 1 0 12 12A12 12 0 0 0 12 .007zm5.5 17.339a.75.75 0 0 1-1.03.25c-2.821-1.72-6.371-2.111-10.553-1.159a.75.75 0 1 1-.33-1.46c4.568-1.041 8.5-1.579 11.666.361a.75.75 0 0 1 .247 1.008zm1.469-3.268a.938.938 0 0 1-1.288.309c-3.228-1.984-8.151-2.559-11.968-1.401a.937.937 0 1 1-.54-1.79c4.369-1.321 9.8-1.028 13.488 1.238a.938.938 0 0 1 .308 1.244zm.129-3.41c-3.87-2.3-10.252-2.511-13.98-1.38a1.125 1.125 0 1 1-.65-2.15c4.289-1.3 11.341-1.05 15.82 1.61a1.125 1.125 0 1 1-1.19 1.92z" />
        </svg>
      ),
    },
    {
      name: 'Google Podcast',
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/30',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="4" y1="9" x2="4" y2="15" className="stroke-red-400" />
          <line x1="8" y1="6" x2="8" y2="18" className="stroke-blue-400" />
          <line x1="12" y1="3" x2="12" y2="21" className="stroke-green-400" />
          <line x1="16" y1="6" x2="16" y2="18" className="stroke-yellow-400" />
          <line x1="20" y1="9" x2="20" y2="15" className="stroke-purple-400" />
        </svg>
      ),
    },
    {
      name: 'Soundcloud',
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/30',
      icon: (
        <svg className="h-6 w-6 fill-current text-orange-500" viewBox="0 0 24 24">
          <path d="M12 12.002v3.997c0 .553.447.999 1 .999h7c.553 0 1-.446 1-.999v-3c0-.553-.447-1-1-1h-1v-1a4 4 0 0 0-4-4c-1.57 0-2.98.91-3.64 2.29-.39-.18-.81-.29-1.26-.29a2.5 2.5 0 0 0-2.31 1.54 1.5 1.5 0 0 0-.69-.17 1.5 1.5 0 0 0-1.5 1.5c0 .06.01.12.02.18-.32-.1-.66-.16-1.02-.16a2 2 0 0 0-2 2c0 .91.61 1.68 1.44 1.91.17.06.37.09.56.09h1.5l1.5-7.997c.05-.28.3-.47.58-.42.28.05.47.3.42.58l-1 7.839h1l1-8.839c.03-.28.27-.49.55-.46.28.03.49.27.46.55l-1 8.749h1l1.5-11.841c.03-.28.28-.48.56-.44.28.03.48.28.44.56L12 12.002z" />
        </svg>
      ),
    },
    {
      name: 'Apple Podcast',
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/30',
      icon: (
        <svg className="h-6 w-6 fill-none stroke-current text-purple-400" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#0b1229]/60 border-y border-slate-800/60 py-10" id="trust-bar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Label left column */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight leading-snug">
              Rank Higher on Every
              <br />
              Podcast Platform.
            </h2>
          </div>

          {/* Platforms right column */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-4 items-center justify-center text-center">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col items-center gap-2 group cursor-pointer transition-all duration-300"
                  id={`trust-platform-${platform.name.toLowerCase()}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${platform.bgColor} transition-transform duration-300 group-hover:scale-110 shadow-sm`}
                  >
                    {platform.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
