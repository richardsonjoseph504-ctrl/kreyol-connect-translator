
import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData } from "../utils/audio";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function translateKreyolToEnglish(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following Haitian Creole (Kreyol) text to English accurately: "${text}"`,
      config: {
        systemInstruction: "You are a professional translator specializing in Haitian Creole to English. Provide clean, natural translations. Only return the translated text without extra commentary.",
        temperature: 0.3,
      },
    });
    
    return response.text?.trim() || "Translation failed.";
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw new Error("Failed to translate text.");
  }
}

export async function speakEnglishText(text: string): Promise<void> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly in a professional tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional male-leaning voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();
  } catch (error) {
    console.error("Gemini TTS Error:", error);
  }
}
