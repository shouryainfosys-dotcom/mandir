import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
// According to guidelines, use the named parameter and process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDivineThought = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a short divine, spiritual Hindi quote (Suvichar) for a temple website. Only the text.',
      config: {
        systemInstruction: 'You are a spiritual guide for a temple. Provide a short, uplifting one-sentence Hindi suvichar.'
      }
    });
    // Access the .text property directly instead of calling it as a method.
    return response.text || "ईश्वर में विश्वास ही शक्ति का स्रोत है।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "ईश्वर में विश्वास ही शक्ति का स्रोत है।";
  }
};