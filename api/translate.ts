import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }export async function translateText(text: string, direction: "ht-en" | "en-ht") {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, direction }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Translation error");
  return data.output as string;
}
const [direction, setDirection] = useState<"ht-en" | "en-ht">("ht-en");
import { translateText } from "../services/geminiService";
const output = await translateText(sourceText, direction);
setTranslatedText(output);
<button
  onClick={() => setDirection((d) => (d === "ht-en" ? "en-ht" : "ht-en"))}
  style={{ padding: "8px 12px", borderRadius: 8 }}
>
  Swap (Kreyòl ↔ English)
</button>


  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { text, direction } = (req.body || {}) as {
      text?: string;
      direction?: "ht-en" | "en-ht";
    };

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing text" });
    }

    const dir = direction === "en-ht" ? "en-ht" : "ht-en"; // default ht-en

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      dir === "en-ht"
        ? `Translate to Haitian Creole (Kreyòl Ayisyen). Return ONLY the translation, no quotes:\n\n${text}`
        : `Translate to English. Return ONLY the translation, no quotes:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const output = result.response.text()?.trim() || "";

    return res.status(200).json({ output });
  } catch (err: any) {
    return res.status(500).json({
      error: "Translation failed",
      details: err?.message || String(err),
    });
  }
}
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { text, direction } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      direction === "en-ht"
        ? `Translate to Haitian Creole: ${text}`
        : `Translate to English: ${text}`;

    const result = await model.generateContent(prompt);

    return res.status(200).json({
      output: result.response.text(),
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || "Server error",
    });
  }
}
