import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config";

let genAI = null;
let model = null;

export const initGemini = async () => {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your-actual-api-key-here") {
      console.log("⚠️ Please add your Gemini API key to config.js");
      return false;
    }

    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    console.log("✅ Gemini AI initialized");
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
    return false;
  }
};

export const detectScamWithGemini = async (messageText, scamType) => {
  if (!model) {
    throw new Error("Gemini not initialized. Call initGemini first.");
  }

  const prompt = `You are a scam detection AI for "The Trust Architect" system. Analyze the following message and return ONLY valid JSON (no markdown, no extra text).

Message: "${messageText}"
Scam context: ${scamType === "whatsapp" ? "WhatsApp message" : scamType === "fake_call" ? "Phone call transcript" : "Payment request"}

Return JSON in this exact format:
{
  "isScam": boolean,
  "risk": "HIGH" or "MEDIUM" or "LOW",
  "tactics": ["tactic1", "tactic2"],
  "confidence": number between 0 and 1,
  "explanation": "brief explanation of why this is or isn't a scam"
}

Possible tactics: urgency, impersonation, financial_pressure, isolation, authority_impersonation, unusual_pattern`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanText);

    return {
      success: true,
      isScam: parsed.isScam,
      risk: parsed.risk,
      tactics: parsed.tactics,
      confidence: parsed.confidence,
      explanation: parsed.explanation,
      action: parsed.isScam ? "trigger_friction" : "allow",
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      success: false,
      error: error.message,
      isScam: false,
      action: "allow",
    };
  }
};

export const testGeminiConnection = async () => {
  try {
    if (!model) await initGemini();
    const result = await model.generateContent("Reply with only: OK");
    await result.response;
    return true;
  } catch (error) {
    console.error("Gemini test failed:", error);
    return false;
  }
};
