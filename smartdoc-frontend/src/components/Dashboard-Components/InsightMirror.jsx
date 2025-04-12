import { useState, useRef, useEffect } from "react";
import API from "../../services/Api";
import {
  extractTextFromPDF,
  extractTextFromDocx,
  extractTextFromImage,
  extractTextFromTxt,
} from "../../services/clientTextExtractors";
import InsightVisualizations from "./InsightVisualizations";
import DocumentUpload from "./DocumentUpload";
import "./InsightVisualizations.css";

const InsightMirror = () => {
  const [documentText, setDocumentText] = useState("");
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const progressInterval = useRef(null);

  // Smooth progress animation
  useEffect(() => {
    if (isLoading) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 90%
          if (prev < 90) {
            return prev + Math.random() * 10;
          } else if (prev < 95) {
            return prev + Math.random() * 3;
          } else if (prev < 99) {
            return prev + 0.5;
          }
          return prev;
        });
      }, 300);

      return () => clearInterval(progressInterval.current);
    } else {
      clearInterval(progressInterval.current);
    }
  }, [isLoading]);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      let text = "";
      const fileType = file.type;

      // Update progress during extraction
      setProgress(10);
      if (fileType === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else if (
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        text = await extractTextFromDocx(file);
      } else if (fileType.startsWith("image/")) {
        text = await extractTextFromImage(file);
      } else if (fileType === "text/plain") {
        text = await extractTextFromTxt(file);
      } else {
        throw new Error("Unsupported file type");
      }
      setProgress(40); // Extraction complete

      setDocumentText(text);
      await analyzeDocument(text);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setProgress(0);
    }
  };

  const analyzeDocument = async (text) => {
    try {
      setProgress(50); // Analysis started
      const { data } = await API.post("/api/insight-mirror/analyze", { text });
      setProgress(90); // Analysis complete

      // Small delay for smooth completion
      await new Promise((resolve) => setTimeout(resolve, 300));
      setProgress(100);

      // Another small delay before showing results
      await new Promise((resolve) => setTimeout(resolve, 200));
      setInsights(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="insight-mirror-container">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
        📄 InsightMirror - Document Intelligence Engine
      </h1>

      <DocumentUpload
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
        progress={progress}
      />

      {error && <div className="error-message">{error}</div>}

      {isLoading && progress < 100 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <div className="progress-text">
            Analyzing document... {Math.round(progress)}%
          </div>
        </div>
      )}

      {insights && (
        <InsightVisualizations
          insights={insights}
          originalText={documentText}
        />
      )}
    </div>
  );
};

export default InsightMirror;
