#!/bin/bash

echo "🔐 Gemini API Key Setup Script"
echo "================================"
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists."
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo ""
echo "📝 Please enter your Gemini API Key:"
echo "   (Get it from: https://makersuite.google.com/app/apikey)"
echo ""
read -s -p "API Key: " API_KEY
echo ""

if [ -z "$API_KEY" ]; then
    echo "❌ Error: API key cannot be empty"
    exit 1
fi

# Create .env file
echo "GEMINI_API_KEY=$API_KEY" > .env

echo ""
echo "✅ API key has been saved to .env file"
echo "🔒 The .env file is in .gitignore and will not be committed to git"
echo ""
echo "Next steps:"
echo "1. Install dependencies: pip install -r requirements.txt"
echo "2. Run the app: python app.py"
echo ""
