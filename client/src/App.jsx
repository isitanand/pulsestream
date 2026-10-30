import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import { 
  X, History, Trash2, Info, CheckCircle, 
  AlertTriangle, User
} from 'lucide-react';

export default function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#120f1d] text-white font-['Inter'] relative selection:bg-[#7b39fc] selection:text-white">
      {/* 1. Fullscreen Hero Section (with built-in Downloader & Video Background) */}
      <HeroSection 
        addHistory={addHistory}
        showNotification={showNotification}
        preferences={preferences}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDevInfo={() => setIsDevInfoOpen(true)}
      />

      {/* 2. Complete Supporting Sections Below Hero */}
      <FeaturesSection />

      {/* 3. History Modal */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsHistoryOpen(false)}
        >
          <div 
            className="bg-[#19142b] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h2 className="font-['Manrope'] font-bold text-xl flex items-center gap-2">
                <History size={20} className="text-[#7b39fc]" /> Download History
              </h2>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto flex flex-col gap-2.5 my-2">
              {history.length === 0 ? (
                <div className="py-12 text-center text-white/50 text-sm">
                  No records yet. Completed jobs will appear here.
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                    <div className="overflow-hidden pr-3">
                      <div className="text-sm font-medium text-white truncate">{item.title}</div>
                      <div className="text-xs text-white/50 mt-0.5">
                        {item.format} • {item.size} • {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHistoryItem(item.id)}
                      className="text-white/40 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button 
                  onClick={clearHistory}
                  className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Clear All History
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Developer Info Modal (Anand Choubey) */}
      {isDevInfoOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsDevInfoOpen(false)}
        >
          <div 
            className="bg-[#19142b] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setIsDevInfoOpen(false)}
                className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7b39fc] to-[#a855f7] flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4 shadow-lg shadow-[#7b39fc]/30 font-['Manrope']">
              AC
            </div>

            <h3 className="font-['Manrope'] font-bold text-2xl text-white">Anand Choubey</h3>
            <p className="text-sm text-white/60 mt-1 font-['Inter']">Full-Stack Developer & Software Engineer</p>

            <div className="mt-6 flex flex-col gap-3 text-left text-sm font-['Inter']">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white/50">Email</span>
                <a href="mailto:anandchoubey2005@gmail.com" className="text-[#a78bfa] hover:underline font-medium">
                  anandchoubey2005@gmail.com
                </a>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-white/50">LinkedIn</span>
                <a href="https://linkedin.com/in/anand-choubey-979b17326" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:underline font-medium">
                  anand-choubey
                </a>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/50">GitHub</span>
                <a href="https://github.com/isitanand" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:underline font-medium">
                  isitanand
                </a>
              </div>
            </div>

            <button 
              onClick={() => setIsDevInfoOpen(false)}
              className="mt-6 w-full bg-[#7b39fc] hover:bg-[#8f52ff] text-white font-['Cabin'] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 5. Notifications Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="pointer-events-auto bg-[#1f1a32]/95 border border-white/15 backdrop-blur-md px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-in slide-in-from-top-2"
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
