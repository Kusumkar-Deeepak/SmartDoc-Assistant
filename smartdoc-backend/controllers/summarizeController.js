import { generateSummary } from '../services/geminiService.js';

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    const summary = await generateSummary(text);
    res.json({ summary });
  } catch (error) {
    console.error('Error in summarization:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};