import React, { useState } from 'react';
import { 
  Shield, Zap, Film, Music, Cpu, HardDrive, 
  CheckCircle2, ChevronDown, Lock, Server, 
  Sparkles, RefreshCw, Layers
} from 'lucide-react';

export default function FeaturesSection({ onScrollToTop }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const platforms = [
    { name: 'YouTube', badge: '4K / 60FPS', color: '#ff0000' },
    { name: 'TikTok', badge: 'No Watermark', color: '#00f2fe' },
    { name: 'Instagram', badge: 'Reels / Stories', color: '#e1306c' },
    { name: 'SoundCloud', badge: '320kbps MP3', color: '#ff5500' },
    { name: 'Twitter / X', badge: '1080p Video', color: '#1da1f2' },
    { name: 'Vimeo', badge: 'Pro Streams', color: '#1ab7ea' },
    { name: 'Twitch', badge: 'Clips & VODs', color: '#9146ff' },
    { name: 'Facebook', badge: 'Watch HD', color: '#1877f2' }
  ];

  const features = [
    {
      icon: <Film className="text-[#a78bfa]" size={26} />,
      title: 'Lossless 4K & 8K Video',
      description: 'Download pristine media with zero quality degradation. Supports dynamic resolutions from 360p up to 4K UHD at 60 FPS.'
    },
    {
      icon: <Music className="text-emerald-400" size={26} />,
      title: 'High-Bitrate Audio Ripper',
      description: 'Extract crystal-clear audio tracks up to 320kbps MP3 and M4A directly from live videos and sound playlists.'
    },
    {
      icon: <Cpu className="text-cyan-400" size={26} />,
      title: 'FFmpeg Background Muxing',
      description: 'Pulls independent high-bitrate video and audio streams simultaneously, merging them on-the-fly via native background processes.'
    },
    {
      icon: <Shield className="text-amber-400" size={26} />,
      title: 'Privacy-First Architecture',
      description: 'No accounts, no logs, and no trackers. All temporary processing files are purged immediately or within 10 minutes.'
    },
    {
      icon: <Zap className="text-rose-400" size={26} />,
      title: 'Adaptive Signature Bypass',
      description: 'Integrated with Node JS-runtimes to solve YouTube challenge tokens dynamically, preventing throttling or bot blocks.'
    },
    {
      icon: <Server className="text-purple-400" size={26} />,
      title: 'High-Throughput Daemon',
      description: 'Optimized server queue controllers capable of handling multi-gigabyte files with real-time download status polling.'
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
    <div className="relative z-10 w-full bg-[#120f1d] text-white">
      {/* 1. Supported Platforms Ribbon */}
      <section id="platforms" className="py-16 border-t border-b border-white/10 bg-[#161226]/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs uppercase font-['Cabin'] font-bold tracking-widest text-[#a78bfa] mb-3">
            Universal Platform Coverage
          </p>
          <h2 className="font-['Instrument_Serif'] text-3xl sm:text-5xl text-white">
            Supported across 1,000+ streaming sites
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {platforms.map((p) => (
              <div 
                key={p.name}
                className="bg-white/5 border border-white/10 hover:border-[#7b39fc]/50 rounded-2xl p-4.5 flex flex-col items-center justify-center gap-1.5 transition-all hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                <span className="font-['Manrope'] font-bold text-base text-white">{p.name}</span>
                <span className="text-[11px] font-['Cabin'] font-semibold text-[#a78bfa] bg-[#7b39fc]/15 px-2.5 py-0.5 rounded-full">
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Technical Features Grid */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b39fc]/15 border border-[#7b39fc]/30 text-xs font-['Cabin'] font-semibold text-[#a78bfa] mb-4">
            <Sparkles size={14} /> Built for Maximum Performance
          </div>
          <h2 className="font-['Instrument_Serif'] text-4xl sm:text-6xl text-white tracking-tight">
            Engineered for speed, fidelity, <span className="italic font-normal">and</span> privacy
          </h2>
          <p className="text-white/60 font-['Inter'] text-base mt-4">
            Every layer of CloudClip is optimized to extract and package media streams faster than conventional web downloaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i}
              className="bg-[rgba(34,26,56,0.45)] backdrop-blur-md border border-white/10 hover:border-[#7b39fc]/50 rounded-2xl p-6 transition-all hover:bg-[rgba(34,26,56,0.7)] group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-['Manrope'] font-bold text-lg text-white mb-2">
                {f.title}
              </h3>
              <p className="font-['Inter'] text-sm text-white/60 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 bg-[#161226]/60 border-t border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs uppercase font-['Cabin'] font-bold tracking-widest text-[#a78bfa] mb-3">
            Simple 3-Step Process
          </p>
          <h2 className="font-['Instrument_Serif'] text-4xl sm:text-5xl text-white mb-12">
            How CloudClip Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
              <span className="text-4xl font-['Instrument_Serif'] font-bold text-[#7b39fc] opacity-80">01</span>
              <h4 className="font-['Manrope'] font-bold text-lg text-white mt-3 mb-2">Paste URL</h4>
              <p className="font-['Inter'] text-sm text-white/60">
                Copy any link from YouTube, TikTok, SoundCloud, or other supported platforms and paste it into the hero field.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
              <span className="text-4xl font-['Instrument_Serif'] font-bold text-[#7b39fc] opacity-80">02</span>
              <h4 className="font-['Manrope'] font-bold text-lg text-white mt-3 mb-2">Select Format</h4>
              <p className="font-['Inter'] text-sm text-white/60">
                Choose between high-resolution Video (4K, 1080p, 720p) or pure Audio extraction (320kbps MP3 or M4A).
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
              <span className="text-4xl font-['Instrument_Serif'] font-bold text-[#7b39fc] opacity-80">03</span>
              <h4 className="font-['Manrope'] font-bold text-lg text-white mt-3 mb-2">Instant Download</h4>
              <p className="font-['Inter'] text-sm text-white/60">
                Our server merges audio and video on-the-fly and serves the finished file directly to your downloads folder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase font-['Cabin'] font-bold tracking-widest text-[#a78bfa] mb-3">
            Common Questions
          </p>
          <h2 className="font-['Instrument_Serif'] text-4xl sm:text-5xl text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between font-['Manrope'] font-semibold text-base text-white hover:text-[#a78bfa] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-200 text-white/50 ${activeFaq === i ? 'rotate-180 text-[#7b39fc]' : ''}`} 
                />
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 text-sm font-['Inter'] text-white/70 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#0e0c17] text-center font-['Inter'] text-xs text-white/40">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['Manrope'] font-bold text-white text-base">CloudClip</span>
            <span>•</span>
            <span>Architected by Anand Choubey</span>
          </div>

          <p className="max-w-md text-center sm:text-right">
            CloudClip is an educational tool. Please respect content creators, platform copyright terms, and licensing regulations.
          </p>
        </div>
      </footer>
    </div>
  );
}
