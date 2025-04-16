// controllers/extractorController.js
import { analyzeDocument } from "../services/geminiExplain.js";

export const explainContent = async (req, res) => {
  try {
    const { fullText, promptType, customPrompt } = req.body;

    if (!fullText) {
      return res.status(400).json({
        error: "Please provide document content",
      });
    }

    if (fullText.trim().length < 10) {
      return res.status(400).json({
        error: "Document content too short (minimum 10 characters required)",
      });
    }

    const analysis = await analyzeDocument({
      fullText,
      promptType: promptType || "EXPLAIN_SELECTION",
      customPrompt,
    });

    return res.json({ analysis });
  } catch (error) {
    console.error("AI Processing Error:", error);
    res.status(500).json({
      error: "Failed to process content",
      details: error.message,
    });
  }
};
