import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Film, Music, Download, AlertTriangle, 
  RefreshCw, CheckCircle, X, Shield, Clock,
  HardDrive, ArrowRight, Sparkles, Clipboard, Sliders
} from 'lucide-react';
import * as api from '../services/api';
import constants from '../../../shared/constants/constants.json';
const { JOB_STATUS } = constants;

const formatDuration = (sec) => {
  if (!sec) return '0:00';
  const hrs = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = Math.floor(sec % 60);
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatSize = (bytes) => {
  if (!bytes) return 'Unknown Size';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function HeroDownloader({ 
  addHistory, 
  showNotification, 
  preferences, 
  onOpenSettings,
  theme 
}) {
  const [url, setUrl] = useState('');
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const pollingRef = useRef(null);

  const isLight = theme === 'light';

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleFetchMetadata = async (e, urlOverride = null) => {
    if (e) e.preventDefault();
    const targetUrl = (urlOverride || url).trim();
    if (!targetUrl) return;

    setLoadingMetadata(true);
    setMetadata(null);
    setSelectedFormat(null);

    try {
      const data = await api.getMetadata(targetUrl);
      setMetadata(data);
      
      const defaultType = preferences?.defaultFormat || 'video';
      setActiveTab(defaultType);
      
      const formatsList = defaultType === 'video' ? data.formats?.video : data.formats?.audio;
      if (formatsList && formatsList.length > 0) {
        let selected = formatsList[0];
        if (defaultType === 'video' && preferences?.defaultQuality) {
          if (preferences.defaultQuality === 'best') {
            selected = formatsList[0];
          } else {
            const match = formatsList.find(f => 
              f.resolution?.toLowerCase() === preferences.defaultQuality.toLowerCase() ||
              f.resolution?.toLowerCase().includes(preferences.defaultQuality.toLowerCase()) ||
              f.note?.toLowerCase().includes(preferences.defaultQuality.toLowerCase())
            );
            if (match) selected = match;
          }
        } else if (defaultType === 'audio' && preferences?.audioQuality) {
          const match = formatsList.find(f => f.note?.includes(preferences.audioQuality) || f.resolution?.includes(preferences.audioQuality));
          if (match) selected = match;
        }
        setSelectedFormat(selected);
      }
      showNotification('Link analyzed successfully!', 'success');
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Failed to analyze link', 'error');
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        showNotification('Pasted link from clipboard!', 'info');
        if (preferences?.autoAnalyze && (text.startsWith('http://') || text.startsWith('https://'))) {
          handleFetchMetadata(null, text);
        }
      }
    } catch {
      showNotification('Could not read clipboard. Please paste manually.', 'warning');
    }
  };

  const handleStartDownload = async () => {
    if (!metadata || !selectedFormat) return;

    try {
      showNotification('Initializing download & stream processing...', 'info');
      const jobData = await api.prepareDownload(
        metadata.url,
        selectedFormat.formatId,
        activeTab,
        metadata.title
      );

      const initialJobState = {
        jobId: jobData.jobId,
        status: jobData.status || JOB_STATUS.PENDING,
        progress: 0,
        speed: '0 B/s',
        eta: '--:--',
        totalSize: selectedFormat.size ? formatSize(selectedFormat.size) : 'Unknown',
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        filename: jobData.filename
      };

      setActiveJob(initialJobState);

      // Start Polling Status
      pollJobStatus(jobData.jobId, metadata.title);
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Failed to start download job', 'error');
    }
  };

  const pollJobStatus = (jobId, title) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const statusData = await api.getDownloadStatus(jobId);

        setActiveJob(prev => ({
          ...prev,
          status: statusData.status,
          progress: statusData.progress || prev?.progress || 0,
          speed: statusData.speed || prev?.speed || 'Connecting...',
          eta: statusData.eta || prev?.eta || '--:--',
          filename: statusData.filename || prev?.filename
        }));

        if (statusData.status === JOB_STATUS.COMPLETED) {
          clearInterval(pollingRef.current);
          showNotification('Media ready for direct download!', 'success');

          addHistory({
            title: title,
            url: metadata?.url,
            format: activeTab.toUpperCase(),
            quality: selectedFormat?.resolution || selectedFormat?.note || 'Best',
            size: selectedFormat?.size ? formatSize(selectedFormat.size) : 'Unknown'
          });
        } else if (statusData.status === JOB_STATUS.FAILED) {
          clearInterval(pollingRef.current);
          showNotification(statusData.error || 'Stream processing failed', 'error');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1000);
  };

  const handleCancelDownload = async () => {
    if (!activeJob) return;
    try {
      if (pollingRef.current) clearInterval(pollingRef.current);
      await api.cancelDownload(activeJob.jobId);
      setActiveJob(null);
      showNotification('Download job cancelled', 'info');
    } catch (err) {
      console.error(err);
      setActiveJob(null);
    }
  };

  const triggerFileDownload = () => {
    if (!activeJob || activeJob.status !== JOB_STATUS.COMPLETED) return;
    const downloadUrl = api.getFileDownloadUrl(activeJob.jobId);
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = activeJob.filename || 'media';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showNotification('Download started!', 'success');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const formatsList = tab === 'video' ? metadata?.formats?.video : metadata?.formats?.audio;
    if (formatsList && formatsList.length > 0) {
      let selected = formatsList[0];
      if (tab === 'video' && preferences?.defaultQuality && preferences.defaultQuality !== 'best') {
        const match = formatsList.find(f => 
          f.resolution?.toLowerCase() === preferences.defaultQuality.toLowerCase() ||
          f.resolution?.toLowerCase().includes(preferences.defaultQuality.toLowerCase()) ||
          f.note?.toLowerCase().includes(preferences.defaultQuality.toLowerCase())
        );
        if (match) selected = match;
      }
      setSelectedFormat(selected);
    } else {
      setSelectedFormat(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 sm:mt-10 px-2 sm:px-0">
      {/* 1. Main Glassmorphic Input Bar */}
      <form 
        onSubmit={(e) => handleFetchMetadata(e)}
        className={`relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-[16px] backdrop-blur-xl border shadow-2xl transition-all focus-within:border-[#7b39fc] focus-within:ring-2 focus-within:ring-[#7b39fc]/30 ${
          isLight
            ? 'bg-white/90 border-purple-200 shadow-purple-900/10'
            : 'bg-[rgba(34,26,56,0.65)] border-[rgba(164,132,215,0.4)] shadow-[#7b39fc]/20'
        }`}
      >
        <div className="flex items-center gap-3 w-full px-3 py-2">
          <Search size={20} className={isLight ? 'text-neutral-400' : 'text-white/40'} />
          <input
            type="url"
            placeholder="Paste media link here (YouTube, TikTok, Vimeo, SoundCloud...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loadingMetadata || (activeJob && activeJob.status === JOB_STATUS.DOWNLOADING)}
            className={`w-full bg-transparent text-[15px] font-['Inter'] outline-none border-none ${
              isLight ? 'text-neutral-900 placeholder-neutral-400' : 'text-white placeholder-white/45'
            }`}
            required
          />
          {url && (
            <button 
              type="button" 
              onClick={() => { setUrl(''); setMetadata(null); }}
              className={`p-1 transition-colors cursor-pointer ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-white/40 hover:text-white'}`}
            >
              <X size={16} />
            </button>
          )}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!url && (
              <button
                type="button"
                onClick={handlePasteClipboard}
                className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  isLight 
                    ? 'text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200' 
                    : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
                title="Paste from clipboard"
              >
                <Clipboard size={13} />
                <span>Paste</span>
              </button>
            )}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  isLight 
                    ? 'text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200' 
                    : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
                title="Configure Stream Settings & Preferences"
              >
                <Sliders size={13} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingMetadata || !url.trim()}
          className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-[#7b39fc] hover:bg-[#8f52ff] disabled:opacity-50 text-white font-['Cabin'] font-medium text-[16px] px-6 py-3 rounded-[12px] shadow-lg shadow-[#7b39fc]/40 transition-all cursor-pointer"
        >
          {loadingMetadata ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Extract Media</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* 2. Media Metadata & Format Selector Card */}
      {metadata && !activeJob && (
        <div className={`mt-6 backdrop-blur-xl border rounded-[18px] p-5 sm:p-6 text-left shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          isLight
            ? 'bg-white/95 border-purple-200 text-neutral-900 shadow-purple-900/10'
            : 'bg-[rgba(26,20,44,0.85)] border-white/15 text-white shadow-2xl'
        }`}>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
              <img 
                src={metadata.thumbnail} 
                alt={metadata.title}
                className="w-full h-full object-cover" 
              />
              <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-[11px] font-['Inter'] font-semibold text-white px-2 py-0.5 rounded">
                {formatDuration(metadata.duration)}
              </span>
            </div>

            {/* Video Details */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-['Manrope'] font-bold text-base sm:text-lg line-clamp-2 leading-snug ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {metadata.title}
              </h3>
              <p className={`text-xs mt-1 font-['Inter'] flex items-center gap-2 ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                <span>By {metadata.uploader || 'Creator'}</span>
                <span>•</span>
                <span>{metadata.extractor}</span>
              </p>

              {/* Format Tabs (Video vs Audio) + Quick Settings Link */}
              <div className={`flex flex-wrap items-center justify-between gap-2 mt-4 border-b pb-3 ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTabChange('video')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-['Cabin'] text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'video'
                        ? 'bg-[#7b39fc] text-white shadow-md shadow-[#7b39fc]/30'
                        : isLight 
                          ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Film size={14} />
                    <span>Video Stream ({metadata.formats?.video?.length || 0})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('audio')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-['Cabin'] text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'audio'
                        ? 'bg-[#7b39fc] text-white shadow-md shadow-[#7b39fc]/30'
                        : isLight
                          ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Music size={14} />
                    <span>Audio Only ({metadata.formats?.audio?.length || 0})</span>
                  </button>
                </div>

                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className={`text-[11px] font-['Manrope'] font-medium flex items-center gap-1 hover:text-[#7b39fc] transition-colors cursor-pointer ${
                      isLight ? 'text-neutral-500' : 'text-white/50'
                    }`}
                    title="Change default resolution & format"
                  >
                    <Sliders size={12} />
                    <span>Preset: {preferences?.defaultFormat === 'audio' ? 'Audio' : preferences?.defaultQuality || '1080p'}</span>
                  </button>
                )}
              </div>

              {/* Formats Pills */}
              <div className="flex flex-wrap gap-2 mt-3 max-h-36 overflow-y-auto pr-1">
                {(activeTab === 'video' ? metadata.formats?.video : metadata.formats?.audio)?.map((fmt) => {
                  const isSelected = selectedFormat?.formatId === fmt.formatId;
                  return (
                    <button
                      key={fmt.formatId}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-3 py-1.5 rounded-[8px] border text-xs font-['Cabin'] transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#7b39fc]/20 border-[#7b39fc] text-[#7b39fc] font-bold ring-1 ring-[#7b39fc]'
                          : isLight
                            ? 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="font-semibold">{fmt.resolution || fmt.note}</span>
                      <span className="text-[10px] opacity-60">({fmt.ext?.toUpperCase()})</span>
                      {fmt.size > 0 && (
                        <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
                          {formatSize(fmt.size)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Start Download Button */}
              <div className="mt-5 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleStartDownload}
                  disabled={!selectedFormat}
                  className="bg-[#7b39fc] hover:bg-[#8f52ff] disabled:opacity-40 text-white font-['Cabin'] font-semibold text-sm px-6 py-2.5 rounded-[10px] shadow-lg shadow-[#7b39fc]/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                >
                  <Download size={16} />
                  <span>Download {activeTab === 'video' ? 'Video' : 'Audio'} ({selectedFormat?.resolution || selectedFormat?.note || 'Select Quality'})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Real-Time Active Download Progress Card */}
      {activeJob && (
        <div className={`mt-6 backdrop-blur-xl border rounded-[18px] p-5 sm:p-6 text-left shadow-2xl animate-in zoom-in-95 duration-200 ${
          isLight
            ? 'bg-white/95 border-purple-300 text-neutral-900 shadow-purple-900/10'
            : 'bg-[rgba(26,20,44,0.92)] border-[#7b39fc]/40 text-white shadow-2xl'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {activeJob.status === JOB_STATUS.COMPLETED ? (
                <CheckCircle size={22} className="text-emerald-500" />
              ) : activeJob.status === JOB_STATUS.FAILED ? (
                <AlertTriangle size={22} className="text-rose-500" />
              ) : (
                <RefreshCw size={20} className="text-[#7b39fc] animate-spin" />
              )}
              <h4 className={`font-['Manrope'] font-bold text-base ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {activeJob.status === JOB_STATUS.COMPLETED
                  ? 'Download Ready!'
                  : activeJob.status === JOB_STATUS.MERGING
                  ? 'Muxing Audio & Video with FFmpeg...'
                  : activeJob.status === JOB_STATUS.DOWNLOADING
                  ? 'Downloading stream chunks...'
                  : 'Processing Job Queue...'}
              </h4>
            </div>

            {activeJob.status !== JOB_STATUS.COMPLETED && (
              <button
                type="button"
                onClick={handleCancelDownload}
                className="text-xs text-rose-500 hover:text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <p className={`text-xs truncate mb-3 font-['Inter'] ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
            {activeJob.title}
          </p>

          {/* Progress Bar */}
          <div className={`w-full rounded-full h-2.5 overflow-hidden mb-3 ${isLight ? 'bg-neutral-200' : 'bg-white/10'}`}>
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                activeJob.status === JOB_STATUS.COMPLETED
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-[#7b39fc] to-[#a855f7]'
              }`}
              style={{ width: `${activeJob.status === JOB_STATUS.COMPLETED ? 100 : activeJob.progress || 15}%` }}
            />
          </div>

          <div className={`flex items-center justify-between text-xs font-['Inter'] ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
            <span>Speed: {activeJob.speed || 'Streaming'}</span>
            <span>Progress: {activeJob.progress ? `${Math.round(activeJob.progress)}%` : 'Active'}</span>
            <span>ETA: {activeJob.eta || '--:--'}</span>
          </div>

          {activeJob.status === JOB_STATUS.COMPLETED && (
            <div className={`mt-4 pt-4 border-t flex justify-end ${isLight ? 'border-neutral-200' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={triggerFileDownload}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-['Cabin'] font-bold text-sm px-6 py-2.5 rounded-[10px] shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
              >
                <Download size={16} />
                <span>Save File to Laptop</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
