import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, TrendingUp, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface HeaderProps {
  onOpenConsultation: (planName?: string) => void;
}

export default function Header({ onOpenConsultation }: HeaderProps) {
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact Us', href: '#contact' },
  ];

  const handleLinkClick = (label: string, href: string) => {
    setActiveLink(label);
    setMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[#060b1e]/90 shadow-lg shadow-slate-950/20 border-b border-slate-800/50 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
      id="app-header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand matching Screenshot */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('Home', '#home');
            }}
            className="flex items-center gap-2 group"
            id="brand-logo"
          >
            <Logo />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.label, link.href);
                }}
                className={`relative text-sm font-medium transition-colors ${
                  activeLink === link.label
                    ? 'text-brand-cyan'
                    : 'text-slate-300 hover:text-white'
                }`}
                id={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
                {activeLink === link.label && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-cyan rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={() => onOpenConsultation()}
              className="inline-flex items-center justify-center rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 px-6 py-2.5 text-sm font-bold tracking-wide shadow-md hover:shadow-cyan-400/10 transition-all active:scale-98"
              id="header-cta-btn"
            >
              Get More Listeners
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-300 hover:bg-slate-800/60 rounded-lg transition-all"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-[#0b132b] overflow-hidden shadow-lg"
            id="mobile-nav-drawer"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.label, link.href)}
                  className={`block w-full text-left rounded-lg px-3 py-2 text-base font-semibold transition-colors ${
                    activeLink === link.label
                      ? 'bg-slate-800 text-brand-cyan'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                  id={`mobile-nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full text-center rounded-full bg-brand-cyan hover:bg-[#00e2c4] text-slate-950 py-3 text-sm font-bold tracking-wide transition-all"
                  id="mobile-header-cta-btn"
                >
                  Get More Listeners
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
