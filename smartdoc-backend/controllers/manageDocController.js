import Document from "../models/Document.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Password hashing function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Password comparison function
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const getDocuments = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const documents = await Document.find({ userId: email });
    res.json(documents);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;

    if (!email) return res.status(400).json({ error: "Email required" });

    const doc = await Document.findOneAndDelete({ _id: id, userId: email });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    fs.unlinkSync(path.join(__dirname, "../uploads", doc.filename));
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.files?.length) {
      return res.status(400).json({ error: "Email and files required" });
    }

    const newDocs = await Promise.all(
      req.files.map((file) => {
        if (!file.mimetype) {
          throw new Error("File mimetype is required");
        }

        return Document.create({
          userId: email,
          originalname: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          protected: false,
          tags: [],
        });
      })
    );

    res.status(201).json(newDocs);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Error uploading documents",
    });
  }
};

export const viewDocument = async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;

    if (!email) return res.status(400).json({ error: "Email required" });

    const doc = await Document.findOne({ _id: id, userId: email });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.protected) {
      return res.status(403).json({ error: "Document is password protected" });
    }

    const filePath = path.join(__dirname, "../uploads", doc.filename);

    // For images and PDFs, send the file directly
    if (doc.mimetype.includes("image") || doc.mimetype.includes("pdf")) {
      res.sendFile(filePath);
    } else {
      // For other types, force download
      res.download(filePath, doc.originalname);
    }
  } catch (error) {
    console.error("View error:", error);
    res.status(500).json({ error: "Failed to view document" });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;

    if (!email) return res.status(400).json({ error: "Email required" });

    const doc = await Document.findOne({ _id: id, userId: email });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.protected) {
      return res.status(403).json({ error: "Document is password protected" });
    }

    const filePath = path.join(__dirname, "../uploads", doc.filename);
    res.download(filePath, doc.originalname);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download document" });
  }
};

export const tagDocuments = async (req, res) => {
  try {
    const { filenames } = req.body;
    const tags = filenames.map((filename) => {
      const keywords = filename.toLowerCase().split(/[_\-. ]+/);
      return keywords.slice(0, 3);
    });
    res.json(tags);
  } catch (error) {
    console.error("Tagging error:", error);
    res.status(500).json({ error: "Failed to generate tags" });
  }
};

export const protectDocument = async (req, res) => {
  try {
    const { email, protect, password } = req.body;
    const { id } = req.params;

    if (!email) return res.status(400).json({ error: "Email required" });
    if (protect && !password) {
      return res
        .status(400)
        .json({ error: "Password required when protecting" });
    }

    const doc = await Document.findOne({ _id: id, userId: email });
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const update = { protected: protect };

    if (protect) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    } else {
      update.password = undefined;
    }

    const updatedDoc = await Document.findOneAndUpdate(
      { _id: id, userId: email },
      update,
      { new: true }
    ).select("-password");

    res.json(updatedDoc);
  } catch (error) {
    console.error("Protection error:", error);
    res.status(500).json({ error: "Failed to update document protection" });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.params;

    if (!email) return res.status(400).json({ error: "Email required" });

    // Need to explicitly select the password field for verification
    const doc = await Document.findOne({ _id: id, userId: email }).select(
      "+password"
    );
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (!doc.protected) {
      return res.json({ valid: true });
    }

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    // Use the document method to compare passwords
    const valid = await doc.comparePassword(password);
    res.json({ valid });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Failed to verify password" });
  }
};
