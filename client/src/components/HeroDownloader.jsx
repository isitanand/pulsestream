import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Film, Music, Download, AlertTriangle, 
  RefreshCw, CheckCircle, Play, X, Shield, Clock,
  HardDrive, ArrowRight, Sparkles, Clipboard
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

export default function HeroDownloader({ addHistory, showNotification, preferences }) {
  const [url, setUrl] = useState('');
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        showNotification('Pasted link from clipboard!', 'info');
      }
    } catch {
      showNotification('Could not read clipboard. Please paste manually.', 'warning');
    }
  };

  const handleFetchMetadata = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoadingMetadata(true);
    setMetadata(null);
    setSelectedFormat(null);

    try {
      const data = await api.getMetadata(url);
      setMetadata(data);
      
      const defaultType = preferences?.defaultFormat || 'video';
      setActiveTab(defaultType);
      
      const formatsList = defaultType === 'video' ? data.formats.video : data.formats.audio;
      if (formatsList && formatsList.length > 0) {
        let selected = formatsList[0];
        if (defaultType === 'video' && preferences?.defaultQuality) {
          const match = formatsList.find(f => f.resolution.includes(preferences.defaultQuality));
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
        formatNote: selectedFormat.note,
        ext: selectedFormat.ext
      };

      setActiveJob(initialJobState);
      startPolling(jobData.jobId);
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Failed to start download process', 'error');
    }
  };

  const startPolling = (jobId) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const statusData = await api.getJobStatus(jobId);
        
        setActiveJob(prev => ({
          ...prev,
          status: statusData.status,
          progress: statusData.progress,
          speed: statusData.speed,
          eta: statusData.eta,
          totalSize: statusData.totalSize !== 'Unknown' ? statusData.totalSize : prev?.totalSize,
          fileName: statusData.fileName || prev?.fileName
        }));

        if (statusData.status === JOB_STATUS.COMPLETED) {
          clearInterval(pollingRef.current);
          showNotification('Media download ready!', 'success');
          
          if (addHistory) {
            addHistory({
              title: statusData.fileName || activeJob?.title || metadata?.title,
              url: metadata?.url,
              type: activeTab,
              format: selectedFormat?.note || activeJob?.formatNote,
              size: statusData.totalSize !== 'Unknown' ? statusData.totalSize : formatSize(selectedFormat?.size)
            });
          }
        } else if (statusData.status === JOB_STATUS.FAILED) {
          clearInterval(pollingRef.current);
          showNotification(statusData.error || 'Server processing failed', 'error');
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
      showNotification('Download cancelled', 'info');
    } catch (err) {
      console.error(err);
      showNotification('Could not cancel download on server', 'error');
    }
  };

  const triggerFileDownload = () => {
    if (!activeJob || activeJob.status !== JOB_STATUS.COMPLETED) return;
    const downloadUrl = api.getDownloadFileUrl(activeJob.jobId);
    window.location.href = downloadUrl;
    setTimeout(() => {
      setActiveJob(null);
    }, 2500);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!metadata) return;
    const formatsList = tab === 'video' ? metadata.formats.video : metadata.formats.audio;
    if (formatsList && formatsList.length > 0) {
      setSelectedFormat(formatsList[0]);
    } else {
      setSelectedFormat(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 sm:mt-10 px-2 sm:px-0">
      {/* 1. Main Glassmorphic Input Bar */}
      <form 
        onSubmit={handleFetchMetadata}
        className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-[16px] bg-[rgba(34,26,56,0.65)] backdrop-blur-xl border border-[rgba(164,132,215,0.4)] shadow-2xl shadow-[#7b39fc]/20 transition-all focus-within:border-[#7b39fc] focus-within:ring-2 focus-within:ring-[#7b39fc]/40"
      >
        <div className="flex items-center gap-3 w-full px-3 py-2">
          <Search size={20} className="text-white/40 flex-shrink-0" />
          <input
            type="url"
            placeholder="Paste media link here (YouTube, TikTok, Vimeo, SoundCloud...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loadingMetadata || (activeJob && activeJob.status === JOB_STATUS.DOWNLOADING)}
            className="w-full bg-transparent text-white placeholder-white/45 text-[15px] font-['Inter'] outline-none border-none"
            required
          />
          {url && (
            <button 
              type="button" 
              onClick={() => { setUrl(''); setMetadata(null); }}
              className="text-white/40 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          {!url && (
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-[8px] transition-colors cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard size={13} />
              <span>Paste</span>
            </button>
          )}
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
        <div className="mt-6 bg-[rgba(26,20,44,0.85)] backdrop-blur-xl border border-white/15 rounded-[18px] p-5 sm:p-6 text-left shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
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
              <h3 className="font-['Manrope'] font-bold text-white text-base sm:text-lg line-clamp-2 leading-snug">
                {metadata.title}
              </h3>
              <p className="text-xs text-white/50 mt-1 font-['Inter'] flex items-center gap-2">
                <span>By {metadata.uploader || 'Creator'}</span>
                <span>•</span>
                <span>{metadata.extractor}</span>
              </p>

              {/* Format Tabs (Video vs Audio) */}
              <div className="flex items-center gap-2 mt-4 border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => handleTabChange('video')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-['Cabin'] text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-[#7b39fc] text-white shadow-md shadow-[#7b39fc]/30'
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
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Music size={14} />
                  <span>Audio Only ({metadata.formats?.audio?.length || 0})</span>
                </button>
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
                          ? 'bg-[#7b39fc]/20 border-[#7b39fc] text-white font-bold ring-1 ring-[#7b39fc]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="font-semibold">{fmt.resolution || fmt.note}</span>
                      <span className="text-[10px] opacity-60">({fmt.ext?.toUpperCase()})</span>
                      {fmt.size > 0 && (
                        <span className="text-[10px] text-white/50">{formatSize(fmt.size)}</span>
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
        <div className="mt-6 bg-[rgba(26,20,44,0.92)] backdrop-blur-xl border border-[#7b39fc]/40 rounded-[18px] p-5 sm:p-6 text-left shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {activeJob.status === JOB_STATUS.COMPLETED ? (
                <CheckCircle size={22} className="text-emerald-400" />
              ) : activeJob.status === JOB_STATUS.FAILED ? (
                <AlertTriangle size={22} className="text-rose-400" />
              ) : (
                <RefreshCw size={20} className="text-[#a78bfa] animate-spin" />
              )}
              <h4 className="font-['Manrope'] font-bold text-white text-base">
                {activeJob.status === JOB_STATUS.COMPLETED
                  ? 'Download Ready!'
                  : activeJob.status === JOB_STATUS.MERGING
                  ? 'Muxing Audio & Video with FFmpeg...'
                  : activeJob.status === JOB_STATUS.DOWNLOADING
                  ? 'Downloading from Stream Server...'
                  : 'Processing Job Queue...'}
              </h4>
            </div>

            {activeJob.status !== JOB_STATUS.COMPLETED && (
              <button
                type="button"
                onClick={handleCancelDownload}
                className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="text-xs text-white/60 font-['Inter'] truncate mb-3">
            {activeJob.title}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden mb-3">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                activeJob.status === JOB_STATUS.COMPLETED
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-[#7b39fc] to-[#a855f7]'
              }`}
              style={{ width: `${activeJob.status === JOB_STATUS.COMPLETED ? 100 : activeJob.progress || 10}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/50 font-['Inter']">
            <span>Speed: {activeJob.speed || 'Streaming'}</span>
            <span>Progress: {activeJob.progress ? `${Math.round(activeJob.progress)}%` : 'Queued'}</span>
            <span>ETA: {activeJob.eta || '--:--'}</span>
          </div>

          {activeJob.status === JOB_STATUS.COMPLETED && (
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
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
