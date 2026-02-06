export async function POST(req: Request) {
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