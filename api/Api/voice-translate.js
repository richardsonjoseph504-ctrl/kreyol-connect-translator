async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.GLADIA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GLADIA_API_KEY" });

    const { audio_base64, mime = "audio/webm" } = req.body || {};
    if (!audio_base64) return res.status(400).json({ error: "audio_base64 required" });

    // base64 -> Buffer -> Blob
    const buffer = Buffer.from(audio_base64, "base64");
    const blob = new Blob([buffer], { type: mime });

    // 1) Upload to Gladia
    const uploadForm = new FormData();
    uploadForm.append("audio", blob, "speech.webm");

    const uploadRes = await fetch("https://api.gladia.io/v2/upload", {
      method: "POST",
      headers: { "x-gladia-key": apiKey },
      body: uploadForm,
    });

    const uploadJson = await uploadRes.json();
    const audio_url = uploadJson?.audio_url;
    if (!audio_url) {
      return res.status(502).json({ error: "Gladia upload failed", details: uploadJson });
    }

    // 2) Start transcription + translation
    const startRes = await fetch("https://api.gladia.io/v2/transcription", {
      method: "POST",
      headers: { "x-gladia-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        audio_url,
        language: "ht",
        translation: true,
        translation_config: { target_languages: ["en"] },
        punctuation_enhanced: true,
      }),
    });

    const startJson = await startRes.json();
    const id = startJson?.id;
    if (!id) return res.status(502).json({ error: "Gladia start failed", details: startJson });

    // 3) Poll result
    for (let i = 0; i < 20; i++) {
      await sleep(1000);

      const statusRes = await fetch(`https://api.gladia.io/v2/transcription/${id}`, {
        headers: { "x-gladia-key": apiKey },
      });

      const statusJson = await statusRes.json();

      if (statusJson?.status === "done") {
        const text_ht =
          statusJson?.result?.transcription?.full_transcript ??
          statusJson?.result?.transcription?.text ??
          "";

        const text_en =
          statusJson?.result?.translation?.[0]?.text ??
          statusJson?.result?.translations?.[0]?.text ??
          "";

        return res.status(200).json({ text_ht, text_en });
      }

      if (statusJson?.status === "error") {
        return res.status(502).json({ error: "Gladia error", details: statusJson });
      }
    }

    return res.status(504).json({ error: "Timeout waiting for Gladia" });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e?.message || e) });
  }
}