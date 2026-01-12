# Math Question Generator - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [System Flow](#system-flow)
5. [Installation Guide](#installation-guide)
6. [Usage Guide](#usage-guide)
7. [API Reference](#api-reference)
8. [Component Details](#component-details)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### What It Does
The Math Question Generator is a full-stack web application that automatically generates comprehensive mathematics practice questions from educational PDF documents using Google's Gemini 2.0 AI. 

### Key Features
- 📤 **PDF Upload**: Drag-and-drop or click to upload PDF files
- 🤖 **AI-Powered Generation**: Uses Gemini 2.0 Flash to create intelligent questions
- 📐 **LaTeX Output**: Professional mathematical notation
- 👀 **Live Preview**: Real-time math rendering in browser using KaTeX
- 💾 **Multiple Formats**: Download as LaTeX source (.tex) or compiled PDF
- 🎨 **Modern UI**: Beautiful, responsive interface with animations

### Use Cases
- Teachers creating practice worksheets
- Students generating study materials
- Tutors preparing lesson content
- Educational institutions automating assessment creation

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Browser)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  HTML/CSS    │  │  JavaScript  │  │  KaTeX Renderer      │  │
│  │  - UI Layout │  │  - Upload    │  │  - Math Display      │  │
│  │  - Styling   │  │  - Validation│  │  - LaTeX → HTML      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/AJAX
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Flask Server)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Flask App   │  │  PyPDF2      │  │  Subprocess          │  │
│  │  - Routing   │  │  - Text      │  │  - pdflatex          │  │
│  │  - API       │  │    Extract   │  │    Compilation       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ API Call
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Google Gemini 2.0 Flash API                             │  │
│  │  - Natural Language Understanding                        │  │
│  │  - Question Generation                                   │  │
│  │  - LaTeX Formatting                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Three-Tier Architecture

1. **Presentation Layer** (Frontend)
   - Single-page web application
   - Handles user interactions
   - Renders mathematical content

2. **Application Layer** (Backend)
   - Flask web server
   - Business logic
   - File processing
   - API integration

3. **External Services**
   - Gemini AI API
   - LaTeX compilation system

---

## 💻 Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.12+ | Core programming language |
| Flask | 3.0.0 | Web framework |
| google-genai | 1.57.0+ | Gemini AI integration |
| PyPDF2 | 3.0.1 | PDF text extraction |
| Werkzeug | 3.0.1 | WSGI utilities |
| Subprocess | Built-in | Process management |
| Tempfile | Built-in | Temporary file handling |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Structure |
| CSS3 | - | Styling & animations |
| JavaScript (ES6) | - | Interactivity |
| KaTeX | 0.16.9 | Math rendering |
| Fetch API | - | AJAX requests |

### System Tools

| Tool | Purpose |
|------|---------|
| pdflatex | LaTeX to PDF compilation |
| TexLive | LaTeX distribution |
| Git | Version control |

---

## 🔄 System Flow

### Complete Data Flow

```
1. USER UPLOADS PDF
   ↓
2. FRONTEND VALIDATION
   - Check file type (.pdf)
   - Check file size (<16MB)
   - Display file info
   ↓
3. BACKEND RECEIVES FILE (POST /upload)
   - Flask request handler
   - Save to temporary location
   ↓
4. PDF TEXT EXTRACTION
   - PyPDF2.PdfReader()
   - Loop through all pages
   - Extract plain text
   ↓
5. AI PROCESSING
   - Format prompt with extracted text
   - Call Gemini 2.0 Flash API
   - Model: gemini-2.0-flash-exp
   - Wait for response
   ↓
6. GEMINI GENERATES CONTENT
   - Analyze PDF content
   - Create 10 questions
   - Write detailed solutions
   - Format in LaTeX
   - Return complete document
   ↓
7. BACKEND RETURNS LaTeX (JSON Response)
   {
     "success": true,
     "latex": "\\documentclass{article}..."
   }
   ↓
8. FRONTEND PROCESSING
   - Receive JSON
   - Extract LaTeX content
   - Parse document structure
   - Convert to HTML
   ↓
9. KATEX RENDERING
   - Identify math delimiters ($, $$, \[, \])
   - Render each equation
   - Display in preview area
   ↓
10. USER INTERACTION
    ├── VIEW: Browse questions in browser
    ├── DOWNLOAD LaTeX: Get .tex file
    └── DOWNLOAD PDF:
         ├─ Send LaTeX to /download-pdf
         ├─ Create temp directory
         ├─ Write .tex file
         ├─ Run pdflatex compiler
         ├─ Read generated PDF
         ├─ Send to user
         └─ Cleanup temp files
```

### Request/Response Details

#### Upload Endpoint
```http
POST /upload
Content-Type: multipart/form-data

Request:
- file: [PDF File Object]

Response:
{
  "success": true,
  "latex": "\\documentclass{article}\n..."
}

Error Response:
{
  "error": "Error message here"
}
```

#### Download LaTeX Endpoint
```http
POST /download
Content-Type: application/json

Request:
{
  "latex": "\\documentclass{article}..."
}

Response:
- Content-Type: text/plain
- Content-Disposition: attachment; filename=math_questions_[timestamp].tex
- Body: LaTeX file content
```

#### Download PDF Endpoint
```http
POST /download-pdf
Content-Type: application/json

Request:
{
  "latex": "\\documentclass{article}..."
}

Response:
- Content-Type: application/pdf
- Content-Disposition: attachment; filename=math_questions_[timestamp].pdf
- Body: PDF binary data
```

---

## 📦 Installation Guide

### Prerequisites
- Python 3.12 or higher
- pip package manager
- TexLive (for PDF compilation)
- Google Gemini API key

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/atanu0909/latex.git
cd latex
```

#### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Install LaTeX (if not installed)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended

# macOS
brew install --cask mactex

# Windows
# Download and install MiKTeX from https://miktex.org/
```

#### 4. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key

#### 5. Configure API Key

**Option A: Using Setup Script (Recommended)**
```bash
./setup_api_key.sh
# Enter your API key when prompted
```

**Option B: Manual Setup**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

**Option C: Environment Variable**
```bash
# Linux/Mac
export GEMINI_API_KEY=your_api_key_here

# Windows
set GEMINI_API_KEY=your_api_key_here
```

#### 6. Run the Application

**Using Start Script:**
```bash
./start.sh
```

**Or Manually:**
```bash
export GEMINI_API_KEY=your_api_key_here
python app.py
```

#### 7. Access the Application
Open browser and navigate to:
- Local: http://localhost:5000
- Network: http://[your-ip]:5000

---

## 📖 Usage Guide

### Basic Workflow

#### 1. Upload PDF
- Click the upload area or drag & drop a PDF file
- Supported: Any PDF with extractable text
- Maximum size: 16MB
- File info will be displayed after selection

#### 2. Generate Questions
- Click "Generate Questions" button
- Wait for AI processing (usually 10-30 seconds)
- Progress indicator will show during generation

#### 3. View Results
- Questions appear in the preview area
- Math equations are beautifully rendered
- Scroll through all generated questions and solutions

#### 4. Download
- **📥 Download PDF**: Get a compiled PDF document
- **📄 Download LaTeX**: Get the source .tex file
- **🔄 Generate New**: Start over with a new PDF

### Best Practices

#### For Best Results:
- Use PDFs with clear, well-formatted content
- Ensure text is extractable (not scanned images)
- Content should be mathematical or educational
- Longer, more detailed PDFs yield better questions

#### Example Use Cases:
1. **Textbook Chapter** → Practice problems with solutions
2. **Lecture Notes** → Review questions
3. **Research Paper** → Conceptual questions
4. **Tutorial Material** → Step-by-step exercises

---

## 🔧 Component Details

### Backend Components

#### 1. Flask Application (`app.py`)

**Main Configuration:**
```python
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['ALLOWED_EXTENSIONS'] = {'pdf'}
```

**Key Functions:**

**`extract_text_from_pdf(pdf_file)`**
- Purpose: Extract plain text from PDF
- Input: File object from request
- Output: String of concatenated page text
- Uses: PyPDF2.PdfReader

**`generate_questions_with_gemini(pdf_text)`**
- Purpose: Generate questions using AI
- Input: Extracted PDF text
- Output: Complete LaTeX document
- Model: gemini-2.0-flash-exp
- Prompt: Structured for LaTeX output

**Routes:**
- `GET /` - Serve homepage
- `POST /upload` - Process PDF upload
- `POST /download` - Download LaTeX file
- `POST /download-pdf` - Compile and download PDF

#### 2. PDF Compilation System

**Workflow:**
```python
1. Create temp directory: tempfile.mkdtemp()
2. Write LaTeX file: questions.tex
3. Compile: subprocess.run(['pdflatex', ...])
4. Read PDF: open('questions.pdf', 'rb')
5. Send to user: send_file()
6. Cleanup: shutil.rmtree(temp_dir)
```

**Error Handling:**
- FileNotFoundError: pdflatex not installed
- TimeoutExpired: Compilation takes >30s
- General Exception: LaTeX syntax errors

### Frontend Components

#### 1. HTML Structure (`templates/index.html`)

**Sections:**
- Header: Title and description
- Upload Section: File upload interface
- Loading Section: Progress indicator
- Result Section: Preview and download buttons

**Key Elements:**
```html
<input type="file" id="fileInput" accept=".pdf">
<div class="latex-preview" id="latexPreview"></div>
<button id="downloadPdfBtn">Download PDF</button>
<button id="downloadBtn">Download LaTeX</button>
```

#### 2. JavaScript Logic

**Event Handlers:**
- File selection (click + drag-drop)
- Upload button click
- Download LaTeX click
- Download PDF click
- New upload click

**Core Functions:**

**`handleFileSelect(file)`**
```javascript
- Validates file type
- Displays file info
- Enables generate button
```

**`displayLatex(latex)`**
```javascript
- Parses LaTeX document
- Converts to HTML
- Triggers KaTeX rendering
```

**`renderMathInElement()`**
```javascript
- KaTeX function
- Finds math delimiters
- Renders equations
- Handles errors gracefully
```

#### 3. CSS Styling

**Design Features:**
- Purple gradient background
- Card-based layout
- Smooth animations (fadeIn, hover effects)
- Responsive design
- Loading spinners

**Key Styles:**
```css
- Upload area: Dashed border, hover effects
- Buttons: Gradient, shadow, hover transform
- Preview: Clean typography, equation spacing
- Animations: 0.5s ease transitions
```

---

## 🔐 Security

### API Key Protection

**Storage:**
- Stored in `.env` file (not in code)
- File is in `.gitignore`
- Never committed to version control

**Access:**
```python
api_key = os.environ.get('GEMINI_API_KEY')
```

### File Upload Security

**Validations:**
1. File type check: Only .pdf allowed
2. Size limit: 16MB maximum
3. Secure filename: `werkzeug.secure_filename()`

**No stored files:**
- PDFs processed in memory
- Temporary files cleaned immediately

### Compilation Security

**Safeguards:**
1. Timeout: 30 seconds max
2. Isolated temp directories
3. Automatic cleanup
4. Non-interactive mode: `-interaction=nonstopmode`

### Network Security

**Recommendations for Production:**
- Use HTTPS
- Add CORS headers
- Implement rate limiting
- Add authentication
- Use production WSGI server (gunicorn)

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: "API key not configured"
**Cause:** GEMINI_API_KEY environment variable not set

**Solutions:**
```bash
# Check if .env exists
ls -la .env

# Run setup script
./setup_api_key.sh

# Or set manually
export GEMINI_API_KEY=your_key_here
```

#### Issue: "Could not extract text from PDF"
**Cause:** PDF contains scanned images or protected content

**Solutions:**
- Use OCR software to convert scanned PDFs
- Ensure PDF is not password protected
- Try a different PDF with selectable text

#### Issue: "PDF compilation failed"
**Cause:** pdflatex not installed or LaTeX syntax errors

**Solutions:**
```bash
# Check if pdflatex is installed
which pdflatex

# Install if missing
sudo apt-get install texlive-latex-base texlive-latex-extra

# Check LaTeX syntax in downloaded .tex file
```

#### Issue: "Models/gemini-X not found"
**Cause:** Using wrong model name

**Solution:**
- Model name in code: `gemini-2.0-flash-exp`
- Check Google AI Studio for available models
- Update `app.py` if model changes

#### Issue: Port 5000 already in use
**Solution:**
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Or use different port
# Edit app.py: app.run(port=5001)
```

#### Issue: "Module not found"
**Cause:** Dependencies not installed

**Solution:**
```bash
pip install -r requirements.txt
```

### Debug Mode

**Enable verbose logging:**
```python
# Already enabled in app.py
app.run(debug=True)
```

**Check terminal output for:**
- Request logs
- Error stack traces
- Compilation output

---

## 📊 Performance Considerations

### Response Times
- PDF upload: <1s
- Text extraction: 1-3s (depends on PDF size)
- Gemini API: 10-30s (depends on content length)
- PDF compilation: 3-10s (depends on complexity)

### Optimization Tips
1. Use smaller PDFs for faster processing
2. Limit PDF to relevant pages only
3. Consider caching frequently used PDFs
4. Use production WSGI server for better performance

---

## 🚀 Deployment

### Production Checklist

**Before deploying:**
- [ ] Change `debug=True` to `debug=False`
- [ ] Use production WSGI server (gunicorn)
- [ ] Set up HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring
- [ ] Add rate limiting
- [ ] Implement logging
- [ ] Set up backup for .env file

**Example Production Setup:**
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 📄 File Structure Reference

```
latex/
├── app.py                          # Main Flask application (216 lines)
├── templates/
│   └── index.html                  # Frontend UI (477 lines)
├── uploads/                        # Temporary upload directory
├── .env                           # API key (git-ignored)
├── .env.example                   # API key template
├── .gitignore                     # Git ignore rules
├── requirements.txt               # Python dependencies
├── setup_api_key.sh              # API key setup script
├── start.sh                       # Quick start script
├── API_KEY_SETUP.txt             # Setup instructions
├── README.md                      # Project overview
└── PROJECT_DOCUMENTATION.md       # This file
```

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create Pull Request

---

## 📝 License

MIT License - Free to use and modify

---

## 👤 Author

**Repository:** atanu0909/latex  
**Branch:** main  
**Created:** January 2026

---

## 📞 Support

For issues and questions:
1. Check this documentation
2. Review troubleshooting section
3. Check GitHub issues
4. Create new issue if needed

---

**Last Updated:** January 12, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
