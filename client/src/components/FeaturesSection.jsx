import React, { useState } from 'react';
import { 
  Shield, Zap, Film, Music, Cpu, HardDrive, 
  ChevronDown, Server, Sparkles, ExternalLink,
  Github, Linkedin, Mail, Heart, CheckCircle2
} from 'lucide-react';

export default function FeaturesSection({ theme }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const isLight = theme === 'light';

  const platforms = [
    { 
      name: 'YouTube', 
      badge: '4K / 60FPS', 
      desc: 'Shorts, VODs & Playlists',
      gradient: 'from-red-500/20 to-red-600/5',
      border: 'hover:border-red-500/50',
      tagColor: 'text-red-400 bg-red-500/10'
    },
    { 
      name: 'TikTok', 
      badge: 'No Watermark', 
      desc: 'Lossless MP4 Video',
      gradient: 'from-cyan-500/20 to-cyan-600/5',
      border: 'hover:border-cyan-400/50',
      tagColor: 'text-cyan-400 bg-cyan-500/10'
    },
    { 
      name: 'Instagram', 
      badge: 'Reels & Stories', 
      desc: 'Original Quality MP4',
      gradient: 'from-pink-500/20 to-pink-600/5',
      border: 'hover:border-pink-500/50',
      tagColor: 'text-pink-400 bg-pink-500/10'
    },
    { 
      name: 'SoundCloud', 
      badge: '320kbps MP3', 
      desc: 'HQ Audio Extraction',
      gradient: 'from-orange-500/20 to-orange-600/5',
      border: 'hover:border-orange-500/50',
      tagColor: 'text-orange-400 bg-orange-500/10'
    },
    { 
      name: 'Twitter / X', 
      badge: '1080p Video', 
      desc: 'Instant Clip Capture',
      gradient: 'from-sky-500/20 to-sky-600/5',
      border: 'hover:border-sky-400/50',
      tagColor: 'text-sky-400 bg-sky-500/10'
    },
    { 
      name: 'Vimeo', 
      badge: 'Pro Streams', 
      desc: 'Lossless Bitrate Stream',
      gradient: 'from-blue-500/20 to-blue-600/5',
      border: 'hover:border-blue-400/50',
      tagColor: 'text-blue-400 bg-blue-500/10'
    },
    { 
      name: 'Twitch', 
      badge: 'Clips & VODs', 
      desc: 'High FPS Capture',
      gradient: 'from-purple-500/20 to-purple-600/5',
      border: 'hover:border-purple-400/50',
      tagColor: 'text-purple-400 bg-purple-500/10'
    },
    { 
      name: 'Facebook', 
      badge: 'Watch HD', 
      desc: 'Public Reels & Videos',
      gradient: 'from-indigo-500/20 to-indigo-600/5',
      border: 'hover:border-indigo-400/50',
      tagColor: 'text-indigo-400 bg-indigo-500/10'
    }
  ];

  const features = [
    {
      icon: <Film className="text-[#a78bfa]" size={24} />,
      title: 'Lossless 4K & 8K Video',
      description: 'Download pristine media with zero quality degradation. Supports dynamic resolutions from 360p up to 4K UHD at 60 FPS.',
      badge: 'Ultra HD'
    },
    {
      icon: <Music className="text-emerald-400" size={24} />,
      title: 'High-Bitrate Audio Ripper',
      description: 'Extract crystal-clear audio tracks up to 320kbps MP3 and M4A directly from live videos and sound playlists.',
      badge: 'Lossless 320k'
    },
    {
      icon: <Cpu className="text-cyan-400" size={24} />,
      title: 'FFmpeg Background Muxing',
      description: 'Pulls independent high-bitrate video and audio streams simultaneously, merging them on-the-fly via native background processes.',
      badge: 'Real-Time'
    },
    {
      icon: <Shield className="text-amber-400" size={24} />,
      title: 'Privacy-First Architecture',
      description: 'No accounts, no logs, and no trackers. All temporary processing files are purged immediately or within 10 minutes.',
      badge: 'Zero Logs'
    },
    {
      icon: <Zap className="text-rose-400" size={24} />,
      title: 'Adaptive Signature Bypass',
      description: 'Integrated with Node JS-runtimes to solve YouTube challenge tokens dynamically, preventing throttling or bot blocks.',
      badge: 'Auto-Bypass'
    },
    {
      icon: <Server className="text-purple-400" size={24} />,
      title: 'High-Throughput Daemon',
      description: 'Optimized server queue controllers capable of handling multi-gigabyte files with real-time download status polling.',
      badge: 'Max Bandwidth'
    }
  ];

  const faqs = [
    {
      q: 'Is CloudClip free to use?',
      a: 'Yes, CloudClip is 100% free with no hidden subscriptions, daily limits, or paywalls. You can process and download as many videos as you need.'
    },
    {
      q: 'What formats and resolutions are supported?',
      a: 'We support MP4, WebM, and MKV for video (up to 4K 60FPS) and MP3, M4A, and AAC for audio (up to 320kbps bitrate).'
    },
    {
      q: 'Do you store downloaded files on your servers?',
      a: 'No. CloudClip operates as an ephemeral stream pipeline. Files are temporarily cached only during the merge process, and an automated background daemon deletes all files after download or after 10 minutes of inactivity.'
    },
    {
      q: 'How does stream merging (muxing) work?',
      a: 'Modern video platforms serve 1080p and 4K video as separate video-only and audio-only streams to save bandwidth. CloudClip downloads both streams in parallel and uses FFmpeg to mux them into a single file with zero sync lag.'
    }
  ];

  return (
    <div className={`relative z-10 w-full transition-colors duration-300 ${
      isLight ? 'bg-[#f7f6fc] text-[#171228]' : 'bg-[#120f1d] text-white'
    }`}>
      {/* 1. Supported Platforms Section */}
      <section id="platforms" className={`py-20 border-t border-b transition-colors ${
        isLight ? 'bg-white/80 border-purple-100' : 'bg-[#161226]/60 border-white/10'
      }`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Cabin'] font-bold tracking-wider uppercase mb-3 bg-[#7b39fc]/15 text-[#7b39fc]">
            Universal Platform Engine
          </div>
          <h2 className="font-['Instrument_Serif'] text-4xl sm:text-5xl tracking-tight">
            Supported across 1,000+ streaming sites
          </h2>
          <p className={`text-sm mt-3 max-w-xl mx-auto font-['Inter'] ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
            Paste any public link. CloudClip automatically identifies stream codecs and resolves direct download routes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {platforms.map((p) => (
              <div 
                key={p.name}
                className={`group relative overflow-hidden rounded-2xl p-5 border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default ${
                  isLight 
                    ? 'bg-white border-neutral-200/80 shadow-sm' 
                    : 'bg-[rgba(26,20,44,0.6)] border-white/10'
                } ${p.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-['Manrope'] font-bold text-lg ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    {p.name}
                  </span>
                  <span className={`text-[10px] font-['Cabin'] font-bold px-2 py-0.5 rounded-full ${p.tagColor}`}>
                    {p.badge}
                  </span>
                </div>
                <p className={`text-xs font-['Inter'] ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                  {p.desc}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#7b39fc] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Fast Extraction</span>
                  <CheckCircle2 size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Technical Features Grid */}
      <section id="features" className="py-28 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Cabin'] font-bold tracking-wider uppercase mb-4 bg-[#7b39fc]/15 text-[#7b39fc]">
            <Sparkles size={14} /> Built for Maximum Performance
          </div>
          <h2 className="font-['Instrument_Serif'] text-4xl sm:text-6xl tracking-tight">
            Engineered for speed, fidelity, <span className="italic font-normal text-[#7b39fc]">and</span> privacy
          </h2>
          <p className={`font-['Inter'] text-base mt-4 ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
            Every layer of CloudClip is optimized to extract and package media streams faster than conventional web tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i}
              className={`rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group flex flex-col justify-between ${
                isLight 
                  ? 'bg-white border-neutral-200/90 shadow-sm hover:border-[#7b39fc]/40' 
                  : 'bg-[rgba(34,26,56,0.45)] backdrop-blur-md border-white/10 hover:border-[#7b39fc]/50 hover:bg-[rgba(34,26,56,0.7)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isLight ? 'bg-purple-50 border border-purple-100' : 'bg-white/5 border border-white/10'
                  }`}>
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-['Cabin'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7b39fc]/10 text-[#7b39fc]">
                    {f.badge}
                  </span>
                </div>

                <h3 className={`font-['Manrope'] font-bold text-lg mb-2 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {f.title}
                </h3>
                <p className={`font-['Inter'] text-sm leading-relaxed ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
                  {f.description}
                </p>
              </div>

              <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-medium ${
                isLight ? 'border-neutral-100 text-neutral-400' : 'border-white/5 text-white/40'
              }`}>
                <span>Module 0{i + 1}</span>
                <span className="text-[#7b39fc] font-semibold">Active Engine</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section id="faq" className={`py-24 border-t transition-colors ${
        isLight ? 'bg-white border-neutral-200/60' : 'bg-[#161226]/50 border-white/10'
      }`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs uppercase font-['Cabin'] font-bold tracking-widest text-[#7b39fc] mb-3">
              Common Questions
            </p>
            <h2 className="font-['Instrument_Serif'] text-4xl sm:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className={`rounded-xl overflow-hidden border transition-all ${
                  isLight 
                    ? 'bg-neutral-50/70 border-neutral-200' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className={`w-full text-left p-5 flex items-center justify-between font-['Manrope'] font-semibold text-base transition-colors cursor-pointer ${
                    isLight ? 'text-neutral-800 hover:text-[#7b39fc]' : 'text-white hover:text-[#a78bfa]'
                  }`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-200 ${
                      activeFaq === i ? 'rotate-180 text-[#7b39fc]' : isLight ? 'text-neutral-400' : 'text-white/40'
                    }`} 
                  />
                </button>
                {activeFaq === i && (
                  <div className={`px-5 pb-5 text-sm font-['Inter'] leading-relaxed border-t pt-3 ${
                    isLight ? 'border-neutral-200/60 text-neutral-600' : 'border-white/5 text-white/70'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Redesigned Premium SaaS Footer */}
      <footer className={`py-16 border-t font-['Inter'] transition-colors ${
        isLight ? 'bg-[#edeaf8] border-purple-200/60 text-neutral-700' : 'bg-[#0b0914] border-white/10 text-white/60'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Brand Col */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.04356 6.35771L13.6437 0.666504L26.2438 6.35771L13.6437 12.0489L1.04356 6.35771ZM1.04356 8.85771L13.6437 14.5489V27.3335L1.04356 21.6423V8.85771ZM26.2438 8.85771L13.6437 14.5489V27.3335L26.2438 21.6423V8.85771Z" fill="#7b39fc" />
                </svg>
                <span className={`font-['Manrope'] font-bold text-xl ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  CloudClip Studio
                </span>
              </div>
              <p className="text-sm max-w-sm leading-relaxed text-neutral-500">
                Next-generation stream extraction platform supporting 4K UHD video muxing and lossless 320kbps audio encoding.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-500">All Extraction Workers Operational</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className={`font-['Manrope'] font-bold text-sm mb-4 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                Quick Navigation
              </h5>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li><a href="#home" className="hover:text-[#7b39fc] transition-colors">Home Studio</a></li>
                <li><a href="#platforms" className="hover:text-[#7b39fc] transition-colors">Supported Platforms</a></li>
                <li><a href="#features" className="hover:text-[#7b39fc] transition-colors">Muxing Engine</a></li>
                <li><a href="#faq" className="hover:text-[#7b39fc] transition-colors">FAQ & Specs</a></li>
              </ul>
            </div>

            {/* Developer Connections */}
            <div>
              <h5 className={`font-['Manrope'] font-bold text-sm mb-4 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                Developer
              </h5>
              <p className="text-xs text-neutral-500 mb-3">Architected by Anand Choubey</p>
              <div className="flex items-center gap-2.5">
                <a 
                  href="https://linkedin.com/in/anand-choubey-979b17326" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                    isLight 
                      ? 'bg-white border-neutral-200 text-[#0077b5] shadow-sm hover:border-[#0077b5]' 
                      : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href="https://github.com/isitanand" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                    isLight 
                      ? 'bg-white border-neutral-200 text-neutral-800 shadow-sm hover:border-black' 
                      : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="GitHub Profile"
                >
                  <Github size={16} />
                </a>
                <a 
                  href="mailto:anandchoubey2005@gmail.com" 
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                    isLight 
                      ? 'bg-white border-neutral-200 text-neutral-800 shadow-sm hover:border-[#7b39fc]' 
                      : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Email Anand"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p>© 2026 CloudClip Studio. Open source architecture.</p>
            <p className="text-center sm:text-right max-w-md">
              CloudClip is designed for educational media processing. Users must respect original creator rights and platform guidelines.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
