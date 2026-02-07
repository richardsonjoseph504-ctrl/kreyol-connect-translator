import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const { text, direction } = req.body || {};
    if (!text || !direction) return res.status(400).json({ error: "text and direction required" });

    const system =
      direction === "ht-en"
        ? "Translate Haitian Creole to natural English. Return only the translation."
        : "Translate English to Haitian Creole. Return only the translation.";

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: String(text) },
        ],
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: "OpenAI failed", details: data });

    const result = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return res.status(200).json({ result });
  } catch (e: any) {
    return res.status(500).json({ error: "Server error", details: String(e?.message ?? e) });
  }
}