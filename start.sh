#!/bin/bash

echo ""
echo "========================================"
echo "    Imagify - AI Image Generation"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found! Version:"
node --version

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not installed!"
    exit 1
fi

echo "✅ npm found! Version:"
npm --version

echo ""
echo "========================================"
echo "    Starting Development Servers"
echo "========================================"
echo ""

echo "🚀 Starting both frontend and backend servers..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API will be available at: http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev 