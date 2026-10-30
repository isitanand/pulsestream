import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DeveloperModal from './components/DeveloperModal';
import SettingsModal from './components/SettingsModal';
import { 
  X, History, Trash2, CheckCircle, 
  AlertTriangle, Info
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme_preference') || 'light';
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDevInfoOpen, setIsDevInfoOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Preferences (persisted in localstorage)
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('preferences');
    return saved ? JSON.parse(saved) : {
      defaultFormat: 'video',
      defaultQuality: '1080p',
      keepHistory: true,
      language: 'en'
    };
  });

  // History state (persisted in localstorage)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('download_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('theme_preference', theme);
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('download_history', JSON.stringify(history));
  }, [history]);

  const showNotification = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const addHistory = (item) => {
    if (!preferences.keepHistory) return;
    const log = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      date: Date.now()
    };
    setHistory(prev => [log, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
    showNotification('Download history cleared', 'success');
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    showNotification('Item removed from history', 'info');
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen theme-${theme} font-['Inter'] relative selection:bg-[#7b39fc] selection:text-white transition-colors duration-300`}>
      {/* 1. Fullscreen Hero Section */}
      <HeroSection 
        addHistory={addHistory}
        showNotification={showNotification}
        preferences={preferences}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDevInfo={() => setIsDevInfoOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 2. Features, Supported Sites & Modern Footer */}
      <FeaturesSection theme={theme} />

      {/* 3. Settings & Preferences Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSavePreferences={setPreferences}
        showNotification={showNotification}
        theme={theme}
      />

      {/* 4. Redesigned Developer Modal (Anand Choubey) */}
      <DeveloperModal 
        isOpen={isDevInfoOpen}
        onClose={() => setIsDevInfoOpen(false)}
        theme={theme}
      />

      {/* 5. History Modal */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsHistoryOpen(false)}
        >
          <div 
            className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl relative border ${
              isLight 
                ? 'bg-white text-neutral-900 border-neutral-200' 
                : 'bg-[#19142b] text-white border-white/15'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-4 border-b mb-4 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <h2 className="font-['Manrope'] font-bold text-xl flex items-center gap-2">
                <History size={20} className="text-[#7b39fc]" /> Download History
              </h2>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className={`p-1 rounded-full cursor-pointer ${isLight ? 'hover:bg-neutral-100 text-neutral-500' : 'hover:bg-white/10 text-white/60'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto flex flex-col gap-2.5 my-2">
              {history.length === 0 ? (
                <div className={`py-12 text-center text-sm ${isLight ? 'text-neutral-400' : 'text-white/50'}`}>
                  No records yet. Completed jobs will appear here.
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-xl flex items-center justify-between border ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="overflow-hidden pr-3">
                      <div className={`text-sm font-medium truncate ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                        {item.title}
                      </div>
                      <div className={`text-xs mt-0.5 ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                        {item.format} • {item.size} • {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHistoryItem(item.id)}
                      className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className={`pt-4 border-t flex justify-end ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
                <button 
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Clear All History
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Notifications Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="pointer-events-auto bg-[#1f1a32]/95 border border-white/15 text-white backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-top-2"
          >
            {n.type === 'success' && <CheckCircle size={18} className="text-emerald-400" />}
            {n.type === 'error' && <X size={18} className="text-rose-400" />}
            {n.type === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
            {n.type === 'info' && <Info size={18} className="text-[#a78bfa]" />}
            <span>{n.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
