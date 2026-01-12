# 🎓 AI Question Generator - Migration Guide

This document explains the migration from Flask to Next.js and highlights the enhancements.

## 📊 Comparison: Flask vs Next.js

| Feature | Flask Version | Next.js Version |
|---------|--------------|-----------------|
| Framework | Python/Flask | TypeScript/Next.js |
| Frontend | HTML/CSS/JS | React/TypeScript |
| Styling | Inline CSS | Tailwind CSS |
| API | Flask routes | Next.js API Routes |
| State Management | DOM manipulation | React state |
| Type Safety | None | Full TypeScript |
| Hot Reload | Limited | Full HMR |
| Production Ready | Manual setup | Built-in optimization |

## ✨ New Features in Next.js Version

### 1. **Subject Selection** 🎯
Users can now choose from 8 different subjects:
- Mathematics
- Physics
- Chemistry
- Biology
- Computer Science
- Statistics
- Engineering
- Economics

### 2. **Customizable Question Count** 🔢
- Adjust from 1 to 50 questions
- Slider and number input for convenience
- Dynamic preview of selection

### 3. **Question Type Selection** 📝
Choose multiple question types:
- Problem Solving
- Conceptual Understanding
- Real-world Application
- Proof & Derivation
- Multiple Choice
- True/False

### 4. **Difficulty Levels** 🎚️
- Easy
- Medium
- Hard
- Mixed (variety)

### 5. **Improved UI/UX** 🎨
- Modern, responsive design
- Real-time configuration preview
- Better drag & drop interface
- Smooth animations and transitions
- Mobile-friendly layout

### 6. **Better Error Handling** ⚠️
- Clear error messages
- Loading states
- Progress indicators

## 🔄 Migration Steps

### For Users

If you were using the Flask version:

1. **Install Next.js version**:
   ```bash
   cd nextjs-app
   npm install
   ```

2. **Copy your API key**:
   ```bash
   # From flask/.env
   # To nextjs-app/.env.local
   ```

3. **Start the new version**:
   ```bash
   npm run dev
   ```

### For Developers

**API Endpoint Mapping**:

| Flask Route | Next.js API Route |
|------------|------------------|
| POST `/upload` | POST `/api/upload` |
| POST `/download` | POST `/api/download-latex` |
| POST `/download-pdf` | POST `/api/download-pdf` |

**Key Changes**:

1. **File Upload**:
   - Flask: `werkzeug.FileStorage`
   - Next.js: `formidable` library

2. **PDF Processing**:
   - Flask: `PyPDF2`
   - Next.js: `pdf-parse`

3. **AI Integration**:
   - Flask: `google.genai` (Python SDK)
   - Next.js: `@google/generative-ai` (TypeScript SDK)

4. **LaTeX Rendering**:
   - Flask: Client-side KaTeX
   - Next.js: React component with KaTeX

## 🏗️ Architecture Changes

### Flask Architecture
```
Flask App
├── Routes (app.py)
├── Templates (HTML)
└── Static (CSS/JS)
```

### Next.js Architecture
```
Next.js App
├── App Directory (pages)
├── API Routes (serverless)
├── Components (React)
└── Styles (Tailwind)
```

## 📦 Dependencies

### Removed (Flask-specific)
- Flask
- PyPDF2
- werkzeug
- markdown

### Added (Next.js-specific)
- next
- react
- react-dom
- typescript
- tailwindcss
- formidable
- pdf-parse
- @google/generative-ai

## 🔧 Configuration Files

### New Files
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config
- `tailwind.config.ts` - Tailwind config
- `postcss.config.js` - PostCSS config

### Migrated Files
- `.env` → `.env.local`
- `requirements.txt` → `package.json`

## 🚀 Performance Improvements

1. **Faster Initial Load**:
   - Next.js code splitting
   - Automatic optimization

2. **Better Caching**:
   - Static generation
   - API route caching

3. **Smaller Bundle Size**:
   - Tree shaking
   - Minification

4. **Improved SEO**:
   - Server-side rendering
   - Meta tags

## 🎯 Future Enhancements

Possible additions to the Next.js version:

1. **User Accounts**:
   - Save configurations
   - Question history
   - Custom templates

2. **Batch Processing**:
   - Multiple PDF uploads
   - Bulk question generation

3. **Export Options**:
   - Word document
   - Markdown
   - HTML

4. **Analytics**:
   - Usage statistics
   - Popular subjects
   - Question difficulty distribution

5. **Collaboration**:
   - Share question sets
   - Team workspaces
   - Review system

## 📝 Notes

- Both versions maintain the same core functionality
- Next.js version is more maintainable and scalable
- TypeScript provides better development experience
- React components are reusable and testable

## 🤔 Which Version to Use?

**Use Flask version if**:
- You prefer Python
- You have existing Python infrastructure
- Simple deployment requirements

**Use Next.js version if**:
- You want modern web development
- Need scalability
- Want enhanced features
- Prefer TypeScript/React

## 📞 Support

For migration questions:
1. Check this guide
2. Review README.md
3. Open GitHub issue

---

**Welcome to the Next.js version! 🎉**
