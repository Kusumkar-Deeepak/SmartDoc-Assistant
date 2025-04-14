import {
  answerQuestion,
  generateQuestions,
} from "../services/geminiController.js";

export const answerQuestionController = async (req, res) => {
  try {
    const { documentText, question } = req.body;
    const answer = await answerQuestion(documentText, question);
    res.json({ answer });
  } catch (error) {
    console.error("Error in /api/ask-question:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to process the question. Please try again.",
    });
  }
};

export const generateQuestionsController = async (req, res) => {
  try {
    const { documentText, numQuestions } = req.body;
    const questions = await generateQuestions(documentText, numQuestions);
    res.json({ questions });
  } catch (error) {
    console.error("Error in /api/generate-questions:", error);
    res.status(500).json({
      error: error.message,
      details: "Failed to generate questions. Please try again.",
    });
  }
};
