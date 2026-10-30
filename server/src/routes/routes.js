const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const { validateUrl, rateLimiter } = require('../middleware/security');

// Health check endpoint (exempt from rate limiting for keep-alive pings)
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(), 
    timestamp: Date.now() 
  });
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
