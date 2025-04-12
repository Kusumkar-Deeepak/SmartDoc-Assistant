import express from 'express';
const router = express.Router();
import { answerQuestionController, generateQuestionsController } from '../controllers/qna_controller.js';

router.post('/ask-question', answerQuestionController);

router.post('/generate-questions', generateQuestionsController);

export default router;
