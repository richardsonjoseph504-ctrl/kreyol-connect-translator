import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_KEY = process.env.GEMINI_API_KEY;

// Gemini 3 Flash (REST)
model: "models/gemini-1.5-flash"
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function extractText(json: any): string {
  // defensive parsing
  const candidates = json?.candidates;
  if (!Array.isArray(candidates) || !candidates.length) return "";
  const parts = candidates[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((p: any) => p?.text || "").join("").trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  if (!API_KEY) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

  const { text, direction, mode } = req.body || {};
  if (!text || typeof text !== "string") return res.status(400).json({ error: "Missing text" });

  const dir = direction === "en-ht" ? "en-ht" : "ht-en";

  // 🔑 Prompt: correct speech + translate
  const system = `
You are a Haitian Creole and English expert translator.

TASK:
- If input looks like speech-to-text mistakes (often French-looking text when user spoke Haitian Creole), first rewrite it into clean Haitian Creole.
- Then translate according to direction.

RULES:
- Output ONLY the final translation (no explanations, no quotes).
- Keep meaning, names, tone.
`;

  const user = `
DIRECTION: ${dir === "ht-en" ? "Haitian Creole -> English" : "English -> Haitian Creole"}
MODE: ${mode || "correct_and_translate"}

INPUT:
${text}
`;

  try {
    const resp = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        },
      }),
    });

    const json = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({
        error: json?.error?.message || "Gemini API error",
        details: json,
      });
    }

    const translated = extractText(json);
    return res.status(200).json({ translated });
  } catch (e: any) {
    return res.status(500).json({ error: "Server error", details: String(e?.message || e) });
  }
}