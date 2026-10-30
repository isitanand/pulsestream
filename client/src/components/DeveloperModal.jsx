import React from 'react';
import { 
  X, ExternalLink, Mail, Github, Linkedin, 
  Globe, MapPin, ArrowUpRight, Sparkles 
} from 'lucide-react';

export default function DeveloperModal({ isOpen, onClose, theme }) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const socials = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'in/anand-choubey',
      desc: 'Professional network & experience',
      url: 'https://linkedin.com/in/anand-choubey-979b17326',
      icon: Linkedin,
      iconColor: 'text-[#0A66C2]',
      iconBg: isLight ? 'bg-[#0A66C2]/10 border-[#0A66C2]/20' : 'bg-[#0A66C2]/20 border-[#0A66C2]/30',
      hoverBorder: 'hover:border-[#0A66C2]/50 hover:shadow-[#0A66C2]/15'
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: '@isitanand',
      desc: 'Open-source code & repositories',
      url: 'https://github.com/isitanand',
      icon: Github,
      iconColor: isLight ? 'text-neutral-900' : 'text-white',
      iconBg: isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-white/10 border-white/15',
      hoverBorder: isLight ? 'hover:border-neutral-400 hover:shadow-black/10' : 'hover:border-white/40 hover:shadow-white/10'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      handle: 'anandchoubey.is-a.dev',
      desc: 'Live projects & engineering portfolio',
      url: 'https://anandchoubey.is-a.dev',
      icon: Globe,
      iconColor: 'text-[#7b39fc]',
      iconBg: isLight ? 'bg-purple-100 border-purple-200' : 'bg-[#7b39fc]/20 border-[#7b39fc]/30',
      hoverBorder: 'hover:border-[#7b39fc]/50 hover:shadow-[#7b39fc]/15'
    },
    {
      id: 'email',
      name: 'Direct Email',
      handle: 'anandchoubey2005@gmail.com',
      desc: 'Contract, collaboration & inquiries',
      url: 'mailto:anandchoubey2005@gmail.com',
      icon: Mail,
      iconColor: 'text-emerald-500',
      iconBg: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/20 border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500/50 hover:shadow-emerald-500/15'
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-[440px] rounded-3xl shadow-2xl relative border overflow-hidden transition-all animate-in zoom-in-95 duration-200 ${
          isLight 
            ? 'bg-white/98 border-purple-200/80 text-neutral-900 shadow-purple-900/15' 
            : 'bg-[#140f26]/98 border-white/15 text-white shadow-2xl shadow-[#7b39fc]/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Header Graphic */}
        <div className="relative h-28 w-full bg-gradient-to-tr from-[#3b1778] via-[#7b39fc]/40 to-[#191035] overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#7b39fc]/30 blur-2xl" />
          <div className="absolute top-4 left-6 w-24 h-24 rounded-full bg-indigo-500/20 blur-xl" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar floating halfway over the banner */}
          <div className="relative -mt-14 mb-3 inline-block">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#7b39fc] via-[#9156fd] to-[#c084fc] flex items-center justify-center text-white text-2xl font-extrabold shadow-xl font-['Manrope'] ring-4 ${
              isLight ? 'ring-white' : 'ring-[#140f26]'
            }`}>
              AC
            </div>
            {/* Live active beacon */}
            <span 
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 rounded-full ring-2 ring-emerald-500/30"
              style={{ borderColor: isLight ? '#ffffff' : '#140f26' }}
              title="Available for opportunities"
            />
          </div>

          {/* Profile Name & Subtitles */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Manrope'] font-extrabold text-2xl tracking-tight leading-tight">
                Anand Choubey
              </h3>
              <p className={`text-sm font-['Inter'] mt-0.5 font-medium ${isLight ? 'text-neutral-600' : 'text-white/70'}`}>
                Full-Stack & Systems Developer
              </p>
            </div>
          </div>

          {/* Location & Status Line */}
          <div className="flex items-center gap-4 mt-2.5 text-xs font-['Inter']">
            <div className={`flex items-center gap-1.5 ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
              <MapPin size={13} className="text-[#7b39fc]" />
              <span>Delhi NCR, India</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open to Roles</span>
            </div>
          </div>

          {/* Subtle Personal Tagline */}
          <p className={`text-xs mt-3.5 leading-relaxed font-['Inter'] ${isLight ? 'text-neutral-600' : 'text-white/65'}`}>
            Architecting high-fidelity media extraction engines, scalable microservices, and elegant web experiences.
          </p>

          {/* Divider */}
          <div className={`h-px w-full my-4 ${isLight ? 'bg-neutral-200/80' : 'bg-white/10'}`} />

          {/* Socials Showcase */}
          <div className="flex flex-col gap-2.5">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm ${
                    isLight 
                      ? 'bg-neutral-50/80 border-neutral-200/80 hover:bg-white text-neutral-800' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  } ${social.hoverBorder}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-105 ${social.iconBg}`}>
                      <Icon size={18} className={social.iconColor} />
                    </div>
                    <div>
                      <div className="font-['Manrope'] font-bold text-sm tracking-tight flex items-center gap-1.5">
                        <span>{social.name}</span>
                      </div>
                      <div className={`text-xs font-['Inter'] ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                        {social.handle}
                      </div>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-lg transition-all ${
                    isLight 
                      ? 'text-neutral-400 group-hover:text-neutral-900 group-hover:bg-neutral-100' 
                      : 'text-white/40 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    <ArrowUpRight size={17} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
