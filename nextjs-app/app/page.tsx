'use client';

import { useState, useRef } from 'react';
import QuestionCustomizer from '@/components/QuestionCustomizer';
import LatexPreview from '@/components/LatexPreview';

interface QuestionConfig {
  subject: string;
  className: string;
  questionTypes: string[];
  difficulty: string;
  customInstructions?: string;
  questionsByType?: {
    mcq: number;
    fillInBlanks: number;
    trueFalse: number;
    general: number;
  };
  questionsByMarks?: {
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
    '10': number;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latexContent, setLatexContent] = useState('');
  const [config, setConfig] = useState<QuestionConfig>({
    subject: 'mathematics',
    className: 'class-10',
    questionTypes: ['problem-solving', 'conceptual'],
    difficulty: 'mixed',
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please drop a PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setLatexContent('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', config.subject);
      formData.append('className', config.className);
      config.questionTypes.forEach(type => {
        formData.append('questionTypes', type);
      });
      formData.append('difficulty', config.difficulty);
      
      if (config.customInstructions) {
        formData.append('customInstructions', config.customInstructions);
      }
      
      if (config.questionsByType) {
        formData.append('questionsByType', JSON.stringify(config.questionsByType));
      }
      
      if (config.questionsByMarks) {
        formData.append('questionsByMarks', JSON.stringify(config.questionsByMarks));
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setLatexContent(data.latex);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLatex = async () => {
    try {
      const response = await fetch('/api/download-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexContent }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `math_questions_${Date.now()}.tex`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Download failed');
    }
  };

  const handleDownloadPDF = async (includeSolutions: boolean = true) => {
    try {
      setLoading(true);
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexContent, includeSolutions }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'PDF generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `math_questions_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'PDF download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl mb-8 p-8 border border-white/20">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-6xl">📚</div>
              <div>
                <h1 className="text-6xl font-black mb-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                  STUDYBUDDY
                </h1>
                <p className="text-sm text-purple-200 font-semibold tracking-wider">Powered by INFOTECH SERVICES</p>
              </div>
              <div className="text-6xl">✨</div>
            </div>
            <p className="text-xl opacity-90 font-medium">
              Your AI-Powered Study Companion - Generate Smart Questions Instantly!
            </p>
          </div>
        </header>

        {/* Question Customizer */}
        <QuestionCustomizer config={config} onConfigChange={setConfig} />

        {/* Upload Section */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8 mb-8 border-2 border-purple-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <span className="text-3xl">📤</span>
            <span>Upload Your PDF Textbook</span>
          </h2>

          <div
            className={`border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all transform ${
              isDragging
                ? 'border-purple-600 bg-purple-100 scale-105 shadow-2xl'
                : 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 hover:bg-purple-100 hover:shadow-xl'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-6xl mb-4">📄</div>
            <div className="text-xl text-gray-700 mb-2">
              {file ? file.name : 'Drop your PDF file here or click to browse'}
            </div>
            <div className="text-sm text-gray-500">
              Maximum file size: 16MB
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transform"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  ⚡ Generating Questions...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>✨</span>
                  <span>Generate Questions</span>
                  <span>🚀</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 text-red-800 px-6 py-4 rounded-2xl mb-8 shadow-lg flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <strong className="font-bold">Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Results Section */}
        {latexContent && (
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl p-8 animate-fadeIn border-2 border-indigo-200">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-4xl">🎉</span>
                <span>Generated Questions</span>
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleDownloadLatex}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-110"
                >
                  📥 Download LaTeX
                </button>
                <button
                  onClick={() => handleDownloadPDF(false)}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 transform hover:scale-110"
                >
                  {loading ? '⏳ Compiling...' : '📄 Questions Only PDF'}
                </button>
                <button
                  onClick={() => handleDownloadPDF(true)}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 transform hover:scale-110"
                >
                  {loading ? '⏳ Compiling...' : '📚 PDF with Solutions'}
                </button>
              </div>
            </div>

            <LatexPreview content={latexContent} />
          </div>
        )}

        {/* Loading Indicator */}
        {loading && !latexContent && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl text-gray-700">
              Processing your textbook and generating questions...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a minute or two
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
