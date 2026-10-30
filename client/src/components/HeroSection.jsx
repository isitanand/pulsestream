import React, { useState } from 'react';
import { 
  ChevronDown, Menu, X, Shield, Sparkles, Zap, 
  HardDrive, History, User, Sun, Moon, Sliders 
} from 'lucide-react';
import HeroDownloader from './HeroDownloader';

export default function HeroSection({ 
  addHistory, 
  showNotification, 
  preferences, 
  onOpenHistory, 
  onOpenSettings,
  onOpenDevInfo,
  theme,
  toggleTheme 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const isLight = theme === 'light';

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between">
      {/* 1. Full-screen HTML5 Video Background (Opaque, covers viewport) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover min-h-screen pointer-events-none z-0 transition-opacity duration-500 ${
          isLight ? 'opacity-35 brightness-110 saturate-150' : 'opacity-100'
        }`}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
      />

      {/* Theme adaptive overlay */}
      <div className={`absolute inset-0 pointer-events-none z-1 transition-colors duration-500 ${
        isLight 
          ? 'bg-gradient-to-b from-white/70 via-transparent to-[#f7f6fc]' 
          : 'bg-gradient-to-b from-black/50 via-transparent to-[#120f1d]'
      }`} />

      {/* 2. Navbar Component (Top Overlay with Perfectly Centered Nav & Refined Right Actions) */}
      <header className={`relative z-20 w-full px-5 sm:px-8 md:px-12 lg:px-16 py-4 flex items-center justify-between transition-colors ${
        isLight ? 'text-[#171228]' : 'text-white'
      }`}>
        {/* Left Column: Brand Logo & Title (flex-1 to anchor center nav symmetrically) */}
        <div className="flex-1 flex items-center justify-start">
          <a href="#home" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 28 28" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 transition-transform group-hover:scale-105"
              >
                <path 
                  d="M1.04356 6.35771L13.6437 0.666504L26.2438 6.35771L13.6437 12.0489L1.04356 6.35771ZM1.04356 8.85771L13.6437 14.5489V27.3335L1.04356 21.6423V8.85771ZM26.2438 8.85771L13.6437 14.5489V27.3335L26.2438 21.6423V8.85771Z" 
                  fill={isLight ? '#7b39fc' : 'white'} 
                />
              </svg>
            </div>
            <span className={`font-['Manrope'] font-extrabold text-xl tracking-tight ${isLight ? 'text-[#171228]' : 'text-white'}`}>
              PulseStream
            </span>
          </a>
        </div>

        {/* Center Column: Floating Glassmorphic Pill Navigation (Mathematically Centered in Screen) */}
        <div className="hidden lg:flex items-center justify-center flex-shrink-0">
          <nav className={`flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-2xl shadow-sm transition-all ${
            isLight
              ? 'bg-white/80 border-purple-200/70 shadow-purple-900/5 text-neutral-700'
              : 'bg-[#18122c]/70 border-white/10 shadow-black/40 text-white/85'
          }`}>
            <a 
              href="#home" 
              className={`px-4 py-1.5 rounded-full text-[13px] font-['Manrope'] font-medium transition-all ${
                isLight ? 'hover:bg-purple-100/60 hover:text-[#7b39fc]' : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </a>

            {/* Supported Sites Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setServicesDropdown(prev => !prev)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-['Manrope'] font-medium transition-all cursor-pointer ${
                  servicesDropdown 
                    ? isLight ? 'bg-purple-100/80 text-[#7b39fc]' : 'bg-white/15 text-white' 
                    : isLight ? 'hover:bg-purple-100/60 hover:text-[#7b39fc]' : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>Supported Sites</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${servicesDropdown ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdown && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-30 border backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
                  isLight 
                    ? 'bg-white/98 border-purple-100 text-[#171228] shadow-purple-900/15' 
                    : 'bg-[#18122c]/95 border-white/15 text-white shadow-black/70'
                }`}>
                  <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] font-medium hover:bg-[#7b39fc]/15 rounded-xl transition-colors flex items-center justify-between">
                    <span>YouTube 4K & Shorts</span>
                    <span className="text-[10px] text-[#7b39fc] font-bold">Ultra HD</span>
                  </a>
                  <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] font-medium hover:bg-[#7b39fc]/15 rounded-xl transition-colors flex items-center justify-between">
                    <span>TikTok & Reels</span>
                    <span className="text-[10px] text-emerald-500 font-bold">No Watermark</span>
                  </a>
                  <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] font-medium hover:bg-[#7b39fc]/15 rounded-xl transition-colors flex items-center justify-between">
                    <span>SoundCloud & Music</span>
                    <span className="text-[10px] text-amber-500 font-bold">320kbps</span>
                  </a>
                  <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] font-medium hover:bg-[#7b39fc]/15 rounded-xl transition-colors">
                    <span>Twitter / X, Vimeo & 1,000+</span>
                  </a>
                </div>
              )}
            </div>

            <a 
              href="#features" 
              className={`px-4 py-1.5 rounded-full text-[13px] font-['Manrope'] font-medium transition-all ${
                isLight ? 'hover:bg-purple-100/60 hover:text-[#7b39fc]' : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              Features
            </a>

            <a 
              href="#faq" 
              className={`px-4 py-1.5 rounded-full text-[13px] font-['Manrope'] font-medium transition-all ${
                isLight ? 'hover:bg-purple-100/60 hover:text-[#7b39fc]' : 'hover:bg-white/10 hover:text-white'
              }`}
            >
              FAQ
            </a>
          </nav>
        </div>

        {/* Right Column: Refined, Balanced Action Controls (flex-1 to anchor center nav symmetrically) */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Theme Toggle (Circular Glass Switch) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center border backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              isLight
                ? 'bg-white/90 hover:bg-white border-purple-200/80 text-[#7b39fc] shadow-purple-900/5'
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-amber-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* History Button (Compact Glass Pill) */}
          <button 
            type="button"
            onClick={onOpenHistory}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['Manrope'] font-semibold text-xs border backdrop-blur-md transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-sm ${
              isLight 
                ? 'bg-white/90 hover:bg-white text-neutral-800 border-purple-200/80 shadow-purple-900/5' 
                : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/15'
            }`}
            title="Download History"
          >
            <History size={14} className="text-[#7b39fc]" />
            <span>History</span>
          </button>

          {/* Settings Button (Compact Glass Pill) */}
          <button 
            type="button"
            onClick={onOpenSettings}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['Manrope'] font-semibold text-xs border backdrop-blur-md transition-all hover:scale-102 active:scale-98 cursor-pointer shadow-sm ${
              isLight 
                ? 'bg-white/90 hover:bg-white text-neutral-800 border-purple-200/80 shadow-purple-900/5' 
                : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/15'
            }`}
            title="Stream Engine Settings"
          >
            <Sliders size={14} className="text-[#7b39fc]" />
            <span>Settings</span>
          </button>

          {/* Developer Profile Button (Radiant Accent Pill) */}
          <button 
            type="button"
            onClick={onOpenDevInfo}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7b39fc] via-[#8c4bfb] to-[#a855f7] text-white font-['Manrope'] font-bold text-xs shadow-md shadow-[#7b39fc]/25 hover:shadow-lg hover:shadow-[#7b39fc]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="About Anand Choubey"
          >
            <User size={14} />
            <span>Developer</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`flex lg:hidden p-2 rounded-full border transition-all cursor-pointer ${
              isLight ? 'bg-white/90 border-purple-200 text-[#171228]' : 'bg-white/10 border-white/15 text-white'
            }`}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 lg:hidden animate-in fade-in duration-200 backdrop-blur-2xl ${
          isLight ? 'bg-white/98 text-[#171228]' : 'bg-black/95 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.04356 6.35771L13.6437 0.666504L26.2438 6.35771L13.6437 12.0489L1.04356 6.35771ZM1.04356 8.85771L13.6437 14.5489V27.3335L1.04356 21.6423V8.85771ZM26.2438 8.85771L13.6437 14.5489V27.3335L26.2438 21.6423V8.85771Z" fill="#7b39fc" />
              </svg>
              <span className="font-['Manrope'] font-bold text-lg">PulseStream</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:opacity-80 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto text-center">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-semibold hover:text-[#7b39fc] transition-colors"
            >
              Home
            </a>
            <a 
              href="#platforms" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-semibold hover:text-[#7b39fc] transition-colors"
            >
              Supported Sites
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-semibold hover:text-[#7b39fc] transition-colors"
            >
              Features
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-semibold hover:text-[#7b39fc] transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-neutral-200/20">
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenSettings(); }}
              className={`w-full rounded-2xl font-['Manrope'] font-semibold text-[15px] py-3 text-center border flex items-center justify-center gap-2 ${
                isLight ? 'bg-neutral-100 text-neutral-800 border-neutral-300' : 'bg-white/10 text-white border-white/20'
              }`}
            >
              <Sliders size={16} />
              <span>Stream Settings</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenHistory(); }}
              className={`w-full rounded-2xl font-['Manrope'] font-semibold text-[15px] py-3 text-center border flex items-center justify-center gap-2 ${
                isLight ? 'bg-neutral-100 text-neutral-800 border-neutral-300' : 'bg-white/10 text-white border-white/20'
              }`}
            >
              <History size={16} />
              <span>Download History</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenDevInfo(); }}
              className="w-full bg-[#7b39fc] rounded-2xl text-[#fafafa] font-['Manrope'] font-semibold text-[15px] py-3 text-center shadow-lg shadow-[#7b39fc]/30 flex items-center justify-center gap-2"
            >
              <User size={16} />
              <span>Developer Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Hero Content (Centered) */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 my-auto mt-16 sm:mt-24 md:mt-28 max-w-6xl mx-auto w-full">
        {/* Tagline Pill */}
        <div className={`inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] backdrop-blur-md border mb-5 sm:mb-6 transition-transform hover:scale-105 duration-200 ${
          isLight 
            ? 'bg-purple-100/80 border-purple-300/80 text-purple-900 shadow-sm' 
            : 'bg-[rgba(85,80,110,0.4)] border-[rgba(164,132,215,0.5)] text-white'
        }`}>
          <span className="bg-[#7b39fc] text-white text-[11px] font-['Cabin'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px]">
            New
          </span>
          <span className={`font-['Cabin'] font-medium text-[14px] ${isLight ? 'text-purple-950 font-semibold' : 'text-white'}`}>
            Say Hello to PulseStream Ultra v3.2
          </span>
        </div>

        {/* Headline */}
        <h1 className={`font-['Instrument_Serif'] text-5xl sm:text-7xl lg:text-[92px] leading-[1.08] tracking-tight max-w-5xl ${
          isLight ? 'text-[#171228]' : 'text-white'
        }`}>
          Download your favorite media instantly{' '}
          <span className="italic font-normal mx-1 sm:mx-2 font-['Instrument_Serif'] text-[#7b39fc]">and</span>{' '}
          hassle-free
        </h1>

        {/* Subtext */}
        <p className={`font-['Inter'] font-normal text-[15px] sm:text-[18px] max-w-[662px] mt-4 sm:mt-5 leading-relaxed ${
          isLight ? 'text-neutral-700' : 'text-white/75'
        }`}>
          Extract high-definition video, audio, and streams across YouTube, TikTok, Vimeo, and 1,000+ platforms. Enjoy fast 4K stream muxing, lossless MP3s, and zero ads.
        </p>

        {/* 4. Interactive Hero Downloader Component */}
        <HeroDownloader 
          addHistory={addHistory}
          showNotification={showNotification}
          preferences={preferences}
          onOpenSettings={onOpenSettings}
          theme={theme}
        />

        {/* Feature Pills under search bar */}
        <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs font-['Inter'] ${
          isLight ? 'text-neutral-600' : 'text-white/50'
        }`}>
          <div className="flex items-center gap-1.5 font-medium">
            <Zap size={14} className="text-[#7b39fc]" />
            <span>Sub-second 4K Extraction</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Shield size={14} className="text-emerald-500" />
            <span>Zero Tracking & Ad-Free</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <HardDrive size={14} className="text-cyan-500" />
            <span>Auto 10-Min Cache Cleanup</span>
          </div>
        </div>
      </main>

      {/* Bottom breathing room anchor */}
      <div className="relative z-10 w-full py-8 text-center">
        <a 
          href="#platforms" 
          className={`inline-flex items-center gap-2 text-xs font-['Manrope'] transition-colors ${
            isLight ? 'text-neutral-500 hover:text-[#7b39fc]' : 'text-white/40 hover:text-white'
          }`}
        >
          <span>Scroll to explore supported platforms</span>
          <ChevronDown size={14} className="animate-bounce" />
        </a>
      </div>
    </div>
  );
}
