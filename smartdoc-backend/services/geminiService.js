import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
You are an expert document summarizer. Your task is to analyze the given text and produce a concise, coherent summary that captures the key points and main ideas.

Guidelines:
1. Maintain the original meaning and intent
2. Focus on the most important information
3. Keep the summary about 20-30% of the original length
4. Use clear, concise language
5. Preserve critical facts, figures, and names
6. Maintain logical flow and coherence
7. Remove redundant information and examples
8. Keep technical terms when necessary

Output only the summary text, without any additional commentary or labels.
`;

export const generateSummary = async (text) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction,
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate summary");
  }
};
