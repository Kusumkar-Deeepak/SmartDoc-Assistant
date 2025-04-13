import express from "express";
import {
  explainText,
  explainDocument,
} from "../controllers/extractorController.js";

const router = express.Router();

router.post("/explain", explainText);
router.post("/analyze-document", explainDocument);

export default router;
