import React, { useState } from 'react';
import { ChevronDown, Menu, X, Shield, Sparkles, Zap, HardDrive, History, User } from 'lucide-react';
import HeroDownloader from './HeroDownloader';

export default function HeroSection({ addHistory, showNotification, preferences, onOpenHistory, onOpenDevInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between">
      {/* 1. Full-screen HTML5 Video Background (Opaque, covers viewport) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover min-h-screen pointer-events-none z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
      />

      {/* Subtle radial vignette to guarantee text legibility while keeping video opaque */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#120f1d] pointer-events-none z-1" />

      {/* 2. Navbar Component (Top Overlay) */}
      <header className="relative z-20 w-full bg-transparent px-6 md:px-[120px] py-[16px] flex items-center justify-between">
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
              fill="white" 
            />
          </svg>
          <span className="font-['Manrope'] font-bold text-white text-xl tracking-tight">
            CloudClip
          </span>
        </a>

        {/* Center-Left: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#home" 
            className="font-['Manrope'] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
          >
            Home
          </a>

          <div className="relative">
            <button 
              onClick={() => setServicesDropdown(prev => !prev)}
              className="flex items-center gap-1.5 font-['Manrope'] font-medium text-[14px] text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              Supported Sites
              <ChevronDown size={15} className={`transition-transform duration-200 ${servicesDropdown ? 'rotate-180' : ''}`} />
            </button>

            {servicesDropdown && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#1f1a32]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 shadow-2xl flex flex-col gap-1 z-30">
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] text-white/90 hover:bg-[#7b39fc]/20 rounded-lg transition-colors flex items-center justify-between">
                  <span>YouTube 4K & Shorts</span>
                  <span className="text-[10px] text-[#a78bfa] font-semibold">Popular</span>
                </a>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] text-white/90 hover:bg-[#7b39fc]/20 rounded-lg transition-colors flex items-center justify-between">
                  <span>TikTok & Reels</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">HD</span>
                </a>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] text-white/90 hover:bg-[#7b39fc]/20 rounded-lg transition-colors flex items-center justify-between">
                  <span>SoundCloud & Music</span>
                  <span className="text-[10px] text-amber-400 font-semibold">320kbps</span>
                </a>
                <a href="#platforms" onClick={() => setServicesDropdown(false)} className="px-3 py-2 text-xs font-['Manrope'] text-white/90 hover:bg-[#7b39fc]/20 rounded-lg transition-colors">
                  <span>Vimeo, X & 1,000+ more</span>
                </a>
              </div>
            )}
          </div>

          <a 
            href="#features" 
            className="font-['Manrope'] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
          >
            Features
          </a>

          <a 
            href="#faq" 
            className="font-['Manrope'] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
          >
            FAQ
          </a>
        </nav>

        {/* Right: Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            type="button"
            onClick={onOpenHistory}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-[8px] text-white font-['Manrope'] font-semibold text-[14px] px-3.5 py-2 transition-all cursor-pointer flex items-center gap-1.5"
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

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-white p-2 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col justify-between p-6 md:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.04356 6.35771L13.6437 0.666504L26.2438 6.35771L13.6437 12.0489L1.04356 6.35771ZM1.04356 8.85771L13.6437 14.5489V27.3335L1.04356 21.6423V8.85771ZM26.2438 8.85771L13.6437 14.5489V27.3335L26.2438 21.6423V8.85771Z" fill="white" />
              </svg>
              <span className="font-['Manrope'] font-bold text-white text-lg">CloudClip</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2 hover:opacity-80 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
          </div>

          <div className="flex flex-col gap-6 my-auto text-center">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-medium text-white hover:text-[#7b39fc] transition-colors"
            >
              Home
            </a>
            <a 
              href="#platforms" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-medium text-white hover:text-[#7b39fc] transition-colors"
            >
              Supported Sites
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-medium text-white hover:text-[#7b39fc] transition-colors"
            >
              Features
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-['Manrope'] text-2xl font-medium text-white hover:text-[#7b39fc] transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenHistory(); }}
              className="w-full bg-white/10 border border-white/20 rounded-[8px] text-white font-['Manrope'] font-semibold text-[15px] py-3 text-center"
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
        <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] bg-[rgba(85,80,110,0.4)] backdrop-blur-md border border-[rgba(164,132,215,0.5)] mb-5 sm:mb-6 transition-transform hover:scale-105 duration-200">
          <span className="bg-[#7b39fc] text-white text-[11px] font-['Cabin'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[6px]">
            New
          </span>
          <span className="font-['Cabin'] font-medium text-[14px] text-white">
            Say Hello to CloudClip Ultra v3.2
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-['Instrument_Serif'] text-white text-5xl sm:text-7xl lg:text-[92px] leading-[1.08] tracking-tight max-w-5xl">
          Download your favorite media instantly{' '}
          <span className="italic font-normal mx-1 sm:mx-2 font-['Instrument_Serif']">and</span>{' '}
          hassle-free
        </h1>

        {/* Subtext */}
        <p className="font-['Inter'] font-normal text-[15px] sm:text-[18px] text-white/75 max-w-[662px] mt-4 sm:mt-5 leading-relaxed">
          Extract high-definition video, audio, and streams across YouTube, TikTok, Vimeo, and 1,000+ platforms. Enjoy fast 4K stream muxing, lossless MP3s, and zero ads.
        </p>

        {/* 4. Interactive Hero Downloader Component (The Heart of the App) */}
        <HeroDownloader 
          addHistory={addHistory}
          showNotification={showNotification}
          preferences={preferences}
        />

        {/* Feature Pills under search bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs font-['Inter'] text-white/50">
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-[#a78bfa]" />
            <span>Sub-second 4K Extraction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-400" />
            <span>Zero Tracking & Ad-Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive size={14} className="text-cyan-400" />
            <span>Auto 10-Min Cache Cleanup</span>
          </div>
        </div>
      </main>

      {/* Bottom breathing room anchor */}
      <div className="relative z-10 w-full py-8 text-center">
        <a 
          href="#platforms" 
          className="inline-flex items-center gap-2 text-xs font-['Manrope'] text-white/40 hover:text-white transition-colors"
        >
          <span>Scroll to explore supported platforms</span>
          <ChevronDown size={14} className="animate-bounce" />
        </a>
      </div>
    </div>
  );
}
