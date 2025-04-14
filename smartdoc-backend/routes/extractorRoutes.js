// routes/extractorRoutes.js
import express from "express";
import { explainContent } from "../controllers/extractorController.js";

const router = express.Router();

router.post("/explain", explainContent);

export default router;
