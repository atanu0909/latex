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
    const { latex, includeSolutions = true } = req.body;

    if (!latex) {
      return res.status(400).json({ error: 'No LaTeX content provided' });
    }

    // Process LaTeX to remove solutions if needed
    let processedLatex = latex;
    if (!includeSolutions) {
      // Remove solution sections - handle multiple patterns
      // Pattern 1: \subsection*{Solution} followed by content until next question or end
      processedLatex = processedLatex.replace(/\\subsection\*\{Solution\}[\s\S]*?(?=\\subsection\*\{Question \d+|\s*\\end\{document\})/g, '');
      
      // Pattern 2: \textbf{Solution} format
      processedLatex = processedLatex.replace(/\\textbf\{Solution[:\.]?\}[\s\S]*?(?=\\subsection\*\{Question \d+|\s*\\textbf\{Question|\s*\\end\{document\})/g, '');
      
      // Clean up multiple consecutive \vspace commands
      processedLatex = processedLatex.replace(/(?:\\vspace\{[^}]*\}\s*)+/g, '\\vspace{0.5cm}\n');
      
      // Remove trailing vspace before \end{document}
      processedLatex = processedLatex.replace(/\\vspace\{[^}]*\}\s*\\end\{document\}/g, '\\end{document}');
    }

    // Create temporary directory
    const tmpBaseDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpBaseDir)) {
      fs.mkdirSync(tmpBaseDir, { recursive: true });
    }

    tempDir = fs.mkdtempSync(path.join(tmpBaseDir, 'latex-'));

    // Write LaTeX content to file
    const texFile = path.join(tempDir, 'questions.tex');
    fs.writeFileSync(texFile, processedLatex, 'utf-8');

    // Validate LaTeX structure
    const hasDocumentClass = processedLatex.includes('\\documentclass');
    const hasBeginDocument = processedLatex.includes('\\begin{document}');
    const hasEndDocument = processedLatex.includes('\\end{document}');
    
    if (!hasDocumentClass || !hasBeginDocument || !hasEndDocument) {
      throw new Error('Invalid LaTeX structure: missing documentclass or document environment');
    }

    try {
      // Compile LaTeX to PDF using pdflatex
      // Note: pdflatex may return non-zero exit code for warnings, so we check if PDF exists
      try {
        await execPromise(
          `pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`,
          { timeout: 30000 }
        );
      } catch (execError: any) {
        // pdflatex may exit with error code even if PDF is created (due to warnings)
        // We'll check if the PDF exists below
        console.log('pdflatex completed with warnings/errors:', execError.message);
      }

      const pdfFile = path.join(tempDir, 'questions.pdf');

      if (!fs.existsSync(pdfFile)) {
        // Check for errors in log file
        const logFile = path.join(tempDir, 'questions.log');
        let errorMsg = 'LaTeX compilation failed.';
        let detailedError = '';
        
        if (fs.existsSync(logFile)) {
          const logContent = fs.readFileSync(logFile, 'utf-8');
          const errorLines = logContent.split('\n').filter(line => line.startsWith('!') || line.includes('Error'));
          if (errorLines.length > 0) {
            errorMsg = errorLines.slice(0, 3).join(' | ');
            detailedError = errorLines.join('\n');
          }
        }
        
        // Save the problematic LaTeX file for debugging
        const debugFile = path.join(tmpBaseDir, 'debug-failed.tex');
        fs.writeFileSync(debugFile, processedLatex, 'utf-8');
        console.error('LaTeX compilation failed. Debug file saved to:', debugFile);
        console.error('Detailed error:', detailedError);
        
        throw new Error(`${errorMsg}. Debug LaTeX saved to: ${debugFile}`);
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
