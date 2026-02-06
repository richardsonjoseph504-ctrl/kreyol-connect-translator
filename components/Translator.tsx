import React, { useEffect, useRef, useState } from "react";

type Direction = "ht-en" | "en-ht";

export default function Translator() {
  const [direction, setDirection] = useState<Direction>("ht-en");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef<any>(null);
  const debounceRef = useRef<number | null>(null);

  // ---------- Auto translate (debounced) ----------
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    const text = input.trim();
    if (!text) {
      setOutput("");
      setError("");
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            direction,
            mode: "correct_and_translate",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "API error");
          setOutput("");
        } else {
          setOutput(data?.translated || "");
          setError("");
        }
      } catch {
        setError("Pa ka konekte ak API /api/translate");
        setOutput("");
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [input, direction]);

  // ---------- Speech recognition setup ----------
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      const spoken = e?.results?.[0]?.[0]?.transcript ?? "";
      if (spoken.trim()) setInput(spoken.trim());
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
  }, []);

  const startListening = (lang: "ht" | "en") => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Navigatè sa pa sipòte speech recognition.");
      return;
    }

    // 🔑 Kreyòl mic workaround: use fr-CA
    rec.lang = lang === "ht" ? "fr-CA" : "en-US";

    try {
      setListening(true);
      rec.start();
    } catch {}
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
  };

  const swap = () => {
    setDirection((d) => (d === "ht-en" ? "en-ht" : "ht-en"));
    setInput("");
    setOutput("");
    setError("");
    stopListening();
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setDirection("ht-en")} disabled={direction === "ht-en"}>
          Kreyòl → English
        </button>
        <button onClick={() => setDirection("en-ht")} disabled={direction === "en-ht"}>
          English → Kreyòl
        </button>
        <button onClick={swap}>🔁 Swap</button>

        <div style={{ width: 10 }} />

        <button onClick={() => startListening("ht")} disabled={listening}>
          🎤 Pale Kreyòl
        </button>
        <button onClick={() => startListening("en")} disabled={listening}>
          🎤 Speak English
        </button>
        <button onClick={stopListening} disabled={!listening}>
          ⛔ Stop
        </button>

        <span style={{ opacity: 0.8 }}>
          {loading ? "Tradui..." : listening ? "Listening..." : "Ready"}
        </span>
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "ht-en"
              ? "Ekri oswa pale an Kreyòl… (li tradui otomatik)"
              : "Type or speak in English… (auto translate)"
          }
          style={{ width: "100%", height: 140, padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={output}
          readOnly
          placeholder="Rezilta tradiksyon ap parèt otomatikman..."
          style={{ width: "100%", height: 140, padding: 10 }}
        />
        {error ? <div style={{ color: "crimson", marginTop: 6 }}>{error}</div> : null}
      </div>
    </div>
  );
}