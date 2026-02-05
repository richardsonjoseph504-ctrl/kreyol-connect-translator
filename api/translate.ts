import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const { text, direction } = req.body;

    if (!text || !direction) {
      return res.status(400).json({ error: 'Missing text or direction' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt =
      direction === 'ht-en'
        ? `Translate this Haitian Creole to English:\n${text}`
        : `Translate this English to Haitian Creole:\n${text}`;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    return res.status(200).json({ translation: output });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
