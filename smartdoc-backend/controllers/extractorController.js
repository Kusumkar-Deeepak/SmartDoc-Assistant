import { explainContent, analyzeDocument } from '../services/geminiExplain.js';

export const explainText = async (req, res) => {
  try {
    const { text, promptType, customPrompt } = req.body;
    
    const explanation = await explainContent({ text, promptType, customPrompt });
    res.json({ explanation });
    
  } catch (error) {
    console.error('AI Explanation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const explainDocument = async (req, res) => {
  try {
    const { fullText } = req.body;
    
    const analysis = await analyzeDocument(fullText);
    res.json({ analysis });
    
  } catch (error) {
    console.error('Document Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
};