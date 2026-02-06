import { useEffect, useState } from "react";

export default function Translator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"ht-en" | "en-ht">("ht-en");
  const [status, setStatus] = useState("Ready");

  // 🔁 AUTO TRANSLATE lè w ap ekri
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    const t = setTimeout(async () => {
      setStatus("Translating...");
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, direction }),
      });
      const data = await res.json();
      setOutput(data.translated || "");
      setStatus("Ready");
    }, 600); // debounce

    return () => clearTimeout(t);
  }, [input, direction]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setDirection("ht-en")}>Kreyòl → English</button>
        <button onClick={() => setDirection("en-ht")}>English → Kreyòl</button>
      </div>

      <textarea
        placeholder="Ekri oswa pale..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", height: 120 }}
      />

      <textarea
        placeholder="Rezilta tradiksyon..."
        value={output}
        readOnly
        style={{ width: "100%", height: 120, marginTop: 10 }}
      />

      <div style={{ marginTop: 8 }}>{status}</div>

      {/* 🎤 Ou ka konekte bouton SpeechRecognition ou deja genyen yo isit */}
    </div>
  );
}