import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as mammoth from "mammoth";
import { createWorker } from "tesseract.js";

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

    const pdfDocument = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
    }

    if (!fullText.trim()) {
      throw new Error(
        "No extractable text found. This might be a scanned image PDF."
      );
    }

    return fullText;
  } catch (error) {
    console.error("PDF extraction error:", error);

    if (error.name === "InvalidPDFException") {
      throw new Error("The PDF structure is invalid or the file is corrupted.");
    }

    throw new Error("Failed to extract text from PDF");
  }
};

export const extractTextFromDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
};

export const extractTextFromImage = async (file) => {
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(file);
    return text;
  } catch (error) {
    console.error("Image OCR error:", error);
    throw new Error("Failed to extract text from image");
  } finally {
    await worker.terminate();
  }
};

export const extractTextFromTxt = async (file) => {
  return await file.text();
};
