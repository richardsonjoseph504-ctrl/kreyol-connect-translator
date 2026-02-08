function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const s = String(reader.result || "");
      resolve(s.split(",")[1] || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function translateVoice(audioBlob: Blob) {
  const audio_base64 = await blobToBase64(audioBlob);

  const res = await fetch("/api/voice-translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio_base64, mime: audioBlob.type || "audio/webm" }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Voice translate failed");
  return data as { text_ht: string; text_en: string };
}