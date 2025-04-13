import express from "express";
import {
  getDocuments,
  deleteDocument,
  uploadDocuments,
  downloadDocument,
  viewDocument,
  tagDocuments,
  protectDocument,
  verifyDocument,
} from "../controllers/manageDocController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getDocuments);
router.post("/upload", upload.array("documents"), uploadDocuments);
router.delete("/:id", deleteDocument);
router.get("/:id/download", downloadDocument);
router.get("/:id/view", viewDocument);
router.post("/tag-documents", tagDocuments);
router.patch("/:id/protect", protectDocument); // Changed to PATCH
router.post("/:id/verify", verifyDocument);

export default router;
