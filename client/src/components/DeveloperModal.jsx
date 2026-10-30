import React from 'react';
import { X, ExternalLink, Mail, Github, Linkedin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DeveloperModal({ isOpen, onClose, theme }) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl relative border transition-all ${
          isLight 
            ? 'bg-white/95 border-purple-200 text-[#171228] shadow-purple-500/10' 
            : 'bg-[#1a142c]/95 border-white/15 text-white shadow-[#7b39fc]/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
            isLight ? 'hover:bg-neutral-100 text-neutral-500' : 'hover:bg-white/10 text-white/60'
          }`}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Avatar with pulsing status indicator */}
        <div className="relative w-22 h-22 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#7b39fc] via-[#9055fa] to-[#c084fc] flex items-center justify-center text-white text-2xl font-extrabold shadow-xl shadow-[#7b39fc]/30 font-['Manrope']">
            AC
          </div>
          <span 
            className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#1a142c] rounded-full shadow-md" 
            title="Available for opportunities"
          />
        </div>

        {/* Developer Info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['Cabin'] font-semibold bg-[#7b39fc]/15 text-[#7b39fc] border border-[#7b39fc]/30 mb-2">
            <Sparkles size={12} /> Lead Architect
          </div>
          <h3 className="font-['Manrope'] font-bold text-2xl tracking-tight">
            Anand Choubey
          </h3>
          <p className={`text-sm mt-1 font-['Inter'] ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
            Full-Stack Developer & Software Engineer
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 my-5">
          {['React / Next.js', 'FastAPI & Python', 'Node.js', 'FFmpeg / Streams', 'Docker'].map((tech) => (
            <span 
              key={tech}
              className={`text-[11px] font-medium font-['Cabin'] px-2.5 py-1 rounded-lg ${
                isLight 
                  ? 'bg-neutral-100 text-neutral-700 border border-neutral-200' 
                  : 'bg-white/5 text-white/70 border border-white/10'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons (Direct Links with No Raw Usernames) */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* LinkedIn Button */}
          <a
            href="https://linkedin.com/in/anand-choubey-979b17326"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-['Cabin'] font-semibold text-sm bg-[#0077b5] hover:bg-[#006396] text-white shadow-md shadow-[#0077b5]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Linkedin size={18} />
            <span>Connect on LinkedIn</span>
            <ExternalLink size={14} className="opacity-70 ml-auto" />
          </a>

          {/* GitHub Button */}
          <a
            href="https://github.com/isitanand"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-['Cabin'] font-semibold text-sm border shadow-md transition-all hover:scale-[1.02] cursor-pointer ${
              isLight
                ? 'bg-[#24292e] text-white hover:bg-[#1b1f23] border-transparent'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
            }`}
          >
            <Github size={18} />
            <span>View GitHub Profile</span>
            <ExternalLink size={14} className="opacity-70 ml-auto" />
          </a>

          {/* Email Button */}
          <a
            href="mailto:anandchoubey2005@gmail.com"
            className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-['Cabin'] font-medium text-xs transition-colors cursor-pointer ${
              isLight
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                : 'bg-white/5 hover:bg-white/10 text-white/75'
            }`}
          >
            <Mail size={15} />
            <span>Send Direct Message (Email)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
