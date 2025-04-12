import { getDocumentInsights } from '../services/geminiInsight.js';

export const analyzeDocument = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided for analysis' });
    }

    const insights = await getDocumentInsights(text);
    res.json(insights);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
};