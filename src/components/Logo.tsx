import React, { useState } from 'react';
import { useWebsiteData } from '../context/WebsiteContext';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', iconOnly = false, size = 'md' }: LogoProps) {
  const { data, setAdminLoginOpen } = useWebsiteData();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Larger, highly readable dimensions based on size prop
  const iconSize = {
    sm: 'h-11 w-11 sm:h-12 sm:w-12',
    md: 'h-16 w-16 sm:h-20 sm:w-20',
    lg: 'h-28 w-28 sm:h-32 sm:w-32'
  }[size];

  const textSize = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-3xl sm:text-4xl'
  }[size];

  const separatorHeight = {
    sm: 'h-10 sm:h-11',
    md: 'h-14 sm:h-16',
    lg: 'h-24 sm:h-28'
  }[size];

  // Secret triple click trigger
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      const newCount = clickCount + 1;
      if (newCount >= 3) {
        setClickCount(0);
        setAdminLoginOpen(true);
      } else {
        setClickCount(newCount);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 ${className} cursor-pointer active:opacity-90 select-none`}
      id="custom-logo-container"
      onClick={handleLogoClick}
    >
      {/* High-Fidelity Image Logo Icon from the user's provided link */}
      <img
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjdEkYVNAUZM1_tR1DGSsit0OSIexo8UMbmxWQolhJ6Oj7p4d62IoXcf-Cp_eCFeOs0yRbZQp0iQYcnT9sA3a6WrxanDczROGNmeDWJYDxvJAVU8EEwRL8XVr8iaIGprlXGodIYBl750K79BBUKbacsuPTFGuKG8wBpmF4HFQ-G_1gH3MfkPVPMSjsGyId/s400/ChatGPT_Image_Jul_14__2026__12_45_33_AM-removebg-preview.png"
        alt="Podcast Ranking Hub Logo"
        className={`${iconSize} object-contain shrink-0 select-none`}
        referrerPolicy="no-referrer"
      />

      {/* Elegant Separator Line and Brand Text */}
      {!iconOnly && (
        <div className="flex items-center gap-3 sm:gap-4 select-none">
          {/* Vertical Separator Line matching the logo layout */}
          <div className={`${separatorHeight} w-[2px] bg-gradient-to-b from-violet-500 via-indigo-500 to-transparent opacity-80 rounded-full`} />

          {/* Doulot Ali / Gettop Growth layout */}
          <div className="flex flex-col justify-center text-left gap-0.5 sm:gap-1">
            <span className={`font-sans font-bold tracking-tight text-white ${textSize}`}>
              {data.logo.textTop}
            </span>
            <span className={`font-sans font-medium tracking-tight text-violet-400 ${textSize}`}>
              {data.logo.textBottom}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


