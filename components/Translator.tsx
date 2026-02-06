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

  // ===== AI CALL (correction + translation) =====
  const aiProcess = async (rawText: string, dir: Direction) => {
    const text = rawText.trim();
    if (!text) {
      setOutput("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          direction: dir,
          // 🔑 signal backend to CORRECT + TRANSLATE
          mode: "correct_and_translate",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "AI error");
        setOutput("");
      } else {
        setOutput(data.translated || "");
      }
    } catch {
      setError("Pa ka konekte ak AI.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  // ===== AUTO TRANSLATE (typing OR speech) =====
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      aiProcess(input, direction);
    }, 700);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [input, direction]);

  // ===== SPEECH RECOGNITION =====
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();

    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      const spoken = e.results[0][0].transcript;
      setInput(spoken);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
  }, []);

  const startListening = (lang: "ht" | "en") => {
    const rec = recognitionRef.current;
    if (!rec) return;

    // 🔑 Trick: use French mic for Kreyòl
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
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={swap}>
          {direction === "ht-en" ? "Kreyòl → English" : "English → Kreyòl"}
        </button>

        <button onClick={() => startListening("ht")} disabled={listening}>
          🎤 Pale Kreyòl
        </button>

        <button onClick={() => startListening("en")} disabled={listening}>
          🎤 Speak English
        </button>

        <button onClick={stopListening} disabled={!listening}>
          ⛔ Stop
        </button>

        <span style={{ opacity: 0.75 }}>
          {loading ? "AI ap travay..." : listening ? "Listening..." : "Idle"}
        </span>
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === "ht-en"
              ? "Pale oswa ekri an Kreyòl (AI ap korije + tradui)"
              : "Speak or type English (AI auto translate)"
          }
          style={{ width: "100%", height: 140, padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={output}
          readOnly
          placeholder="Rezilta tradiksyon AI..."
          style={{ width: "100%", height: 140, padding: 10 }}
        />
        {error && <div style={{ color: "crimson", marginTop: 6 }}>{error}</div>}
      </div>
    </div>
  );
}