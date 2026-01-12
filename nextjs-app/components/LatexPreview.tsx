'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  content: string;
}

interface Question {
  number: number;
  question: string;
  solution: string;
}

export default function LatexPreview({ content }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [visibleSolutions, setVisibleSolutions] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Parse questions and solutions from LaTeX content
    const parseQuestions = () => {
      const parsedQuestions: Question[] = [];
      
      // Try different section patterns - most specific first
      const patterns = [
        /\\subsection\*\{Question\s+(\d+)\s*\[.*?\]\}([\s\S]*?)(?=\\subsection\*\{Question\s+\d+|\\end\{document\}|$)/g,
        /\\section\*\{Question\s+(\d+)\}([\s\S]*?)(?=\\section\*\{Question\s+\d+\}|\\end\{document\}|$)/g,
        /\\textbf\{Question\s+(\d+)\}([\s\S]*?)(?=\\textbf\{Question\s+\d+\}|\\end\{document\}|$)/g,
        /Question\s+(\d+)[:\.\)]([\s\S]*?)(?=Question\s+\d+|\\end\{document\}|$)/gi,
      ];

      for (const questionRegex of patterns) {
        let match;
        questionRegex.lastIndex = 0; // Reset regex
        
        while ((match = questionRegex.exec(content)) !== null) {
          const questionNumber = parseInt(match[1]);
          const fullContent = match[2];
          
          // Split by solution marker
          const solutionPatterns = [
            /([\s\S]*?)\\subsection\*\{Solution\}([\s\S]*?)(?=\\subsection\*\{Question|\\vspace|$)/,
            /([\s\S]*?)\\textbf\{Solution[:\.\)]?\}([\s\S]*?)(?=\\subsection\*\{Question|\\textbf\{Question|$)/,
            /([\s\S]*?)Solution[:\.\)]([\s\S]*?)(?=Question \d+|$)/i
          ];
          
          let found = false;
          for (const solPattern of solutionPatterns) {
            const solutionMatch = fullContent.match(solPattern);
            if (solutionMatch) {
              parsedQuestions.push({
                number: questionNumber,
                question: solutionMatch[1].trim(),
                solution: solutionMatch[2].trim()
              });
              found = true;
              break;
            }
          }
          
          if (!found) {
            parsedQuestions.push({
              number: questionNumber,
              question: fullContent.trim(),
              solution: ''
            });
          }
        }
        
        if (parsedQuestions.length > 0) break;
      }

      setQuestions(parsedQuestions);
    };

    if (content) {
      parseQuestions();
    }
  }, [content]);

  useEffect(() => {
    if (previewRef.current && typeof window !== 'undefined') {
      // Render LaTeX math using KaTeX
      const renderMath = async () => {
        const katex = await import('katex');
        const renderMathInElement = (await import('katex/dist/contrib/auto-render')).default;
        
        if (previewRef.current) {
          renderMathInElement(previewRef.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false },
            ],
            throwOnError: false,
          });
        }
      };

      renderMath();
    }
  }, [questions, visibleSolutions]);

  const toggleSolution = (questionNumber: number) => {
    setVisibleSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionNumber)) {
        newSet.delete(questionNumber);
      } else {
        newSet.add(questionNumber);
      }
      return newSet;
    });
  };

  // Convert LaTeX content to HTML-friendly format
  const formatContent = (latex: string) => {
    // Remove documentclass and preamble for preview
    let formatted = latex
      .replace(/\\documentclass\{[^}]*\}/g, '')
      .replace(/\\usepackage\{[^}]*\}/g, '')
      .replace(/\\geometry\{[^}]*\}/g, '')
      .replace(/\\begin\{document\}/g, '')
      .replace(/\\end\{document\}/g, '')
      .replace(/\\maketitle/g, '<div class="text-center mb-8"><h1 class="text-3xl font-bold">Generated Questions</h1></div>')
      .replace(/\\title\{([^}]*)\}/g, '')
      .replace(/\\author\{([^}]*)\}/g, '')
      .replace(/\\date\{([^}]*)\}/g, '');

    // Convert sections
    formatted = formatted
      .replace(/\\section\*\{([^}]*)\}/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-purple-700">$1</h2>')
      .replace(/\\subsection\*\{([^}]*)\}/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-600">$1</h3>')
      .replace(/\\section\{([^}]*)\}/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-purple-700">$1</h2>')
      .replace(/\\subsection\{([^}]*)\}/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-600">$1</h3>');

    // Convert lists
    formatted = formatted
      .replace(/\\begin\{itemize\}/g, '<ul class="list-disc list-inside ml-4 my-4">')
      .replace(/\\end\{itemize\}/g, '</ul>')
      .replace(/\\begin\{enumerate\}/g, '<ol class="list-decimal list-inside ml-4 my-4">')
      .replace(/\\end\{enumerate\}/g, '</ol>')
      .replace(/\\item/g, '<li class="my-2">');

    // Convert text formatting
    formatted = formatted
      .replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>')
      .replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');

    // Add paragraph breaks
    formatted = formatted
      .split('\n\n')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => `<p class="my-4">${para}</p>`)
      .join('\n');

    return formatted;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 border-2 border-purple-200 rounded-xl p-8 max-h-[600px] overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">Generated Questions</h1>
      </div>
      
      <div ref={previewRef} className="space-y-8">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div key={q.number} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-purple-700">Question {q.number}</h2>
                {q.solution && (
                  <button
                    onClick={() => toggleSolution(q.number)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      visibleSolutions.has(q.number)
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {visibleSolutions.has(q.number) ? '🔼 Hide Solution' : '👁️ See Solution'}
                  </button>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none mb-4">
                <div dangerouslySetInnerHTML={{ __html: formatContent(q.question) }} />
              </div>
              
              {q.solution && visibleSolutions.has(q.number) && (
                <div className="mt-6 pt-6 border-t-2 border-purple-200">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">Solution</h3>
                  <div className="prose prose-lg max-w-none bg-purple-50 p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: formatContent(q.solution) }} />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Questions Generated Successfully!</h3>
            <p className="text-blue-600">Use the download buttons above to get your PDF. The preview will show parsed questions if available.</p>
            <div className="mt-4 text-left bg-white p-4 rounded max-h-96 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap">{content.substring(0, 1000)}...</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
