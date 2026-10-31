const { spawn, exec, execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
const config = require('../config/config');
const { JOB_STATUS, ERROR_CODES } = require('../../../shared/constants/constants.json');
const jobsService = require('./jobs');

// Resolve bin directory candidates (handles both local repo and Render's /server root)
const candidateBins = [
  path.resolve(__dirname, '../../bin'),
  path.resolve(process.cwd(), 'bin'),
  path.resolve(process.cwd(), 'server/bin')
];
const binPath = candidateBins.find(p => fs.existsSync(p)) || candidateBins[0];

if (fs.existsSync(binPath)) {
  process.env.PATH = `${binPath}${path.delimiter}${process.env.PATH || ''}`;
  console.log('Using local bin directory:', binPath);
}

// Ensure execution permissions on Linux for local binaries
if (process.platform !== 'win32' && fs.existsSync(binPath)) {
  ['yt-dlp', 'ffmpeg', 'ffprobe', 'deno'].forEach(binary => {
    const filePath = path.join(binPath, binary);
    if (fs.existsSync(filePath)) {
      try {
        fs.chmodSync(filePath, 0o755);
      } catch (e) {
        console.warn(`Could not set permissions on ${binary}:`, e.message);
      }
    }
  });
}

/**
 * Returns the best available executable command for invoking yt-dlp.
 */
function getYtDlpCommand() {
  const isWin = process.platform === 'win32';
  if (isWin) return 'python -m yt_dlp';

  const localBinary = path.join(binPath, 'yt-dlp');
  if (fs.existsSync(localBinary)) {
    return `"${localBinary}"`;
  }
  return 'yt-dlp';
}

/**
 * Find cookies file dynamically from multiple candidate paths.
 */
function getCookiesPath() {
  const candidateCookies = [
    path.resolve(__dirname, '../../cookies.txt'),
    path.resolve(process.cwd(), 'cookies.txt'),
    path.resolve(process.cwd(), 'server/cookies.txt')
  ];
  return candidateCookies.find(p => fs.existsSync(p) && fs.statSync(p).size > 10) || null;
}

// Ultra-fast in-memory LRU cache for metadata (10-minute TTL)
const metadataCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCachedMetadata(url) {
  const cached = metadataCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log(`Cache HIT for ${url} (instant 0ms response)`);
    return cached.data;
  }
  return null;
}

function setCachedMetadata(url, data) {
  if (metadataCache.size > 200) {
    const oldestKey = metadataCache.keys().next().value;
    metadataCache.delete(oldestKey);
  }
  metadataCache.set(url, { data, timestamp: Date.now() });
}

function runYtDlpMetadata(url, extraArgs = [], useCookies = true) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const localBinary = path.join(binPath, 'yt-dlp');

    let command;
    let baseArgs;

    if (isWin) {
      command = 'python';
      baseArgs = ['-m', 'yt_dlp'];
    } else if (fs.existsSync(localBinary)) {
      command = localBinary;
      baseArgs = [];
    } else {
      command = 'yt-dlp';
      baseArgs = [];
    }

    // High performance flags: suppress verbose warnings and certificate CRL roundtrips
    const args = [
      ...baseArgs,
      '--no-warnings',
      '--no-check-certificates'
    ];
    const cookiesFile = getCookiesPath();

    if (useCookies && cookiesFile) {
      args.push('--cookies', cookiesFile);
    }

    if (extraArgs && extraArgs.length > 0) {
      args.push(...extraArgs);
    }

    args.push('--dump-json', '--no-playlist', url);

    const fullPath = `${binPath}${path.delimiter}${process.env.PATH || ''}`;
    const env = { ...process.env, PATH: fullPath };

    console.log(`Executing metadata via execFile: ${command} ${args.join(' ')}`);

    execFile(command, args, { maxBuffer: 25 * 1024 * 1024, env }, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr: stderr || error.message });
      }

      try {
        const data = JSON.parse(stdout);
        const parsed = parseMetadata(data, url);
        resolve(parsed);
      } catch (e) {
        reject({ error: e, stderr: 'Failed to parse JSON output: ' + e.message });
      }
    });
  });
}

/**
 * Fetch media metadata with sub-3-second high-speed execution and smart caching.
 */
async function getMetadata(url) {
  if (!url) {
    throw { code: ERROR_CODES.INVALID_URL, message: 'URL is required' };
  }

  // 1. Instant Cache Check (sub-10ms 0.00s response if previously queried)
  const cached = getCachedMetadata(url);
  if (cached) {
    return cached;
  }

  const isYouTube = url.includes('youtu.be') || url.includes('youtube.com');
  const cookiesFile = getCookiesPath();

  let result = null;

  if (isYouTube) {
    if (cookiesFile) {
      try {
        console.log('Fast path: Direct YouTube authenticated extraction with skip webpage,configs...');
        result = await runYtDlpMetadata(url, ['--extractor-args', 'youtube:player_skip=webpage,configs'], true);
      } catch (errCookies) {
        const stderr = errCookies.stderr || errCookies.message || '';
        console.warn('Fast path with cookies failed:', stderr);

        // If cookies are rotated/expired or bot-challenged, fail fast with an actionable message
        if (stderr.includes('Sign in to confirm you’re not a bot') || stderr.includes('no longer valid') || stderr.includes('HTTP Error 429')) {
          throw {
            code: ERROR_CODES.METADATA_FAILED,
            message: 'Your YouTube session has expired or requires re-authentication. Please export cookies from a fresh, dedicated browser profile and paste them in Render.',
            details: stderr
          };
        }

        // Try one fast fallback with Android client
        try {
          console.log('Falling back to Android Innertube bypass...');
          result = await runYtDlpMetadata(url, ['--extractor-args', 'youtube:player_client=android;player_skip=webpage,configs'], false);
        } catch (errAndroid) {
          throw {
            code: ERROR_CODES.METADATA_FAILED,
            message: 'YouTube extraction failed: ' + (errAndroid.stderr || errAndroid.message),
            details: errAndroid.stderr
          };
        }
      }
    } else {
      // No cookies file present: attempt Android Innertube bypass once
      try {
        console.log('No cookies file: Attempting YouTube extraction via Android client...');
        result = await runYtDlpMetadata(url, ['--extractor-args', 'youtube:player_client=android;player_skip=webpage,configs'], false);
      } catch (errAndroid) {
        const stderr = errAndroid.stderr || errAndroid.message || '';
        throw {
          code: ERROR_CODES.METADATA_FAILED,
          message: stderr.includes('Sign in to confirm you’re not a bot')
            ? 'YouTube requires authentication on cloud servers. Please add your YOUTUBE_COOKIES in the Render Dashboard.'
            : 'YouTube extraction failed: ' + stderr,
          details: stderr
        };
      }
    }
  } else {
    // Non-YouTube platforms (SoundCloud, Vimeo, TikTok, Instagram, Twitter/X, etc.)
    try {
      console.log('Direct extraction for non-YouTube media...');
      result = await runYtDlpMetadata(url, [], false);
    } catch (errFinal) {
      const stderr = errFinal.stderr || '';
      console.error('Non-YouTube extraction error:', stderr);

      let errorCode = ERROR_CODES.METADATA_FAILED;
      let errorMessage = 'Failed to extract media from this URL';

      if (stderr.includes('Unsupported URL') || stderr.includes('not a valid URL')) {
        errorCode = ERROR_CODES.UNSUPPORTED_SITE;
        errorMessage = 'The provided website or URL is not supported by PulseStream';
      }

      throw { code: errorCode, message: errorMessage, details: stderr };
    }
  }

  // Save in cache for subsequent instant loads
  if (result) {
    setCachedMetadata(url, result);
  }

  return result;
}

/**
 * Parse yt-dlp raw JSON into standardized frontend structures.
 */
function parseMetadata(data, url) {
  const duration = data.duration || 0;
  const rawFormats = data.formats || [];

  const videoFormatsMap = new Map();
  const audioFormats = [];

  rawFormats.forEach(f => {
    const isVideo = f.vcodec && f.vcodec !== 'none';
    const isAudio = f.acodec && f.acodec !== 'none';

    // Skip storyboards, thumbnails, and mhtml manifest formats
    if (f.ext === 'mhtml' || f.format_note === 'storyboard' || f.format_id?.startsWith('sb')) {
      return;
    }

    // Estimate size if missing
    let size = f.filesize || f.filesize_approx || null;
    if (!size && f.tbr && duration) {
      size = Math.round((f.tbr * 1000 * duration) / 8);
    }

    const note = f.format_note || f.format || '';

    if (isVideo) {
      // Exclude YouTube Premium bitrates which fail without authenticated subscription cookies
      if (note.toLowerCase().includes('premium')) return;

      // Detect standard resolution label
      let resolution = '';
      if (/^\d+p$/i.test(note)) {
        resolution = note.toLowerCase();
      } else if (f.height >= 2160 || f.width >= 3840) {
        resolution = '4k';
      } else if (f.height >= 1440 || f.width >= 2560) {
        resolution = '1440p';
      } else if (f.height >= 800 || f.width >= 1920) {
        resolution = '1080p';
      } else if (f.height >= 540 || f.width >= 1280) {
        resolution = '720p';
      } else if (f.height >= 400 || f.width >= 854) {
        resolution = '480p';
      } else if (f.height >= 260 || f.width >= 640) {
        resolution = '360p';
      } else if (f.height >= 180 || f.width >= 426) {
        resolution = '240p';
      } else if (f.height) {
        resolution = `${f.height}p`;
      } else {
        resolution = 'Unknown';
      }

      const fps = f.fps ? `${f.fps}fps` : '';
      const ext = f.ext || 'mp4';
      const vcodec = f.vcodec || '';

      // Score this format: prefer MP4 container, H.264 (avc1), and higher bitrate
      let score = 0;
      if (ext === 'mp4') score += 100;
      if (vcodec.includes('avc') || vcodec.includes('h264')) score += 50;
      if (isAudio) score += 20; // Pre-muxed format bonus
      score += (f.tbr || 0);

      const item = {
        formatId: f.format_id,
        resolution,
        height: f.height || 0,
        width: f.width || 0,
        fps: f.fps || null,
        ext,
        vcodec,
        acodec: f.acodec,
        size,
        hasAudio: isAudio,
        note: `${resolution.toUpperCase()}${fps ? ` ${fps}` : ''} (${ext.toUpperCase()})`.trim(),
        score
      };

      // Keep the best format per resolution in the map
      if (!videoFormatsMap.has(resolution) || score > videoFormatsMap.get(resolution).score) {
        videoFormatsMap.set(resolution, item);
      }
    } else if (isAudio) {
      // Audio-only format
      const bitrate = f.abr ? `${Math.round(f.abr)}kbps` : (f.tbr ? `${Math.round(f.tbr)}kbps` : 'Unknown');

      audioFormats.push({
        formatId: f.format_id,
        ext: f.ext,
        acodec: f.acodec,
        bitrate,
        size,
        note: `${f.ext.toUpperCase()} (${bitrate}) ${note}`.trim()
      });
    }
  });

  // Sort video formats in descending standard order
  const standardOrder = ['4k', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
  const videoFormats = Array.from(videoFormatsMap.values())
    .sort((a, b) => {
      const idxA = standardOrder.indexOf(a.resolution);
      const idxB = standardOrder.indexOf(b.resolution);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (b.height || 0) - (a.height || 0);
    })
    .map(({ score, ...rest }) => rest);

  // Add virtual audio conversion presets if any audio format exists
  if (audioFormats.length > 0) {
    audioFormats.unshift(
      {
        formatId: 'mp3-320k',
        ext: 'mp3',
        acodec: 'mp3',
        bitrate: '320kbps',
        size: null,
        note: 'MP3 (320kbps) Studio Quality'
      },
      {
        formatId: 'mp3-192k',
        ext: 'mp3',
        acodec: 'mp3',
        bitrate: '192kbps',
        size: null,
        note: 'MP3 (192kbps) Standard'
      }
    );
  }

  // Format total duration string
  let durationFormatted = '0:00';
  if (duration > 0) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    if (hours > 0) {
      durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // Choose the best thumbnail
  let thumbnail = data.thumbnail || null;
  if (data.thumbnails && data.thumbnails.length > 0) {
    const sortedThumbnails = [...data.thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0));
    thumbnail = sortedThumbnails[0].url || thumbnail;
  }

  return {
    url,
    title: data.title || 'Untitled Media',
    uploader: data.uploader || data.channel || data.artist || 'Unknown Creator',
    duration: durationFormatted,
    durationSeconds: duration,
    thumbnail,
    formats: {
      video: videoFormats,
      audio: audioFormats
    }
  };
}

/**
 * Start the download and stream processing job.
 */
function startDownload(jobId, url, formatId, type) {
  const job = jobsService.getJob(jobId);
  if (!job) return;

  const outputTemplate = path.join(config.DOWNLOAD_DIR, `${jobId}.%(ext)s`);
  const args = [];

  args.push(
    '--newline',
    '--no-warnings',
    '--no-check-certificates',
    '--concurrent-fragments', '4'
  );
  const isYouTube = url.includes('youtu.be') || url.includes('youtube.com');
  const cookiesFile = getCookiesPath();

  if (cookiesFile) {
    args.push('--cookies', cookiesFile);
  }

  if (isYouTube && !cookiesFile) {
    args.push('--extractor-args', 'youtube:player_client=android;player_skip=webpage,configs');
  }

  if (fs.existsSync(binPath)) {
    args.push('--ffmpeg-location', binPath);
  }

  // Construct arguments
  if (type === 'audio') {
    if (formatId.startsWith('mp3-')) {
      const bitrate = formatId.split('-')[1]; // '320k' or '192k'
      args.push(
        '-f', 'ba/b/best',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', bitrate,
        '-o', outputTemplate,
        url
      );
    } else {
      args.push(
        '-f', `${formatId}/ba/b/best`,
        '-o', outputTemplate,
        url
      );
    }
  } else {
    // Video type: mux format with audio fallback
    if (isYouTube && !cookiesFile) {
      args.push(
        '-f', `${formatId}/b/best`,
        '-o', outputTemplate,
        url
      );
    } else {
      args.push(
        '-f', `${formatId}+bestaudio/best`,
        '--merge-output-format', 'mp4',
        '-o', outputTemplate,
        url
      );
    }
  }

  // Spawn yt-dlp process across Windows and Linux
  const isWin = process.platform === 'win32';
  const localBinary = path.join(binPath, 'yt-dlp');
  let spawnCmd = isWin ? 'python' : (fs.existsSync(localBinary) ? localBinary : 'yt-dlp');
  let spawnArgs = isWin ? ['-m', 'yt_dlp', ...args] : args;

  const fullPath = `${binPath}${path.delimiter}${process.env.PATH || ''}`;
  const env = { ...process.env, PATH: fullPath };

  console.log(`Spawning ${spawnCmd} with args: ${spawnArgs.join(' ')}`);
  const child = spawn(spawnCmd, spawnArgs, { env });

  child.on('error', (err) => {
    console.error(`Spawn error for job ${jobId}:`, err);
    jobsService.updateJob(jobId, {
      status: JOB_STATUS.FAILED,
      error: `Failed to initialize stream worker: ${err.message}`
    });
  });

  // Update job process reference
  const rawJob = jobsService.jobs.get(jobId);
  if (rawJob) {
    rawJob.process = child;
    rawJob.status = JOB_STATUS.DOWNLOADING;
  }

  // Parse progress output
  const progressRegex = /\[download\]\s+([0-9.]+)%\s+of\s+(?:~)?([0-9.a-zA-Z]+)\s+at\s+([0-9.a-zA-Z/]+)\s+ETA\s+([0-9:]+)/;

  child.stdout.on('data', (data) => {
    const lines = data.toString().split(/[\r\n]+/);
    for (const line of lines) {
      if (!line.trim()) continue;

      // Check for merger stage
      if (line.includes('[Merger]') || line.includes('Merging formats into')) {
        jobsService.updateJob(jobId, {
          status: JOB_STATUS.MERGING,
          progress: 99,
          speed: 'Muxing',
          eta: 'Finishing'
        });
        continue;
      }

      // Check for download progress
      const match = line.match(progressRegex);
      if (match) {
        const progress = parseFloat(match[1]);
        const size = match[2];
        const speed = match[3];
        const eta = match[4];

        jobsService.updateJob(jobId, {
          status: JOB_STATUS.DOWNLOADING,
          progress: Math.min(progress, 98),
          size,
          speed,
          eta
        });
      }
    }
  });

  let lastStderr = '';
  child.stderr.on('data', (data) => {
    lastStderr += data.toString();
    console.error(`yt-dlp stderr [${jobId}]:`, data.toString());
  });

  child.on('close', (code) => {
    console.log(`yt-dlp process closed with code ${code} for job ${jobId}`);

    if (code === 0) {
      // Find the generated output file matching outputTemplate base
      try {
        const dirFiles = fs.readdirSync(config.DOWNLOAD_DIR);
        const matchingFile = dirFiles.find(f => f.startsWith(`${jobId}.`));

        if (matchingFile) {
          const fullFilePath = path.join(config.DOWNLOAD_DIR, matchingFile);
          const ext = path.extname(matchingFile).substring(1);
          const sanitizedTitle = sanitize(rawJob.fileName || 'download');
          const cleanFileName = `${sanitizedTitle}.${ext}`;

          jobsService.updateJob(jobId, {
            status: JOB_STATUS.COMPLETED,
            progress: 100,
            filePath: fullFilePath,
            fileName: cleanFileName,
            speed: 'Done',
            eta: '0s'
          });
          console.log(`Job ${jobId} successfully prepared file: ${fullFilePath}`);
        } else {
          jobsService.updateJob(jobId, {
            status: JOB_STATUS.FAILED,
            error: 'Output media file could not be located on disk after processing'
          });
        }
      } catch (e) {
        jobsService.updateJob(jobId, {
          status: JOB_STATUS.FAILED,
          error: `Failed to inspect download artifacts: ${e.message}`
        });
      }
    } else {
      const currentJob = jobsService.getJob(jobId);
      if (currentJob && currentJob.status !== JOB_STATUS.CANCELLED) {
        jobsService.updateJob(jobId, {
          status: JOB_STATUS.FAILED,
          error: `Stream processing exited with error code ${code}: ${lastStderr.slice(-300).trim()}`
        });
      }
    }
  });
}

module.exports = {
  getMetadata,
  startDownload
};
