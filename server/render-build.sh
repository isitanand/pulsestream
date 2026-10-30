#!/usr/bin/env bash
set -e

echo "=== Starting Render Server Build ==="

# 1. Install dependencies
echo "Installing Node.js dependencies..."
npm install

# 2. Set up local bin directory inside server
echo "Creating local bin directory..."
mkdir -p bin

# 3. Download yt-dlp binary from GitHub Releases
echo "Downloading yt-dlp binary..."
curl -fL --retry 3 https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o bin/yt-dlp
chmod +x bin/yt-dlp

# 4. Download static ffmpeg / ffprobe from official yt-dlp FFmpeg-Builds on GitHub
echo "Downloading static ffmpeg from GitHub Releases..."
curl -fL --retry 3 https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz -o ffmpeg.tar.xz

echo "Extracting ffmpeg..."
tar -xf ffmpeg.tar.xz

# Move binaries to bin directory
echo "Moving ffmpeg & ffprobe to bin/..."
cp ffmpeg-*/bin/ffmpeg bin/ffmpeg
cp ffmpeg-*/bin/ffprobe bin/ffprobe
chmod +x bin/ffmpeg bin/ffprobe

# Clean up
echo "Cleaning up temporary tarball and extraction directory..."
rm -rf ffmpeg.tar.xz ffmpeg-*

echo "Verifying local binaries:"
ls -lh bin/

echo "=== Render Server Build Complete ==="
