#!/bin/bash

echo "🚀 TallmanChat Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please ensure npm is installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

# Check if Ollama is running
echo "🔍 Checking Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running!"
    
    # Check if phi3 model is available
    if curl -s http://localhost:11434/api/tags | grep -q "phi3"; then
        echo "✅ Phi3 model is available!"
    else
        echo "⚠️  Phi3 model not found. Installing..."
        echo "   This may take a few minutes..."
        ollama pull phi3
        if [ $? -eq 0 ]; then
            echo "✅ Phi3 model installed successfully!"
        else
            echo "❌ Failed to install Phi3 model. Please run 'ollama pull phi3' manually."
        fi
    fi
else
    echo "⚠️  Ollama is not running or not accessible."
    echo "   Please ensure Ollama is installed and running:"
    echo "   1. Install Ollama from https://ollama.ai"
    echo "   2. Run 'ollama serve' to start the service"
    echo "   3. Run 'ollama pull phi3' to download the model"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start TallmanChat:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
echo "Made by MIFECO for Tallman"

