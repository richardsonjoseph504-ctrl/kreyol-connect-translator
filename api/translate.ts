export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const { text, direction } = req.body || {};

    if (!text || !direction) {
      return res.status(400).json({ error: "Missing text or direction" });
    }

    const prompt =
      direction === "kreyol-to-english"
        ? `Translate this Haitian Creole text to natural English:\n\n${text}`
        : `Tradui tèks sa a an Kreyòl Ayisyen natirèl:\n\n${text}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const translatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({ translatedText });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
