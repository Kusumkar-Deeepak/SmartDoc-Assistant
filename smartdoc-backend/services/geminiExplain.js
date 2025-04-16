import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.3,
    topP: 0.8,
    topK: 40,
  },
});

const SYSTEM_INSTRUCTIONS = {
  EXPLAIN_SELECTION: `You are a Knowledge Explainer AI that transforms complex information into clear, accessible explanations.
  
  Rules:
  - Focus on simplifying concepts
  - Use analogies and examples
  - Keep language at 8th grade level
  - Length: 100-200 words
  - Format in clear paragraphs with markdown`,

  LEGAL_TRANSLATION: `You are a Legal Translator AI that converts complex legal language into plain English.
  
  Rules:
  - Replace legal jargon with everyday language
  - Explain implications clearly
  - Provide examples where helpful
  - Structure: Original -> Translation -> Implications
  - Length: 150-250 words`,

  SCIENTIFIC_EXPLANATION: `You are a Science Communicator AI that makes technical concepts accessible.
  
  Rules:
  - Break down complex terms
  - Explain processes step-by-step
  - Include real-world applications
  - Use analogies when helpful
  - Length: 150-250 words`,

  SUMMARY: `You are a Summary Specialist AI that extracts key information efficiently.
  
  Rules:
  - Identify main points only
  - Be concise but comprehensive
  - Use bullet points when helpful
  - Length: 50-150 words
  - Structure: Overview -> Key Points -> Conclusion`,

  CUSTOM: `You are an AI Assistant answering specific questions about provided content.
  
  Rules:
  - Directly address the question
  - Reference the provided text
  - Be precise and relevant
  - Length as appropriate for the question`,
};

export const analyzeDocument = async ({
  fullText,
  promptType,
  customPrompt,
}) => {
  if (!fullText || fullText.trim().length < 10) {
    return "[System Notice]: Please provide meaningful document content (10+ characters).";
  }

  try {
    const instruction =
      SYSTEM_INSTRUCTIONS[promptType] ||
      (customPrompt
        ? SYSTEM_INSTRUCTIONS.CUSTOM
        : SYSTEM_INSTRUCTIONS.EXPLAIN_SELECTION);

    const prompt = customPrompt
      ? `${customPrompt}\n\nDocument content:\n\n${fullText}\n\n${instruction}`
      : `${instruction}\n\nDocument content to analyze:\n\n${fullText}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Document Analysis Error:", error);
    return `[Error] Analysis failed: ${error.message}`;
  }
};
