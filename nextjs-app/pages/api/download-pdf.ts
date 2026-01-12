import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let tempDir: string | null = null;

  try {
    const { latex } = req.body;

    if (!latex) {
      return res.status(400).json({ error: 'No LaTeX content provided' });
    }

    // Create temporary directory
    const tmpBaseDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpBaseDir)) {
      fs.mkdirSync(tmpBaseDir, { recursive: true });
    }

    tempDir = fs.mkdtempSync(path.join(tmpBaseDir, 'latex-'));

    // Write LaTeX content to file
    const texFile = path.join(tempDir, 'questions.tex');
    fs.writeFileSync(texFile, latex, 'utf-8');

    try {
      // Compile LaTeX to PDF using pdflatex
      await execPromise(
        `pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`,
        { timeout: 30000 }
      );

      const pdfFile = path.join(tempDir, 'questions.pdf');

      if (!fs.existsSync(pdfFile)) {
        // Check for errors in log file
        const logFile = path.join(tempDir, 'questions.log');
        let errorMsg = 'LaTeX compilation failed.';
        
        if (fs.existsSync(logFile)) {
          const logContent = fs.readFileSync(logFile, 'utf-8');
          const errorLines = logContent.split('\n').filter(line => line.startsWith('!'));
          if (errorLines.length > 0) {
            errorMsg = errorLines[0];
          }
        }
        
        throw new Error(errorMsg);
      }

      // Read PDF file
      const pdfData = fs.readFileSync(pdfFile);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `math_questions_${timestamp}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(pdfData);
    } catch (execError: any) {
      if (execError.code === 'ENOENT') {
        return res.status(500).json({
          error: 'PDF compilation not available. pdflatex is not installed. Please download the LaTeX file instead and compile it locally.',
        });
      }
      if (execError.killed) {
        return res.status(500).json({ error: 'PDF compilation timed out' });
      }
      throw execError;
    }
  } catch (error: any) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: `PDF generation failed: ${error.message}` 
    });
  } finally {
    // Clean up temporary directory
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
  }
}
