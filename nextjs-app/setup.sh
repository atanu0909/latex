#!/bin/bash

echo "🚀 Setting up AI Question Generator - Next.js Edition"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required!"
    echo "Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the nextjs-app directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Install pdf-parse for PDF processing
echo "📄 Installing PDF parsing library..."
npm install pdf-parse

echo ""

# Set up API key
if [ ! -f ".env.local" ]; then
    echo "🔑 API Key Setup"
    echo "==============="
    echo ""
    read -p "Enter your Gemini API key (or press Enter to set it later): " API_KEY
    
    if [ ! -z "$API_KEY" ]; then
        echo "GEMINI_API_KEY=$API_KEY" > .env.local
        echo "✅ API key saved to .env.local"
    else
        echo "⚠️  Remember to create .env.local with your API key:"
        echo "   GEMINI_API_KEY=your_api_key_here"
    fi
else
    echo "✅ .env.local file already exists"
fi

echo ""

# Check for pdflatex
if command -v pdflatex &> /dev/null; then
    echo "✅ pdflatex is installed - PDF generation will work"
else
    echo "⚠️  pdflatex is NOT installed"
    echo ""
    echo "PDF compilation will not work. Install LaTeX:"
    echo "  Ubuntu/Debian: sudo apt install -y texlive texlive-latex-extra"
    echo "  macOS: brew install --cask mactex"
    echo "  Windows: Download MiKTeX from https://miktex.org/download"
    echo ""
    echo "Users can still download LaTeX files without pdflatex"
fi

echo ""
echo "=================================================="
echo "✨ Setup complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Make sure .env.local has your Gemini API key"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For production:"
echo "  npm run build"
echo "  npm start"
echo ""
echo "Happy question generating! 🎓"
