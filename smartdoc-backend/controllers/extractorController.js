// controllers/extractorController.js
import {
  explainSelection,
  analyzeDocument,
} from "../services/geminiExplain.js";

export const explainContent = async (req, res) => {
  try {
    const { text, fullText, promptType, customPrompt } = req.body;

    if (!text && !fullText) {
      return res.status(400).json({
        error: "Please provide either selected text or full document content",
      });
    }

    if (text) {
      if (text.trim().length < 3) {
        return res.status(400).json({
          error: "Selected text must be at least 3 characters long",
        });
      }
      const explanation = await explainSelection({
        text,
        promptType: promptType || "EXPLAIN_SELECTION",
        customPrompt,
      });
      return res.json({ explanation });
    }

    if (fullText) {
      if (fullText.trim().length < 10) {
        return res.status(400).json({
          error: "Document content too short (minimum 10 characters required)",
        });
      }
      const analysis = await analyzeDocument(fullText);
      return res.json({ analysis });
    }
  } catch (error) {
    console.error("AI Processing Error:", error);
    res.status(500).json({
      error: "Failed to process content",
      details: error.message,
    });
  }
};
