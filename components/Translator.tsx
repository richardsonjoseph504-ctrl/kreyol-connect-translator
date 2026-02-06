import React, { useEffect, useRef, useState } from "react";

type Dir = "ht-en" | "en-ht";

export default function Translator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<Dir>("ht-en");
  const [status, setStatus] = useState<"Ready" | "Listening" | "Translating" | "Error">("Ready");
  const [errorMsg, setErrorMsg] = useState("");

  // 🎤 Speech recognition ref
  const recognitionRef = useRef<any>(null);

  const startListening = (lang: "ht" | "en") => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Error");
      setErrorMsg("Browser ou a pa sipòte SpeechRecognition. Eseye Chrome/Edge sou PC.");
      return;
    }

    // Kreye recognition si li pa egziste
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || "";
        setInput((prev) => (prev ? prev + " " : "") + transcript);
        setStatus("Ready");
      };

      recognitionRef.current.onerror = () => {
        setStatus("Error");
        setErrorMsg("Gen erè nan mikwo a. Verifye microphone permission.");
      };

      recognitionRef.current.onend = () => {
        // si li fini san rezilta
        if (status === "Listening") setStatus("Ready");
      };
    }

    // Lang: pa gen “ht-HT” ofisyèl. Nou mete fr-HT pou pran aksan Ayiti pi byen pase en-US
    recognitionRef.current.lang = lang === "ht" ? "fr-HT" : "en-US";
    setStatus("Listening");
    setErrorMsg("");
    recognitionRef.current.start();
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setStatus("Ready");
  };

  // 🔁 AUTO TRANSLATE (ekri + vwa)
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setErrorMsg("");
      setStatus("Ready");
      return;
    }

    const t = setTimeout(async () => {
      try {
        setStatus("Translating");
        setErrorMsg("");

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input, direction }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus("Error");
          setErrorMsg(data?.error || `API error (${res.status})`);
          setOutput("");
          return;
        }

        setOutput(data?.translated || "");
        setStatus("Ready");
      } catch (e: any) {
        setStatus("Error");
        setErrorMsg("Fetch pa pase. Verifye si /api/translate ap mache sou Vercel.");
        setOutput("");
      }
    }, 600);

    return () => clearTimeout(t);
  }, [input, direction]);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => setDirection("ht-en")}>Kreyòl → English</button>
        <button onClick={() => setDirection("en-ht")}>English → Kreyòl</button>

        <button onClick={() => startListening("ht")}>🎤 Pale Kreyòl</button>
        <button onClick={() => startListening("en")}>🎤 Speak English</button>
        <button onClick={stopListening} disabled={status !== "Listening"}>
          ⛔ Stop
        </button>

        <div style={{ marginLeft: 10 }}>
          <b>{status === "Translating" ? "Translating..." : status}</b>
        </div>
      </div>

      <textarea
        placeholder="Ekri oswa pale..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", height: 130, padding: 10 }}
      />

      <textarea
        placeholder="Rezilta tradiksyon..."
        value={output}
        readOnly
        style={{ width: "100%", height: 130, padding: 10, marginTop: 10 }}
      />

      {status === "Error" && (
        <div style={{ marginTop: 8 }}>
          <b style={{ color: "red" }}>{errorMsg}</b>
        </div>
      )}
    </div>
  );
}