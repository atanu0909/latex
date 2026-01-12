'use client';

import { useState, useRef } from 'react';
import QuestionCustomizer from '@/components/QuestionCustomizer';
import LatexPreview from '@/components/LatexPreview';

interface QuestionConfig {
  subject: string;
  numQuestions: number;
  questionTypes: string[];
  difficulty: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latexContent, setLatexContent] = useState('');
  const [config, setConfig] = useState<QuestionConfig>({
    subject: 'mathematics',
    numQuestions: 10,
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
      formData.append('numQuestions', config.numQuestions.toString());
      config.questionTypes.forEach(type => {
        formData.append('questionTypes', type);
      });
      formData.append('difficulty', config.difficulty);

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

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexContent }),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            📚 AI Question Generator
          </h1>
          <p className="text-xl opacity-90">
            Generate customized questions from your textbooks using AI
          </p>
        </header>

        {/* Question Customizer */}
        <QuestionCustomizer config={config} onConfigChange={setConfig} />

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Upload Your PDF Textbook
          </h2>

          <div
            className={`border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-purple-600 bg-purple-50 scale-105'
                : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
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
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  Generating Questions...
                </span>
              ) : (
                '✨ Generate Questions'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results Section */}
        {latexContent && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Generated Questions
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadLatex}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all hover:scale-105"
                >
                  📥 Download LaTeX
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-all disabled:opacity-50 hover:scale-105"
                >
                  {loading ? 'Compiling...' : '📄 Download PDF'}
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
