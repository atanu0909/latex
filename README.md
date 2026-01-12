# Math Question Generator with Gemini AI

A web application that generates comprehensive math questions from PDF documents using Google's Gemini AI. The questions are generated in LaTeX format and beautifully rendered for viewing and download.

## Features

- 📄 **PDF Upload**: Drag and drop or click to upload PDF files
- 🤖 **AI-Powered**: Uses Google's Gemini AI to generate intelligent math questions
- 📐 **LaTeX Output**: Generates professional LaTeX formatted questions and solutions
- 🎨 **Live Preview**: Renders LaTeX math in real-time using KaTeX
- 💾 **Download**: Download generated questions as .tex files
- 🎯 **Step-by-Step Solutions**: Includes detailed solutions for each question

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the Application

```bash
# Set environment variable (Linux/Mac)
export GEMINI_API_KEY=your_actual_api_key_here

# Or on Windows
set GEMINI_API_KEY=your_actual_api_key_here

# Run the Flask app
python app.py
```

The application will be available at `http://localhost:5000`

## Usage

1. **Upload PDF**: Click the upload area or drag a PDF file containing math content
2. **Generate Questions**: Click "Generate Questions" button
3. **View Results**: The questions will be displayed with rendered LaTeX math
4. **Download**: Click "Download LaTeX File" to get the .tex file
5. **Compile LaTeX**: Use the downloaded .tex file with any LaTeX compiler (pdflatex, XeLaTeX, etc.)

## How It Works

1. **PDF Processing**: Extracts text content from uploaded PDF using PyPDF2
2. **AI Generation**: Sends content to Gemini AI with a specialized prompt for math question generation
3. **LaTeX Formatting**: Gemini generates questions in proper LaTeX format with document structure
4. **Rendering**: KaTeX library renders the LaTeX math in the browser for preview
5. **Download**: Users can download the raw .tex file for compilation

## Project Structure

```
latex/
├── app.py                 # Flask application main file
├── templates/
│   └── index.html        # Frontend HTML with CSS and JavaScript
├── uploads/              # Temporary PDF storage (auto-created)
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variable template
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Technologies Used

- **Backend**: Flask (Python)
- **AI**: Google Gemini API
- **PDF Processing**: PyPDF2
- **Math Rendering**: KaTeX
- **Frontend**: HTML, CSS, JavaScript

## Security Notes

- ✅ API key is stored in environment variables (not in code)
- ✅ `.env` file is in `.gitignore` to prevent accidental commits
- ✅ File upload size limited to 16MB
- ✅ Only PDF files are accepted

## Tips

- For best results, upload PDFs with clear, well-formatted math content
- The AI generates 10 questions by default (you can modify the prompt in app.py)
- Generated LaTeX uses standard packages (amsmath, amssymb)
- Compile downloaded .tex files with: `pdflatex filename.tex`

## Troubleshooting

**Issue**: "No module named 'google.generativeai'"
- **Solution**: Run `pip install -r requirements.txt`

**Issue**: "API key not configured"
- **Solution**: Make sure you've set the `GEMINI_API_KEY` environment variable

**Issue**: "Could not extract text from PDF"
- **Solution**: Ensure your PDF contains extractable text (not scanned images)

## License

MIT License - feel free to use and modify for your needs!
