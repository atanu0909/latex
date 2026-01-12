#!/bin/bash

echo "🚀 Starting Math Question Generator"
echo "==================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo ""
    read -p "Would you like to set up your API key now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./setup_api_key.sh
    else
        echo "❌ Cannot start without API key. Please run: ./setup_api_key.sh"
        exit 1
    fi
fi

# Load environment variables
export $(cat .env | xargs)

# Check if dependencies are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "✅ Starting Flask application..."
echo "🌐 Access the app at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
