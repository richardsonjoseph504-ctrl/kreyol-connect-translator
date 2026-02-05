import React, { useEffect, useRef, useState } from "react";

type Direction = "ht-en" | "en-ht";

export default function Translator() {
  const [direction, setDirection] = useState<Direction>("ht-en");
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const recognitionRef = useRef<any>(null);
  const debounceRef = useRef<number | null>(null);
  const lastFinalRef = useRef<string>("");

  async function translateNow(text: string, dir: Direction) {
    const t = text.trim();
    if (!t) {
      setTranslated("");
      setErr("");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, direction: dir }),
      });

      const data = await res.json();

      if (!res.ok) {
        setTranslated("");
        setErr(data?.error || "Gen erè pandan tradiksyon an.");
      } else {
        setTranslated(data?.translated || "");
        setErr("");
      }
    } catch {
      setTranslated("");
      setErr("Pa ka konekte ak /api/translate.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ OTOMATIK: chak fwa input oswa direction chanje -> tradui
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      translateNow(input, direction);
    }, 450);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [input, direction]);

  // ✅ Setup SpeechRecognition (pale)
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e: any) => {
      let interim = "";
      let finals = lastFinalRef.current;

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finals = (finals + " " + chunk).trim();
        else interim += chunk;
      }

      lastFinalRef.current = finals;
      const combined = (finals + " " + interim).trim();
      if (combined) setInput(combined); // <- sa fè li trad
