export async function translateText(text: string, direction: "ht-en" | "en-ht") {
  const res = await fetch("/api/text-translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, direction }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Text translate failed");
  return data.result as string;
}