import express from "express";
import { generateReport, editReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReport);
router.post("/edit", editReport);

export default router;