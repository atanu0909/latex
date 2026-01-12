import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { latex } = req.body;

    if (!latex) {
      return res.status(400).json({ error: 'No LaTeX content provided' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `math_questions_${timestamp}.tex`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(latex);
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
