const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const { corsMiddleware, helmetMiddleware } = require('./middleware/security');
const routes = require('./routes/routes');
const jobsService = require('./services/jobs');
const { ERROR_CODES } = require('../../shared/constants/constants.json');

const app = express();

// Enable trust proxy so express-rate-limit works behind Render's reverse proxy
app.set('trust proxy', 1);

// Apply security and parsing middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json());

// Set up temp directory on server start
if (!fs.existsSync(config.DOWNLOAD_DIR)) {
  fs.mkdirSync(config.DOWNLOAD_DIR, { recursive: true });
}

// Write YouTube cookies from env variable to file (required for Render deployment)
const cookiesPath = path.resolve(__dirname, '../cookies.txt');
if (process.env.YOUTUBE_COOKIES) {
  let cookiesContent = process.env.YOUTUBE_COOKIES;
  // If the environment variable contains literal '\n' sequences, normalize to real newlines
  if (cookiesContent.includes('\\n') && (!cookiesContent.includes('\n') || cookiesContent.split('\n').length <= 2)) {
    cookiesContent = cookiesContent.replace(/\\n/g, '\n');
  }
  // If base64-encoded, decode it
  if (!cookiesContent.startsWith('#') && cookiesContent.length > 50 && !cookiesContent.includes('\t')) {
    try {
      const decoded = Buffer.from(cookiesContent, 'base64').toString('utf8');
      if (decoded.includes('# Netscape') || decoded.includes('.youtube.com')) {
        cookiesContent = decoded;
      }
    } catch(e) {}
  }
  fs.writeFileSync(cookiesPath, cookiesContent, 'utf8');
  console.log('YouTube cookies written to:', cookiesPath, '(' + cookiesContent.length + ' bytes, ' + cookiesContent.split('\n').length + ' lines)');
}

// Log requests in development
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Register API Routes
app.use('/api', routes);

// Serve frontend in production environment
if (config.NODE_ENV === 'production') {
  const clientBuildDir = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientBuildDir)) {
    app.use(express.static(clientBuildDir));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildDir, 'index.html'));
    });
  }
}

// Background task: Clean stale files and job statuses periodically
const cleanupInterval = setInterval(() => {
  try {
    const cleanedCount = jobsService.cleanOldJobs(config.FILE_LIFETIME_MS);
    if (cleanedCount > 0) {
      console.log(`Automated cleanup: Swept ${cleanedCount} expired files/jobs.`);
    }
  } catch (e) {
    console.error('Cleanup routine failed:', e);
  }
}, config.CLEANUP_INTERVAL_MS);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  
  res.status(err.status || 500).json({
    code: err.code || ERROR_CODES.SERVER_ERROR,
    message: config.NODE_ENV === 'development' ? err.message : 'An unexpected server error occurred'
  });
});

// Start listening
const server = app.listen(config.PORT, () => {
  console.log(`========================================`);
  console.log(` Antigravity Downloader Backend Running `);
  console.log(` Port: ${config.PORT}                   `);
  console.log(` Env:  ${config.NODE_ENV}               `);
  console.log(` Temp: ${config.DOWNLOAD_DIR}           `);
  console.log(`========================================`);
});

// Handle graceful shutdown
function handleShutdown() {
  console.log('Shutting down server...');
  clearInterval(cleanupInterval);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);

module.exports = app; // For testing purposes
