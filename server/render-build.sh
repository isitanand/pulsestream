#!/usr/bin/env bash
set -e

echo "=== Starting Render Server Build ==="

# 1. Install Node dependencies
echo "Installing Node.js dependencies..."
npm install

# 2. Set up local bin directory inside server
echo "Creating local bin directory..."
mkdir -p bin

# 3. Download standalone yt-dlp binary from GitHub Releases
echo "Downloading yt-dlp binary..."
curl -fL --retry 3 https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o bin/yt-dlp
chmod +x bin/yt-dlp

# Also install yt-dlp via pip3/pip if available
if command -v pip3 &> /dev/null; then
  echo "Installing yt-dlp via pip3..."
  pip3 install --upgrade yt-dlp || true
elif command -v pip &> /dev/null; then
  echo "Installing yt-dlp via pip..."
  pip install --upgrade yt-dlp || true
fi

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

# Clean up temporary tarball
rm -rf ffmpeg.tar.xz ffmpeg-*

# 5. Download Deno standalone binary (official JS runtime required by modern yt-dlp for signature decoding)
echo "Downloading Deno JavaScript runtime..."
curl -fL --retry 3 https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip -o deno.zip
unzip -o deno.zip -d bin/
chmod +x bin/deno
rm -f deno.zip

echo "Verifying local binaries in bin/:"
ls -lh bin/

echo "Testing binaries:"
bin/yt-dlp --version || true
bin/deno --version || true

echo "=== Render Server Build Complete ==="
