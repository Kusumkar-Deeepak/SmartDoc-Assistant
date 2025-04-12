import express from 'express';
import { analyzeDocument } from '../controllers/insightMirrorController.js';

const router = express.Router();

router.post('/analyze', analyzeDocument);

export default router;