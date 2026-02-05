import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, direction } = req.body;

  if (!text || !direction) {
    return res.status(400).json({ error: 'Missing text or direction' });
  }

  try {
    const prompt =
      direction === 'ht-en'
        ? `Translate this Haitian Creole text to English:\n\n${text}`
        : `Translate this English text to Haitian Creole:\n\n${text}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const translated =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({ translated });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
}
