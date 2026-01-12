'use client';

import { useEffect, useRef } from 'react';

interface Props {
  content: string;
}

export default function LatexPreview({ content }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);

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
  }, [content]);

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
      <div
        ref={previewRef}
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
}
