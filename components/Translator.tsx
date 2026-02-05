import React, { useEffect, useRef, useState } from "react";

type Lang = "ht" | "en";

export default function Translator() {
  // ✅ Hooks yo OBLIJE anndan component la
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  const [input, setInput] = useState("");
  const [lang, setLang] = useState<Lang>("ht");

  useEffect(() => {
    // optional: netwaye recognition lè component la demonte
    return () => {
      try {
        if (recognitionRef.current) recognitionRef.current.stop();
      } catch {}
    };
  }, []);

  const startListening = (nextLang: Lang) => {
    setLang(nextLang);

    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SR) {
      alert("Browser sa pa sipòte Speech Recognition. Eseye Google Chrome.");
      return;
    }

    // Kreye recognition a sèlman lè w ap itilize li
    const recognition = new SR();
    recognitionRef.current = recognition;

    recognition.lang = nextLang === "ht" ? "ht-HT" : "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript.trim());
    };

    recognition.start();
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
        Translator
      </h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => startListening("ht")}>🎤 Pale Kreyòl</button>
        <button onClick={() => startListening("en")}>🎤 Speak English</button>
        <button onClick={stopListening} disabled={!listening}>
          ⏹ Stop
        </button>

        <span style={{ marginLeft: 10 }}>
          {listening ? "🟢 Listening..." : "⚪ Not listening"}
        </span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={lang === "ht" ? "Ekri oswa pale an kreyòl..." : "Type or speak in English..."}
        style={{ width: "100%", minHeight: 160, padding: 12 }}
      />
    </div>
  );
}
