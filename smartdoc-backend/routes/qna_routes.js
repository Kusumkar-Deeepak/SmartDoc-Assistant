import express from "express";
const router = express.Router();
import {
  answerQuestionController,
  generateQuestionsController,
} from "../controllers/qna_controller.js";

// POST /api/ai-qna/ask-question
router.post("/ask-question", answerQuestionController);

// POST /api/ai-qna/generate-questions
router.post("/generate-questions", generateQuestionsController);

export default router;
