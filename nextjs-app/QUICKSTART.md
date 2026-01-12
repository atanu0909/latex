# 🚀 Quick Start Guide - AI Question Generator (Next.js)

Get up and running in 5 minutes!

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Gemini API key ready ([Get it here](https://makersuite.google.com/app/apikey))
- [ ] Terminal/Command prompt open

## ⚡ Installation (3 steps)

### Step 1: Navigate to the project
```bash
cd /workspaces/latex/nextjs-app
```

### Step 2: Run setup script
```bash
./setup.sh
```
This will:
- Install all dependencies
- Set up your API key
- Check for pdflatex

### Step 3: Start the server
```bash
npm run dev
```

## 🎉 You're Ready!

Open **http://localhost:3000** in your browser.

## 🎮 How to Use

### 1. Customize Your Questions (Optional)
Click "⚙️ Customize Questions" to:
- Select subject (Math, Physics, Chemistry, etc.)
- Set number of questions (1-50)
- Choose question types
- Pick difficulty level

### 2. Upload PDF
- Drag & drop a PDF file, or
- Click the upload area to browse

### 3. Generate
Click "✨ Generate Questions" and wait 30-60 seconds

### 4. Download
- **📥 Download LaTeX**: Get the .tex source file
- **📄 Download PDF**: Get the compiled PDF (requires pdflatex)

## 🎯 Example Configuration

**For Math Homework (Easy)**:
- Subject: Mathematics
- Questions: 15
- Types: Problem Solving, Conceptual
- Difficulty: Easy

**For Physics Exam Prep (Mixed)**:
- Subject: Physics
- Questions: 25
- Types: Problem Solving, Application, Multiple Choice
- Difficulty: Mixed

**For CS Study Guide**:
- Subject: Computer Science
- Questions: 20
- Types: Conceptual, True/False
- Difficulty: Medium

## ❓ Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "API key not configured"
1. Check `.env.local` exists
2. Verify format: `GEMINI_API_KEY=your_key_here`
3. Restart server: `npm run dev`

### "PDF compilation failed"
- Download LaTeX file instead
- Install pdflatex (see README.md)
- Or use online LaTeX compiler

### Upload fails
- Check PDF file size (max 16MB)
- Ensure PDF has extractable text
- Try a different PDF

## 🔥 Pro Tips

1. **Save Time**: Configure once, upload multiple PDFs
2. **Best Results**: Use PDFs with clear, typed text (not scanned images)
3. **Custom Mix**: Select multiple question types for variety
4. **LaTeX Editing**: Download .tex file to customize questions further
5. **Batch Work**: Generate questions for multiple chapters separately

## 📱 Keyboard Shortcuts

- **Drag & Drop**: Quick upload
- **Click Upload Area**: Browse files
- **Slider**: Quick question count adjustment

## 🎨 Features at a Glance

✅ 8 Subject areas
✅ 1-50 questions per generation
✅ 6 question types
✅ 4 difficulty levels  
✅ Real-time LaTeX preview
✅ Dual download formats
✅ Drag & drop upload
✅ Mobile responsive

## 📚 Need Help?

1. Check **README.md** for detailed docs
2. See **MIGRATION.md** for Flask comparison
3. Review troubleshooting section above

## 🚀 Production Deployment

Ready to deploy? Run:
```bash
npm run build
npm start
```

For Vercel/Netlify/other platforms, see README.md deployment section.

---

**Happy Learning! 🎓**

Start generating questions in under 5 minutes!
