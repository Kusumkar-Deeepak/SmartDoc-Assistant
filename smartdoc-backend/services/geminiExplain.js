import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.3, // Lower temperature for more focused responses
    topP: 0.8,
    topK: 40,
  },
});

// Enhanced system instructions with strict formatting rules
const SYSTEM_INSTRUCTIONS = {
  EXPLAIN_SELECTION: `You are a Knowledge Explainer AI that transforms complex information into clear, accessible explanations.
  
  Response Format Rules:
  1. ALWAYS begin with "### Explanation:" header
  2. First paragraph: Core concept in simple terms (1-2 sentences)
  3. Second paragraph: Key details (bullet points if helpful)
  4. Third paragraph: Practical example/analogy (if applicable)
  5. Use markdown formatting (## headers, **bold**, bullets)
  6. Language level: 8th grade readability
  7. Length: 50-100 words max

  Content Rules:
  1. Never invent information - say "I cannot determine" if unsure
  2. For empty/undefined input: "Please provide text to analyze"
  3. Highlight connections to real-world applications
  4. Use comparisons to familiar concepts
  5. Maintain absolute technical accuracy`,

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
     [Main takeaway]

  2. Length: 150-200 words max
  3. Use markdown formatting consistently
  4. Maintain professional but accessible tone

  Content Rules:
  1. Identify 3-5 core themes maximum
  2. Select only the most impactful terms to define
  3. Note any ambiguous passages
  4. Never add information not in the source
  5. For empty input: "No document content found to analyze"`,

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
     [Practical scenario]

  2. Length: 100-150 words max
  3. Use bold for important warnings (**Note:**)
  4. Number lists for procedural items

  Content Rules:
  1. Preserve all legal meaning exactly
  2. Explain Latin terms in parentheses
  3. Highlight obligations with ⚖️ emoji
  4. For contracts: Note party responsibilities
  5. Empty input response: "No legal text provided"`,

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
     [Practical application]

  2. Use analogies with "Think of it like..."
  3. Technical terms in italics with definitions
  4. Length: 120-180 words
  5. Include 🔬 emoji for key principles

  Content Rules:
  1. Never oversimplify to the point of inaccuracy
  2. Cite field of study (e.g., "In chemistry...")
  3. Note current research if relevant
  4. Empty input response: "No scientific content provided"`,

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
     [If applicable]

  2. Length: 50-80 words
  3. Use → arrow for sequential steps
  4. Bold the most critical point
  5. Include 📌 emoji for important notes

  Content Rules:
  1. Never exceed 5 key points
  2. Omit examples unless crucial
  3. Maintain original emphasis
  4. Empty input response: "No content to summarize"`,
};

export const explainContent = async ({
  text,
  promptType = "EXPLAIN_SELECTION",
  customPrompt,
}) => {
  try {
    // Validate input
    if (!text || text.trim() === "" || text === "undefined") {
      return `[System Notice]: Please provide valid content to analyze. 
              ${
                promptType === "EXPLAIN_DOCUMENT"
                  ? "Upload a complete document."
                  : "Select text for explanation."
              }`;
    }

    const instruction =
      SYSTEM_INSTRUCTIONS[promptType] || SYSTEM_INSTRUCTIONS.EXPLAIN_SELECTION;
    const prompt = customPrompt
      ? `${customPrompt}:\n\n"${text}"\n\nFollow the format rules above.`
      : `${instruction}\n\nContent to analyze:\n\n${text}`;

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [
          {
            text: instruction,
          },
        ],
      },
    });

    const response = await result.response;
    const output = response.text();

    // Post-processing cleanup
    return output
      .replace(/^\s*```markdown\s*|\s*```\s*$/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
};

// Enhanced document analysis with page segmentation
export const analyzeDocument = async (fullText) => {
  if (!fullText || fullText.length < 10) {
    return "### Document Analysis\n\n[Error] Document content too short or empty. Please upload a complete document.";
  }

  try {
    // For large documents, analyze in sections
    const chunkSize = 10000;
    const chunks = [];

    for (let i = 0; i < fullText.length; i += chunkSize) {
      chunks.push(fullText.substring(i, i + chunkSize));
    }

    const analyses = await Promise.all(
      chunks.map((chunk) =>
        explainContent({
          text: chunk,
          promptType: "EXPLAIN_DOCUMENT",
        })
      )
    );

    return `### Comprehensive Document Analysis\n\n${analyses.join(
      "\n\n---\n\n"
    )}\n\n[End of Analysis]`;
  } catch (error) {
    console.error("Document Analysis Error:", error);
    return "### Document Analysis\n\n[Error] Could not process document. Please try a shorter document or different format.";
  }
};
