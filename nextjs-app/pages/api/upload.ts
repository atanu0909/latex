import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface PDFMetadata {
  subject?: string;
  questionTypes?: string[];
  difficulty?: string;
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

async function extractTextFromPDF(filePath: string): Promise<string> {
  const { PDFParse } = await import('pdf-parse');
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  return result.text;
}

async function generateQuestionsWithGemini(
  pdfText: string,
  metadata: PDFMetadata
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const subject = metadata.subject || 'mathematics';
  const questionTypes = metadata.questionTypes || ['problem-solving', 'conceptual', 'application'];
  const difficulty = metadata.difficulty || 'mixed';

  const questionTypeDesc = questionTypes.join(', ');

  // Build question breakdown
  let questionBreakdown = '';
  
  if (metadata.questionsByType) {
    const types = metadata.questionsByType;
    const parts: string[] = [];
    if (types.mcq > 0) parts.push(`${types.mcq} Multiple Choice Questions (MCQ)`);
    if (types.fillInBlanks > 0) parts.push(`${types.fillInBlanks} Fill in the Blanks questions`);
    if (types.trueFalse > 0) parts.push(`${types.trueFalse} True/False questions`);
    if (types.general > 0) parts.push(`${types.general} General questions`);
    
    if (parts.length > 0) {
      questionBreakdown += '\n\n1 Mark Questions:\n' + parts.map(p => `- ${p}`).join('\n');
    }
  }
  
  if (metadata.questionsByMarks) {
    const marks = metadata.questionsByMarks;
    const parts: string[] = [];
    if (marks['2'] > 0) parts.push(`${marks['2']} questions of 2 marks each`);
    if (marks['3'] > 0) parts.push(`${marks['3']} questions of 3 marks each`);
    if (marks['4'] > 0) parts.push(`${marks['4']} questions of 4 marks each`);
    if (marks['5'] > 0) parts.push(`${marks['5']} questions of 5 marks each`);
    if (marks['6'] > 0) parts.push(`${marks['6']} questions of 6 marks each`);
    if (marks['10'] > 0) parts.push(`${marks['10']} questions of 10 marks each`);
    
    if (parts.length > 0) {
      questionBreakdown += '\n\nQuestions by Marks:\n' + parts.map(p => `- ${p}`).join('\n');
    }
  }

  const customInstructionsSection = metadata.customInstructions 
    ? `\n\nCUSTOM INSTRUCTIONS (HIGHEST PRIORITY):\n${metadata.customInstructions}\n\nPlease follow these custom instructions carefully as they take precedence over other settings.`
    : '';

  const prompt = `
You are an expert ${subject} educator. Based on the following educational content, generate comprehensive questions with solutions.

Content:
${pdfText}

Please generate high-quality ${subject} questions based on this content.${questionBreakdown}

Question Requirements:
- Question types: ${questionTypeDesc}
- Difficulty level: ${difficulty}
- Each question should be clear and well-formatted
- Provide detailed step-by-step solutions
- Use proper LaTeX notation for all mathematical expressions${customInstructionsSection}

Format your response ENTIRELY in LaTeX using this EXACT structure for a proper exam paper:

\\documentclass[12pt,a4paper]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage{graphicx}
\\geometry{margin=0.75in, top=1in, bottom=1in}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\textbf{${subject.charAt(0).toUpperCase() + subject.slice(1)} Examination}}
\\fancyhead[R]{\\textbf{Page \\thepage}}
\\fancyfoot[C]{\\small All questions carry marks as indicated}

\\begin{document}

% Header Section
\\begin{center}
{\\Large \\textbf{EXAMINATION PAPER}}\\\\[0.3cm]
{\\large \\textbf{Subject: ${subject.charAt(0).toUpperCase() + subject.slice(1)}}}\\\\[0.2cm]
{\\textbf{Difficulty Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}}}\\\\[0.2cm]
\\rule{\\textwidth}{0.4pt}
\\end{center}

\\vspace{0.3cm}

% Instructions Box
\\noindent\\fbox{\\parbox{\\dimexpr\\textwidth-2\\fboxsep-2\\fboxrule}{
\\textbf{INSTRUCTIONS TO CANDIDATES:}\\\\[0.2cm]
\\begin{itemize}[leftmargin=*, itemsep=0pt]
\\item Read all questions carefully before attempting.
\\item Answer all questions in the space provided or on separate sheets.
\\item Show all working for full credit.
\\item Marks for each question are indicated in brackets.
\\item Use of calculator is permitted (if applicable).
${questionBreakdown ? '\\item ' + questionBreakdown.replace(/\n/g, '\n\\item ').replace('1 Mark Questions:', '\\textbf{Section A:} 1 Mark Questions').replace('Questions by Marks:', '\\textbf{Section B:} Higher Mark Questions') : ''}
\\end{itemize}
}}

\\vspace{0.5cm}

% Questions Section
\\section*{QUESTIONS}

[Now generate each question using this EXACT format:

\\subsection*{Question 1 [X marks]}
[Question text with proper LaTeX math formatting]

\\subsection*{Solution}
[Detailed solution with step-by-step explanation]

\\vspace{0.5cm}

Repeat for all questions, ensuring proper numbering and mark allocation.]

\\end{document}

CRITICAL FORMATTING REQUIREMENTS:
- Use \\subsection*{Question N [X marks]} for each question header
- Use \\subsection*{Solution} for each solution
- Use $...$ for inline math and $$...$$ or \\[...\\] for display math
- For MCQs: Use (a), (b), (c), (d) format
- For Fill in Blanks: Use \\underline{\\hspace{3cm}} for blanks
- Add \\vspace{0.5cm} between questions for spacing
- Make questions relevant to the provided content
- STRICTLY follow the custom instructions if provided
- Number questions consecutively starting from 1
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 16 * 1024 * 1024, // 16MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const filePath = (file as File).filepath;

      try {
        // Extract metadata
        const metadata: PDFMetadata = {
          subject: Array.isArray(fields.subject) ? fields.subject[0] : fields.subject,
          questionTypes: Array.isArray(fields.questionTypes) 
            ? fields.questionTypes 
            : (fields.questionTypes ? [fields.questionTypes] : undefined),
          difficulty: Array.isArray(fields.difficulty) ? fields.difficulty[0] : fields.difficulty,
          customInstructions: Array.isArray(fields.customInstructions) ? fields.customInstructions[0] : fields.customInstructions,
        };

        // Parse JSON fields
        if (fields.questionsByType) {
          const qbtStr = Array.isArray(fields.questionsByType) ? fields.questionsByType[0] : fields.questionsByType;
          try {
            metadata.questionsByType = JSON.parse(qbtStr);
          } catch (e) {
            console.error('Error parsing questionsByType:', e);
          }
        }

        if (fields.questionsByMarks) {
          const qbmStr = Array.isArray(fields.questionsByMarks) ? fields.questionsByMarks[0] : fields.questionsByMarks;
          try {
            metadata.questionsByMarks = JSON.parse(qbmStr);
          } catch (e) {
            console.error('Error parsing questionsByMarks:', e);
          }
        }

        // Extract text from PDF
        const pdfText = await extractTextFromPDF(filePath);

        if (!pdfText.trim()) {
          // Clean up uploaded file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          return res.status(400).json({ error: 'Could not extract text from PDF' });
        }

        // Generate questions using Gemini
        let latexContent = await generateQuestionsWithGemini(pdfText, metadata);
        
        // Strip markdown code fences if present
        latexContent = latexContent.replace(/^```(?:latex)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

        // Clean up uploaded file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(200).json({
          success: true,
          latex: latexContent,
        });
      } catch (error: any) {
        console.error('Processing error:', error);
        // Clean up on error
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
        }
        return res.status(500).json({ error: error.message || 'Failed to process PDF' });
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
