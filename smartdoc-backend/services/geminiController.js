import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const answerQuestion = async (documentText, question) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      SYSTEM INSTRUCTIONS:
      You are an expert document analyzer. Your task is to answer questions based EXCLUSIVELY on the provided document text.
      If the answer cannot be found in the document, respond with "The answer is not available in the provided document."
      
      DOCUMENT TEXT:
      ${documentText}
      
      QUESTION:
      ${question}
      
      Please provide a concise and accurate answer based on the document.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in answerQuestion:", error);
    throw error;
  }
};

export const generateQuestions = async (documentText, numQuestions) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      SYSTEM INSTRUCTIONS:
      You are an expert question generator. Your task is to create ${numQuestions} insightful questions that can be answered from the provided document text.
      The questions should cover different aspects of the document and vary in complexity.
      Return ONLY the questions as a numbered list, with each question on a new line.
      
      DOCUMENT TEXT:
      ${documentText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into an array of questions
    return text
      .split("\n")
      .map((q) => q.replace(/^\d+\.\s*/, "").trim())
      .filter((q) => q.length > 0);
  } catch (error) {
    console.error("Error in generateQuestions:", error);
    throw error;
  }
};
