import { ArrowUpRight, ChevronUp, Mail, Phone, MapPin, Mic, TrendingUp, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Logo from './Logo';
import { useWebsiteData } from '../context/WebsiteContext';

const formatSocialUrl = (url: string | undefined, defaultDomain?: string) => {
  if (!url || url === '#') {
    if (defaultDomain) {
      const baseDomain = defaultDomain.split('/')[0];
      return `https://${baseDomain}`;
    }
    return '#';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  if (trimmed.includes('.') || trimmed.includes('/')) {
    return `https://${trimmed}`;
  }
  
  if (defaultDomain) {
    return `https://${defaultDomain}/${trimmed}`;
  }
  
  return `https://${trimmed}`;
};

interface FooterProps {
  onOpenConsultation: () => void;
}

export default function Footer({ onOpenConsultation }: FooterProps) {
  const { data } = useWebsiteData();
  const { contactInfo } = data;

  const footer = {
    ctaTitle: 'Doulot Ali Podcast Ranking Media Starting Today',
    description: 'Doulot Ali Podcast Ranking Media helps podcasters rank higher, grow faster, and reach the right audience through proven SEO and marketing strategies.',
    address: contactInfo?.address || 'Khoksa, Kushtia, Bangladesh',
    email: contactInfo?.email || 'doulotaligettopgrowth@gmail.com',
    phone: contactInfo?.phone || '+880 1765-068860',
    copyright: contactInfo?.copyright || 'Copyright © 2026 Doulot Ali Podcast Ranking Media, All rights reserved.',
    socials: {
      facebook: formatSocialUrl(contactInfo?.facebook, 'facebook.com'),
      instagram: formatSocialUrl(contactInfo?.instagram, 'instagram.com'),
      twitter: formatSocialUrl(contactInfo?.twitter, 'twitter.com'),
    }
  };

  const handleScrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: id === '#home' ? 0 : elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const platforms = [
    { name: 'Youtube', icon: (
      <svg className="h-3.5 w-3.5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.028 0 12 0 12s0 3.972.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.525 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108c.502-1.865.502-5.837.502-5.837s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ), bgColor: 'bg-red-600' },
    { name: 'Spotify', icon: (
      <svg className="h-3.5 w-3.5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12 .007a12 12 0 1 0 12 12A12 12 0 0 0 12 .007zm5.5 17.339a.75.75 0 0 1-1.03.25c-2.821-1.72-6.371-2.111-10.553-1.159a.75.75 0 1 1-.33-1.46c4.568-1.041 8.5-1.579 11.666.361a.75.75 0 0 1 .247 1.008zm1.469-3.268a.938.938 0 0 1-1.288.309c-3.228-1.984-8.151-2.559-11.968-1.401a.937.937 0 1 1-.54-1.79c4.369-1.321 9.8-1.028 13.488 1.238a.938.938 0 0 1 .308 1.244zm.129-3.41c-3.87-2.3-10.252-2.511-13.98-1.38a1.125 1.125 0 1 1-.65-2.15c4.289-1.3 11.341-1.05 15.82 1.61a1.125 1.125 0 1 1-1.19 1.92z" />
      </svg>
    ), bgColor: 'bg-emerald-500' },
    { name: 'Google Podcast', icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="4" y1="9" x2="4" y2="15" className="stroke-white" />
        <line x1="12" y1="3" x2="12" y2="21" className="stroke-white" />
        <line x1="20" y1="9" x2="20" y2="15" className="stroke-white" />
      </svg>
    ), bgColor: 'bg-blue-500' },
    { name: 'Soundcloud', icon: (
      <svg className="h-3.5 w-3.5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12 12.002v3.997c0 .553.447.999 1 .999h7c.553 0 1-.446 1-.999v-3c0-.553-.447-1-1-1h-1v-1a4 4 0 0 0-4-4c-1.57 0-2.98.91-3.64 2.29-.39-.18-.81-.29-1.26-.29a2.5 2.5 0 0 0-2.31 1.54 1.5 1.5 0 0 0-.69-.17 1.5 1.5 0 0 0-1.5 1.5c0 .06.01.12.02.18-.32-.1-.66-.16-1.02-.16a2 2 0 0 0-2 2c0 .91.61 1.68 1.44 1.91.17.06.37.09.56.09h1.5l1.5-7.997c.05-.28.3-.47.58-.42.28.05.47.3.42.58l-1 7.839h1l1-8.839c.03-.28.27-.49.55-.46.28.03.49.27.46.55l-1 8.749h1l1.5-11.841c.03-.28.28-.48.56-.44.28.03.48.28.44.56L12 12.002z" />
      </svg>
    ), bgColor: 'bg-orange-500' },
    { name: 'Apple Podcast', icon: (
      <svg className="h-3.5 w-3.5 fill-none stroke-current text-white" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ), bgColor: 'bg-purple-600' },
  ];

  return (
    <footer className="bg-[#040816]/95 text-slate-300 pt-16 pb-8 border-t border-slate-800/80" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top integrated CTA banner matching Screenshot 9 */}
        <div
          onClick={onOpenConsultation}
          className="bg-[#0B132B]/80 hover:bg-[#111C3D]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-16 cursor-pointer transition-all duration-300 group"
          id="footer-top-cta"
        >
          <div className="text-center sm:text-left space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight leading-tight">
              Grow Bigger and Rank Smarter with
              <br />
              {footer.ctaTitle}
            </h3>
          </div>
          
          {/* Circular green indicator arrow container */}
          <div className="relative shrink-0 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-brand-cyan text-slate-950 shadow-lg shadow-cyan-900/30 transition-transform duration-300 group-hover:scale-105 active:scale-95">
            <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* 4 Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800 text-sm">
          
          {/* Col 1: Logo & brand presentation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2" id="footer-logo">
              <Logo size="sm" />
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed text-left">
              {footer.description}
            </p>

            {/* Listen On miniature row */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Listen on:
              </span>
              <div className="flex items-center gap-1.5">
                {platforms.map((plat) => (
                  <div
                    key={plat.name}
                    title={`Listen on ${plat.name}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${plat.bgColor} hover:scale-110 transition-transform shadow-sm cursor-pointer`}
                  >
                    {plat.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Useful links */}
          <div className="lg:col-span-2 text-left space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider">Useful Link</h4>
            <ul className="space-y-2 text-slate-400 text-xs sm:text-sm font-medium">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About Us', href: '#about' },
                { name: 'Services', href: '#services' },
                { name: 'Contact Us', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection(link.href);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social handles */}
          <div className="lg:col-span-2 text-left space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider">Social Media</h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(footer.socials).map(([name, url]) => {
                let IconComponent = null;
                let hoverColor = 'hover:bg-blue-600';
                
                if (name === 'facebook') {
                  IconComponent = Facebook;
                  hoverColor = 'hover:bg-blue-600 hover:text-white hover:border-blue-600';
                } else if (name === 'instagram') {
                  IconComponent = Instagram;
                  hoverColor = 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:to-purple-600 hover:text-white hover:border-pink-500';
                } else if (name === 'twitter') {
                  IconComponent = Twitter;
                  hoverColor = 'hover:bg-sky-500 hover:text-white hover:border-sky-500';
                } else if (name === 'linkedin') {
                  IconComponent = Linkedin;
                  hoverColor = 'hover:bg-blue-700 hover:text-white hover:border-blue-700';
                }

                if (!IconComponent) return null;

                return (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 ${hoverColor} transition-all duration-300 shadow-md hover:scale-110 hover:-translate-y-0.5`}
                    title={`Follow us on ${name}`}
                    aria-label={`Follow us on ${name}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 4: Contact region matching details */}
          <div className="lg:col-span-4 text-left space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider">Our Contact</h4>
            <ul className="space-y-3.5 text-slate-400 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-brand-cyan mt-0.5 shrink-0" />
                <span>{footer.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4.5 w-4.5 text-brand-cyan mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300 text-xs uppercase leading-none mb-1">Email</p>
                  <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
                    {footer.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4.5 w-4.5 text-brand-cyan mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300 text-xs uppercase leading-none mb-1">Phone</p>
                  <a href={`tel:${footer.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {footer.phone}
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row with chevron upward top scroll */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 font-medium">
          <p className="text-center sm:text-left">
            {footer.copyright}
          </p>
          
          <button
            onClick={() => handleScrollToSection('#home')}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
            id="back-to-top-btn"
            aria-label="Back to top"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
