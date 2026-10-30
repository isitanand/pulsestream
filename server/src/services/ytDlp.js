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

// Path to cookies file (written from YOUTUBE_COOKIES env var at server startup if present)
const cookiesPath = path.resolve(__dirname, '../../cookies.txt');
const cookiesFlag = fs.existsSync(cookiesPath) ? `--cookies "${cookiesPath}"` : '';

function runYtDlpMetadata(url, extraArgs = []) {
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

    const args = [...baseArgs];

    if (cookiesPath && fs.existsSync(cookiesPath)) {
      args.push('--cookies', cookiesPath);
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
 * Fetch media metadata using yt-dlp -J with resilient cloud bypass fallback.
 */
async function getMetadata(url) {
  if (!url) {
    throw { code: ERROR_CODES.INVALID_URL, message: 'URL is required' };
  }

  const isYouTube = url.includes('youtu.be') || url.includes('youtube.com');

  // Strategy 1: If on cloud datacenter without cookies, use android player with webpage bypass to avoid 429
  if (isYouTube && !cookiesFlag) {
    try {
      console.log('Attempting YouTube extraction via Android Innertube bypass (execFile)...');
      return await runYtDlpMetadata(url, ['--extractor-args', 'youtube:player_client=android;player_skip=webpage,configs']);
    } catch (err1) {
      console.warn('Android bypass initial attempt error, falling back:', err1.stderr || err1.message);
    }
  }

  // Strategy 2: Standard extraction (or authenticated extraction if cookiesFlag is set)
  try {
    return await runYtDlpMetadata(url);
  } catch (err2) {
    const stderr = err2.stderr || '';
    console.error('Standard extraction error:', stderr);

    // Strategy 3: Final fallback to Android bypass if it was skipped or failed
    if (isYouTube) {
      try {
        console.log('Falling back to Android Innertube bypass (final attempt)...');
        return await runYtDlpMetadata(url, ['--extractor-args', 'youtube:player_client=android;player_skip=webpage,configs']);
      } catch (err3) {
        console.error('All YouTube extraction strategies failed:', err3.stderr);
      }
    }

    let errorCode = ERROR_CODES.METADATA_FAILED;
    let errorMessage = 'Failed to extract metadata from the provided URL';

    if (stderr.includes('Unsupported URL') || stderr.includes('not a valid URL')) {
      errorCode = ERROR_CODES.UNSUPPORTED_SITE;
      errorMessage = 'The provided website or URL is not supported by the downloader';
    } else if (stderr.includes('Sign in to confirm your age') || stderr.includes('Sign in to confirm you’re not a bot')) {
      errorMessage = 'This video requires authentication or is restricted by the platform';
    }

    throw { code: errorCode, message: errorMessage, details: stderr };
  }
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

  args.push('--newline');
  const isYouTube = url.includes('youtu.be') || url.includes('youtube.com');
  if (isYouTube && !cookiesFlag) {
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
        '-f', 'bestaudio',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', bitrate,
        '-o', outputTemplate,
        url
      );
    } else {
      args.push(
        '-f', formatId,
        '-o', outputTemplate,
        url
      );
    }
  } else {
    // Video type: high-resolution formats require audio merging with graceful fallback.
    args.push(
      '-f', `${formatId}+bestaudio/best/${formatId}/bestvideo+bestaudio/best`,
      '--merge-output-format', 'mp4',
      '-o', outputTemplate,
      url
    );
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
