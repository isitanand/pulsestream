const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const downloadController = require('../controllers/downloadController');
const { validateUrl, rateLimiter } = require('../middleware/security');

// Health check endpoint with diagnostic info (exempt from rate limiting)
router.get('/health', (req, res) => {
  const candidateCookies = [
    path.resolve(__dirname, '../../cookies.txt'),
    path.resolve(process.cwd(), 'cookies.txt'),
    path.resolve(process.cwd(), 'server/cookies.txt')
  ];
  const foundPath = candidateCookies.find(p => fs.existsSync(p) && fs.statSync(p).size > 10) || null;
  const fileSize = foundPath ? fs.statSync(foundPath).size : 0;

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    cookies: {
      envExists: !!process.env.YOUTUBE_COOKIES,
      envLength: process.env.YOUTUBE_COOKIES ? process.env.YOUTUBE_COOKIES.length : 0,
      foundPath,
      fileSize
    },
    timestamp: Date.now()
  });
});

// Diagnostic endpoint to test different yt-dlp parameter configurations in real time
router.get('/diag', (req, res) => {
  const url = req.query.url || 'https://youtu.be/zZcV9kDMQzI?si=iHU3etTbcGHSWXUR';
  const client = req.query.client || ''; // e.g. 'android', 'web', 'mweb', 'ios', 'tv'
  const skip = req.query.skip || ''; // e.g. 'webpage,configs'
  const useCookies = req.query.cookies !== '0';

  const candidateBins = [
    path.resolve(__dirname, '../../bin'),
    path.resolve(process.cwd(), 'bin'),
    path.resolve(process.cwd(), 'server/bin')
  ];
  const binPath = candidateBins.find(p => fs.existsSync(p)) || candidateBins[0];
  const localBinary = path.join(binPath, 'yt-dlp');
  const command = (process.platform !== 'win32' && fs.existsSync(localBinary)) ? localBinary : (process.platform === 'win32' ? 'python' : 'yt-dlp');
  const baseArgs = (process.platform === 'win32') ? ['-m', 'yt_dlp'] : [];

  const candidateCookies = [
    path.resolve(__dirname, '../../cookies.txt'),
    path.resolve(process.cwd(), 'cookies.txt'),
    path.resolve(process.cwd(), 'server/cookies.txt')
  ];
  const cookiesPath = candidateCookies.find(p => fs.existsSync(p) && fs.statSync(p).size > 10) || null;

  const args = [...baseArgs];
  if (useCookies && cookiesPath) {
    args.push('--cookies', cookiesPath);
  }

  const extractorArgs = [];
  if (client) extractorArgs.push(`player_client=${client}`);
  if (skip) extractorArgs.push(`player_skip=${skip}`);
  if (extractorArgs.length > 0) {
    args.push('--extractor-args', `youtube:${extractorArgs.join(';')}`);
  }

  args.push('--dump-json', '--no-playlist', url);

  const t0 = Date.now();
  const env = { ...process.env, PATH: `${binPath}${path.delimiter}${process.env.PATH || ''}` };

  execFile(command, args, { maxBuffer: 25 * 1024 * 1024, env }, (error, stdout, stderr) => {
    const elapsedMs = Date.now() - t0;
    let parsedTitle = null;
    let formatsCount = 0;
    try {
      const data = JSON.parse(stdout);
      parsedTitle = data.title;
      formatsCount = (data.formats || []).length;
    } catch(e) {}

    res.json({
      success: !error,
      elapsedMs,
      command: `${command} ${args.join(' ')}`,
      cookiesFile: cookiesPath,
      title: parsedTitle,
      formatsCount,
      error: error ? error.message : null,
      stderr: stderr ? stderr.slice(0, 1000) : null
    });
  });
});

// Apply rate limiter to all standard user routes
router.use(rateLimiter);

// Metadata extraction endpoint
router.post('/metadata', validateUrl, downloadController.getMetadata);

// Job initiation endpoint
router.post('/download/prepare', validateUrl, downloadController.prepareDownload);

// Job status endpoint (polling)
router.get('/download/status/:jobId', downloadController.getJobStatus);

// File retrieval endpoint
router.get('/download/file/:jobId', downloadController.downloadFile);

// Job cancellation endpoint
router.post('/download/cancel/:jobId', downloadController.cancelDownload);

module.exports = router;
