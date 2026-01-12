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
  numQuestions?: number;
  questionTypes?: string[];
  difficulty?: string;
}

async function extractTextFromPDF(filePath: string): Promise<string> {
  // For Next.js, we'll use pdf-parse or similar
  // For now, returning a placeholder - you'll need to install pdf-parse
  const pdfParse = require('pdf-parse');
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
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
  const numQuestions = metadata.numQuestions || 10;
  const questionTypes = metadata.questionTypes || ['problem-solving', 'conceptual', 'application'];
  const difficulty = metadata.difficulty || 'mixed';

  const questionTypeDesc = questionTypes.join(', ');

  const prompt = `
You are an expert ${subject} educator. Based on the following educational content, generate comprehensive questions with solutions.

Content:
${pdfText}

Please generate exactly ${numQuestions} high-quality ${subject} questions based on this content. 

Question Requirements:
- Question types: ${questionTypeDesc}
- Difficulty level: ${difficulty}
- Each question should be clear and well-formatted
- Provide detailed step-by-step solutions
- Use proper LaTeX notation for all mathematical expressions

Format your response ENTIRELY in LaTeX using this structure:

\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{geometry}
\\usepackage{enumitem}
\\geometry{margin=1in}

\\title{${subject.charAt(0).toUpperCase() + subject.slice(1)} Questions - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty}
\\author{AI Question Generator}
\\date{\\today}

\\begin{document}
\\maketitle

\\section*{Instructions}
This document contains ${numQuestions} ${subject} questions with detailed solutions. Question types include: ${questionTypeDesc}.

${Array.from({ length: numQuestions }, (_, i) => `
\\section*{Question ${i + 1}}
[Write a clear ${subject} question here with proper $\\LaTeX$ math notation]

\\subsection*{Solution}
[Provide a detailed step-by-step solution with explanations and $$equations$$]
`).join('\n')}

\\end{document}

IMPORTANT: 
- Use $...$ for inline math and $$...$$ or \\[...\\] for display math
- Make questions relevant to the provided content
- Ensure solutions are comprehensive and educational
- Use proper LaTeX formatting throughout
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
          numQuestions: parseInt(Array.isArray(fields.numQuestions) ? fields.numQuestions[0] : fields.numQuestions || '10'),
          questionTypes: Array.isArray(fields.questionTypes) 
            ? fields.questionTypes 
            : (fields.questionTypes ? [fields.questionTypes] : undefined),
          difficulty: Array.isArray(fields.difficulty) ? fields.difficulty[0] : fields.difficulty,
        };

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
        const latexContent = await generateQuestionsWithGemini(pdfText, metadata);

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
