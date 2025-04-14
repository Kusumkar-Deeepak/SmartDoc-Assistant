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
  
  Response Format Rules:
  1. ALWAYS begin with "### Explanation:" header
  2. First paragraph: Core concept in simple terms (1-2 sentences)
  3. Second paragraph: Key details (bullet points if helpful)
  4. Third paragraph: Practical example/analogy (if applicable)
  5. Use markdown formatting (## headers, **bold**, bullets)
  6. Language level: 8th grade readability
  7. Length: 50-100 words max`,

  EXPLAIN_DOCUMENT: `You are a Professional Document Analyst that provides comprehensive yet concise overviews.

  Response Format Rules:
  1. ALWAYS use this structure:
     ### Document Analysis
     #### Overview
     [2-3 sentence summary]
     
     #### Key Themes
     - Theme 1
     - Theme 2
     - Theme 3
     
     #### Important Terms
     • Term1: Definition
     • Term2: Definition
     
     #### Conclusion
     [Main takeaway]`,

  LEGAL_TRANSLATION: `You are a Legal Translator AI that converts complex legal language into plain English.

  Response Format Rules:
  1. ALWAYS structure as:
     ### Legal Translation
     #### Original Meaning
     [Brief summary]
     
     #### Plain Language Version
     [Rewritten text]
     
     #### Key Implications
     - Effect 1
     - Effect 2
     
     #### Examples
     [Practical scenario]`,

  SCIENTIFIC_EXPLANATION: `You are a Science Communicator AI that makes technical concepts accessible.

  Response Format Rules:
  1. Required structure:
     ### Scientific Explanation
     #### Concept
     [Simple definition]
     
     #### How It Works
     [Process description]
     
     #### Why It Matters
     [Significance]
     
     #### Real-World Example
     [Practical application]`,

  SUMMARY: `You are a Summary Specialist AI that extracts key information efficiently.

  Response Format Rules:
  1. ALWAYS format as:
     ### Summary
     #### Core Message
     [1 sentence]
     
     #### Key Points
     - Point 1
     - Point 2
     - Point 3
     
     #### Action Items
     [If applicable]`,
};

const generateResponse = async (content, promptType, customPrompt = "") => {
  const instruction =
    SYSTEM_INSTRUCTIONS[promptType] || SYSTEM_INSTRUCTIONS.EXPLAIN_SELECTION;
  const prompt = customPrompt
    ? `${customPrompt}:\n\n"${content}"\n\nFollow the format rules above.\n\n${instruction}`
    : `${instruction}\n\nContent to analyze:\n\n${content}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  return response
    .text()
    .replace(/^\s*```markdown\s*|\s*```\s*$/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const explainSelection = async ({ text, promptType, customPrompt }) => {
  if (!text || text.trim().length < 3) {
    return "[System Notice]: Please select meaningful text (3+ characters) to explain.";
  }
  return generateResponse(text, promptType, customPrompt);
};

export const analyzeDocument = async (
  fullText,
  promptType = "EXPLAIN_DOCUMENT"
) => {
  if (!fullText || fullText.trim().length < 10) {
    return "### Document Analysis\n\n[Error] Document content too short or empty.";
  }

  try {
    const chunkSize = 10000;
    const chunks = [];

    for (let i = 0; i < fullText.length; i += chunkSize) {
      chunks.push(fullText.substring(i, i + chunkSize));
    }

    const analyses = await Promise.all(
      chunks.map((chunk) => generateResponse(chunk, promptType))
    );

    return `### Comprehensive ${promptType.replace(
      "_",
      " "
    )}\n\n${analyses.join("\n\n---\n\n")}\n\n[End of Analysis]`;
  } catch (error) {
    console.error("Document Analysis Error:", error);
    throw new Error(`Document analysis failed: ${error.message}`);
  }
};
