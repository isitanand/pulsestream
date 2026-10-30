import React, { useState } from 'react';
import { 
  ChevronDown, Menu, X, Shield, Sparkles, Zap, 
  HardDrive, History, User, Sun, Moon 
} from 'lucide-react';
import HeroDownloader from './HeroDownloader';

export default function HeroSection({ 
  addHistory, 
  showNotification, 
  preferences, 
  onOpenHistory, 
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

      {/* 2. Navbar Component (Top Overlay) */}
      <header className={`relative z-20 w-full px-6 md:px-[120px] py-[16px] flex items-center justify-between transition-colors ${
        isLight ? 'text-[#171228]' : 'text-white'
      }`}>
        {/* Left: Logo */}
        <a href="#home" className="flex items-center gap-3 cursor-pointer group">
          <svg 
            width="32" 
            height="32" 
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
          <span className={`font-['Manrope'] font-extrabold text-xl tracking-tight ${isLight ? 'text-[#171228]' : 'text-white'}`}>
            PulseStream
          </span>
        </a>

        {/* Center-Left: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#home" 
            className={`font-['Manrope'] font-medium text-[14px] hover:opacity-80 transition-opacity ${
              isLight ? 'text-[#171228]' : 'text-white'
            }`}
          >
            Home
          </a>

          <div className="relative">
            <button 
              onClick={() => setServicesDropdown(prev => !prev)}
              className={`flex items-center gap-1.5 font-['Manrope'] font-medium text-[14px] hover:opacity-80 transition-opacity cursor-pointer ${
                isLight ? 'text-[#171228]' : 'text-white'
              }`}
            >
              Supported Sites
              <ChevronDown size={15} className={`transition-transform duration-200 ${servicesDropdown ? 'rotate-180' : ''}`} />
            </button>

            {servicesDropdown && (
              <div className={`absolute top-full left-0 mt-2 w-56 rounded-xl p-2.5 shadow-2xl flex flex-col gap-1 z-30 border backdrop-blur-xl animate-in fade-in ${
                isLight 
                  ? 'bg-white/95 border-purple-100 text-[#171228] shadow-purple-900/10' 
                  : 'bg-[#1f1a32]/95 border-white/10 text-white shadow-black/60'
              }`}>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] hover:bg-[#7b39fc]/15 rounded-lg transition-colors flex items-center justify-between">
                  <span>YouTube 4K & Shorts</span>
                  <span className="text-[10px] text-[#7b39fc] font-bold">Ultra HD</span>
                </a>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] hover:bg-[#7b39fc]/15 rounded-lg transition-colors flex items-center justify-between">
                  <span>TikTok & Reels</span>
                  <span className="text-[10px] text-emerald-500 font-bold">No Watermark</span>
                </a>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] hover:bg-[#7b39fc]/15 rounded-lg transition-colors flex items-center justify-between">
                  <span>SoundCloud & Music</span>
                  <span className="text-[10px] text-amber-500 font-bold">320kbps</span>
                </a>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] hover:bg-[#7b39fc]/15 rounded-lg transition-colors">
                  <span>Twitter / X, Vimeo & 1,000+</span>
                </a>
              </div>
            )}
          </div>

          <a 
            href="#features" 
            className={`font-['Manrope'] font-medium text-[14px] hover:opacity-80 transition-opacity ${
              isLight ? 'text-[#171228]' : 'text-white'
            }`}
          >
            Features
          </a>

          <a 
            href="#faq" 
            className={`font-['Manrope'] font-medium text-[14px] hover:opacity-80 transition-opacity ${
              isLight ? 'text-[#171228]' : 'text-white'
            }`}
          >
            FAQ
          </a>
        </nav>

        {/* Right: Desktop Action Buttons + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-neutral-100 border-neutral-300 text-amber-500 shadow-sm'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={17} className="text-[#7b39fc]" /> : <Sun size={17} className="text-amber-300" />}
          </button>

          <button 
            type="button"
            onClick={onOpenHistory}
            className={`rounded-[8px] font-['Manrope'] font-semibold text-[14px] px-3.5 py-2 transition-all cursor-pointer flex items-center gap-1.5 border ${
              isLight 
                ? 'bg-white hover:bg-neutral-50 text-[#171228] border-neutral-300 shadow-sm' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <History size={15} />
            <span>History</span>
          </button>

          <button 
            type="button"
            onClick={onOpenDevInfo}
            className="bg-[#7b39fc] hover:bg-[#8f52ff] rounded-[8px] text-[#fafafa] font-['Manrope'] font-semibold text-[14px] px-4 py-2 shadow-md shadow-[#7b39fc]/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <User size={15} />
            <span>Developer</span>
          </button>
        </div>

        {/* Mobile Hamburger & Theme Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${
              isLight ? 'bg-white border-neutral-300 text-[#7b39fc]' : 'bg-white/10 border-white/20 text-amber-300'
            }`}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2 hover:opacity-80 transition-opacity cursor-pointer ${isLight ? 'text-[#171228]' : 'text-white'}`}
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 md:hidden animate-in fade-in duration-200 backdrop-blur-2xl ${
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
              onClick={() => { setMobileMenuOpen(false); onOpenHistory(); }}
              className={`w-full rounded-[8px] font-['Manrope'] font-semibold text-[15px] py-3 text-center border ${
                isLight ? 'bg-neutral-100 text-neutral-800 border-neutral-300' : 'bg-white/10 text-white border-white/20'
              }`}
            >
              Download History
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenDevInfo(); }}
              className="w-full bg-[#7b39fc] rounded-[8px] text-[#fafafa] font-['Manrope'] font-semibold text-[15px] py-3 text-center shadow-lg shadow-[#7b39fc]/30"
            >
              Developer Profile
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
