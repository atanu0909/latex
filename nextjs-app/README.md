# AI Question Generator - Next.js Application

An intelligent question generation system that converts PDF textbooks into customized practice questions using Google's Gemini AI. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 📚 **PDF Upload**: Upload any PDF textbook or educational material
- 🎯 **Subject Selection**: Choose from 8 different subjects including Mathematics, Physics, Chemistry, Biology, Computer Science, Statistics, Engineering, and Economics
- 🔢 **Customizable Quantity**: Generate 1-50 questions per session
- 📝 **Multiple Question Types**: 
  - Problem Solving
  - Conceptual Understanding
  - Real-world Application
  - Proof & Derivation
  - Multiple Choice
  - True/False
- 🎚️ **Difficulty Levels**: Easy, Medium, Hard, or Mixed
- 📄 **Dual Download Options**: 
  - LaTeX source file (.tex)
  - Compiled PDF document
- 🎨 **Modern UI**: Beautiful, responsive interface with real-time LaTeX rendering
- 🤖 **AI-Powered**: Uses Google Gemini 2.0 Flash for intelligent question generation

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- pdflatex (for PDF compilation)

### Installation

1. **Navigate to the Next.js app directory**:
   ```bash
   cd nextjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Install LaTeX (for PDF generation)**:
   
   **Ubuntu/Debian**:
   ```bash
   sudo apt update
   sudo apt install -y texlive texlive-latex-extra
   ```
   
   **macOS**:
   ```bash
   brew install --cask mactex
   ```
   
   **Windows**:
   Download and install [MiKTeX](https://miktex.org/download)

5. **Install PDF parsing library**:
   ```bash
   npm install pdf-parse
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📖 Usage Guide

1. **Customize Your Questions**:
   - Select your subject from the dropdown
   - Adjust the number of questions (1-50)
   - Choose question types (multiple selections allowed)
   - Set difficulty level

2. **Upload PDF**:
   - Click the upload area or drag & drop a PDF file
   - Maximum file size: 16MB

3. **Generate Questions**:
   - Click "Generate Questions" button
   - Wait for AI to process (usually 30-60 seconds)

4. **Download Results**:
   - View questions with rendered LaTeX math
   - Download as LaTeX (.tex) file
   - Compile and download as PDF

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **KaTeX**: Fast math rendering

### Backend (API Routes)
- **Next.js API Routes**: Serverless functions
- **Formidable**: File upload handling
- **pdf-parse**: PDF text extraction
- **Google Generative AI**: Question generation

### Additional Tools
- **pdflatex**: LaTeX to PDF compilation
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── QuestionCustomizer.tsx # Configuration panel
│   └── LatexPreview.tsx      # LaTeX preview component
├── pages/
│   └── api/
│       ├── upload.ts         # File upload & generation
│       ├── download-latex.ts # LaTeX download
│       └── download-pdf.ts   # PDF compilation
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
└── next.config.js           # Next.js config
```

## 🔧 Configuration Options

### Subject Options
- Mathematics (default)
- Physics
- Chemistry
- Biology
- Computer Science
- Statistics
- Engineering
- Economics

### Question Types
- Problem Solving
- Conceptual Understanding
- Real-world Application
- Proof & Derivation
- Multiple Choice
- True/False

### Difficulty Levels
- Easy: Fundamental concepts
- Medium: Standard application
- Hard: Advanced problem-solving
- Mixed: Variety of difficulties

## 🐛 Troubleshooting

### PDF Upload Fails
- Ensure file is a valid PDF (max 16MB)
- Check that the PDF contains extractable text

### LaTeX Rendering Issues
- Verify KaTeX CSS is loaded
- Check browser console for errors

### PDF Download Not Working
- Ensure pdflatex is installed: `which pdflatex`
- Check API route logs for compilation errors
- Download LaTeX file and compile locally as fallback

### API Key Errors
- Verify `.env.local` file exists
- Confirm API key is valid
- Restart development server after adding key

## 🔒 Security Notes

- API key is stored in `.env.local` (not committed to git)
- File uploads are validated for type and size
- Temporary files are cleaned up after processing
- Rate limiting recommended for production

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Note: PDF compilation may not work on serverless platforms. Consider:
- Using a separate service for PDF generation
- Offering LaTeX download only
- Using a cloud-based LaTeX compiler API

### Other Platforms
- Ensure Node.js 18+ runtime
- Install system dependencies (pdflatex)
- Configure environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for question generation
- KaTeX for math rendering
- Next.js team for the amazing framework
- LaTeX community for document preparation

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using Next.js and AI**
