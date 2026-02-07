import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GLADIA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GLADIA_API_KEY" });
    }

    const { audio_url } = req.body;

    if (!audio_url) {
      return res.status(400).json({ error: "audio_url required" });
    }

    const response = await fetch("https://api.gladia.io/v2/transcription", {
      method: "POST",
      headers: {
        "x-gladia-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url,
        language: "ht",
        translation: true,
        translation_config: {
          target_languages: ["en"],
        },
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}export async function POST(req: Request) {
  try {
    const { text, direction } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text" }), { status: 400 });
    }

    const prompt =
      direction === "ht-en"
        ? `Translate this Haitian Creole to English:\n${text}`
        : `Translate this English to Haitian Creole:\n${text}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const translated =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ translated }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "API error" }), { status: 500 });
  }
}