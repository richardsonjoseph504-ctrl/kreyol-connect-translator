export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, direction } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        { status: 400 }
      );
    }

    // TEMPORAIRE: mock translation
    // (n ap branche Gemini / OpenAI APRÈ build la fin pase)
    const translated =
      direction === "ht-en"
        ? "Translated to English (test)"
        : "Tradui an Kreyòl (test)";

    return new Response(
      JSON.stringify({ translated }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
