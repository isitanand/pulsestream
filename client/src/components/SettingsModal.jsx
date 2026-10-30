import React, { useState } from 'react';
import { 
  X, Settings, Sliders, Film, Music, Shield, 
  Check, RotateCcw, Sparkles, Globe, Zap
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  preferences, 
  onSavePreferences, 
  showNotification,
  theme 
}) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  // Local state initialized with current preferences
  const [formData, setFormData] = useState({
    defaultFormat: preferences?.defaultFormat || 'video',
    defaultQuality: preferences?.defaultQuality || '1080p',
    audioQuality: preferences?.audioQuality || '320kbps',
    keepHistory: preferences?.keepHistory !== false,
    autoAnalyze: preferences?.autoAnalyze || false,
    language: preferences?.language || 'en'
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSavePreferences(formData);
    showNotification('Settings saved successfully!', 'success');
    onClose();
  };

  const handleReset = () => {
    const defaults = {
      defaultFormat: 'video',
      defaultQuality: '1080p',
      audioQuality: '320kbps',
      keepHistory: true,
      autoAnalyze: false,
      language: 'en'
    };
    setFormData(defaults);
    onSavePreferences(defaults);
    showNotification('Restored default preferences', 'info');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg rounded-2xl p-6 sm:p-7 shadow-2xl relative border transition-all ${
          isLight 
            ? 'bg-white/95 border-purple-200 text-[#171228] shadow-purple-500/10' 
            : 'bg-[#19142b]/95 border-white/15 text-white shadow-[#7b39fc]/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b mb-5 border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#7b39fc]/15 text-[#7b39fc]">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-xl tracking-tight">
                Stream Engine Settings
              </h3>
              <p className={`text-xs font-['Inter'] mt-0.5 ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                Configure default download formats, resolution and privacy
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isLight ? 'hover:bg-neutral-100 text-neutral-500' : 'hover:bg-white/10 text-white/60'
            }`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* 1. Default Format Preference */}
          <div>
            <label className={`block text-xs font-['Cabin'] uppercase tracking-wider font-semibold mb-2 ${
              isLight ? 'text-neutral-600' : 'text-white/60'
            }`}>
              Preferred Media Stream
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('defaultFormat', 'video')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-['Manrope'] font-semibold transition-all cursor-pointer ${
                  formData.defaultFormat === 'video'
                    ? 'bg-[#7b39fc] text-white border-[#7b39fc] shadow-md shadow-[#7b39fc]/30'
                    : isLight
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                <Film size={16} />
                <span>Video (MP4)</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('defaultFormat', 'audio')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-['Manrope'] font-semibold transition-all cursor-pointer ${
                  formData.defaultFormat === 'audio'
                    ? 'bg-[#7b39fc] text-white border-[#7b39fc] shadow-md shadow-[#7b39fc]/30'
                    : isLight
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                <Music size={16} />
                <span>Audio (MP3)</span>
              </button>
            </div>
          </div>

          {/* 2. Default Video Quality */}
          <div>
            <label className={`block text-xs font-['Cabin'] uppercase tracking-wider font-semibold mb-2 ${
              isLight ? 'text-neutral-600' : 'text-white/60'
            }`}>
              Default Video Resolution
            </label>
            <div className="relative">
              <select
                value={formData.defaultQuality}
                onChange={(e) => handleChange('defaultQuality', e.target.value)}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm font-['Manrope'] font-medium transition-colors cursor-pointer appearance-none ${
                  isLight 
                    ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-[#7b39fc] focus:bg-white' 
                    : 'bg-white/5 border-white/10 text-white focus:border-[#7b39fc] focus:bg-[#1f1a32]'
                } outline-none`}
              >
                <option value="best" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>
                  Best Available (4K / 2K Ultra HD)
                </option>
                <option value="1080p" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>
                  1080p Full HD (Recommended)
                </option>
                <option value="720p" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>
                  720p HD (Balanced Speed)
                </option>
                <option value="480p" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>
                  480p Standard
                </option>
                <option value="360p" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>
                  360p Compact (Data Saver)
                </option>
              </select>
            </div>
          </div>

          {/* 3. Audio Extraction Bitrate */}
          <div>
            <label className={`block text-xs font-['Cabin'] uppercase tracking-wider font-semibold mb-2 ${
              isLight ? 'text-neutral-600' : 'text-white/60'
            }`}>
              Lossless Audio Fidelity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '320kbps', label: '320 kbps', badge: 'Lossless' },
                { value: '256kbps', label: '256 kbps', badge: 'High' },
                { value: '128kbps', label: '128 kbps', badge: 'Standard' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('audioQuality', opt.value)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    formData.audioQuality === opt.value
                      ? 'bg-[#7b39fc]/20 border-[#7b39fc] text-[#7b39fc]'
                      : isLight
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="font-['Manrope'] font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] opacity-75">{opt.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Privacy & History Toggle */}
          <div className={`p-4 rounded-xl border transition-colors ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Shield size={18} />
                </div>
                <div>
                  <div className={`text-sm font-['Manrope'] font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    Preserve Download History
                  </div>
                  <div className={`text-xs ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                    Keep record of downloaded links in local storage
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.keepHistory}
                  onChange={(e) => handleChange('keepHistory', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7b39fc]"></div>
              </label>
            </div>
          </div>

          {/* 5. Auto Analyze Toggle */}
          <div className={`p-4 rounded-xl border transition-colors ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#7b39fc]/10 text-[#7b39fc]">
                  <Zap size={18} />
                </div>
                <div>
                  <div className={`text-sm font-['Manrope'] font-bold ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                    Auto-Extract on Paste
                  </div>
                  <div className={`text-xs ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                    Instantly analyze streams when pasting supported links
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.autoAnalyze}
                  onChange={(e) => handleChange('autoAnalyze', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7b39fc]"></div>
              </label>
            </div>
          </div>

          {/* 6. Language Selection */}
          <div>
            <label className={`block text-xs font-['Cabin'] uppercase tracking-wider font-semibold mb-2 ${
              isLight ? 'text-neutral-600' : 'text-white/60'
            }`}>
              Interface Localization
            </label>
            <div className="relative">
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm font-['Manrope'] font-medium transition-colors cursor-pointer appearance-none ${
                  isLight 
                    ? 'bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-[#7b39fc] focus:bg-white' 
                    : 'bg-white/5 border-white/10 text-white focus:border-[#7b39fc] focus:bg-[#1f1a32]'
                } outline-none`}
              >
                <option value="en" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>English (Global)</option>
                <option value="es" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>Español (Spanish)</option>
                <option value="fr" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>Français (French)</option>
                <option value="de" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>Deutsch (German)</option>
                <option value="hi" className={isLight ? 'text-neutral-800' : 'bg-[#19142b] text-white'}>हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between gap-3 border-inherit">
          <button
            type="button"
            onClick={handleReset}
            className={`text-xs font-['Manrope'] font-medium flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
              isLight ? 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100' : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`text-xs font-['Manrope'] font-semibold px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
                isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50' : 'border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#7b39fc] hover:bg-[#8f52ff] text-white text-xs font-['Manrope'] font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#7b39fc]/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
