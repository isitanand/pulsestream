const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const { validateUrl, rateLimiter } = require('../middleware/security');

// Health check endpoint (exempt from rate limiting for keep-alive pings)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(), 
    timestamp: Date.now(),
    version: '1.2.1',
    commit: 'diag-check'
  });
});

// Diagnostic endpoint to inspect Render runtime environment and yt-dlp execution
router.get('/diag', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { execFile } = require('child_process');
    const candidateBins = [
      path.resolve(__dirname, '../../bin'),
      path.resolve(process.cwd(), 'bin'),
      path.resolve(process.cwd(), 'server/bin')
    ];
    const binPath = candidateBins.find(p => fs.existsSync(p)) || candidateBins[0];
    const binFiles = fs.existsSync(binPath) ? fs.readdirSync(binPath) : [];
    const localBinary = path.join(binPath, 'yt-dlp');
    const command = fs.existsSync(localBinary) ? localBinary : 'yt-dlp';

    const clientName = req.query.client || 'android';
    const testUrl = req.query.url || 'https://youtu.be/zZcV9kDMQzI?si=iHU3etTbcGHSWXUR';
    const extractorArg = req.query.skip === 'false' ? `youtube:player_client=${clientName}` : `youtube:player_client=${clientName};player_skip=webpage,configs`;
    const testArgs = ['--extractor-args', extractorArg, '--dump-json', '--no-playlist', testUrl];

    const fullPath = `${binPath}${path.delimiter}${process.env.PATH || ''}`;
    const env = { ...process.env, PATH: fullPath };

    execFile(command, testArgs, { maxBuffer: 25 * 1024 * 1024, env }, (err, stdout, stderr) => {
      let parsed = null;
      let parseErr = null;
      if (stdout) {
        try {
          const json = JSON.parse(stdout);
          parsed = {
            id: json.id,
            title: json.title,
            uploader: json.uploader,
            formatCount: json.formats?.length,
            formats: json.formats?.map(f => ({ id: f.format_id, height: f.height, ext: f.ext, vcodec: f.vcodec }))
          };
        } catch (e) {
          parseErr = e.message;
        }
      }

      res.json({
        platform: process.platform,
        command,
        binPath,
        binFiles,
        error: err ? err.message : null,
        code: err ? err.code : 0,
        stderr: stderr ? stderr.substring(0, 1000) : null,
        stdoutLength: stdout ? stdout.length : 0,
        parseErr,
        parsed
      });
    });
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

// Apply rate limiter to all routes
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
