#!/bin/bash
set -e

echo "🔨 Starting Render build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "🔧 Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies and build
echo "⚛️ Installing client dependencies..."
cd client && npm install

echo "🏗️ Building React client..."
npm run build

echo "✅ Build completed successfully!"

# List the created files for verification
echo "📁 Build output:"
ls -la dist/
