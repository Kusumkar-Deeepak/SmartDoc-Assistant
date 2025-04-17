import {
  FiUpload,
  FiZoomIn,
  FiZoomOut,
  FiSearch,
  FiCopy,
  FiMessageSquare,
} from "react-icons/fi";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  extractTextFromPDF,
  extractTextFromDocx,
  extractTextFromImage,
  extractTextFromTxt,
} from "../../services/clientTextExtractors";
import { toast } from "react-toastify";
import AIExplanation from "./AIExplanation";

const CHUNK_SIZE = 5000; // Characters per page

const UploadExtract = () => {
  // State management
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [textChunks, setTextChunks] = useState([]);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState("");

  // Refs
  const textContainerRef = useRef(null);
  const contentContainerRef = useRef(null);

  // Helper functions
  const formatText = (text) => {
    if (!text) return "";

    return text
      .split("\n")
      .map((line) => {
        const leadingWhitespace = line.match(/^\s*/)[0];
        const content = line.trim();

        if (/^\d+\./.test(content)) return `${leadingWhitespace}${content}`;
        if (/^[-•*]/.test(content)) return `${leadingWhitespace}${content}`;
        if (line.includes("  ") && line.trim().split(/\s{2,}/).length > 2) {
          return line.replace(/\s{2,}/g, "    ");
        }

        return line;
      })
      .join("\n");
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Event handlers
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(extractedText)
      .then(() => {
        setIsTextCopied(true);
        toast.success("Text copied to clipboard!");
        setTimeout(() => setIsTextCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy text");
      });
  };

  // File processing
  const processFile = async (file) => {
    if (!file) return;
    setError("");

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported file type");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return false;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setExtractedText("");
    setSearchTerm("");
    setZoomLevel(100);

    try {
      let text;
      switch (file.type) {
        case "application/pdf":
          text = await extractTextFromPDF(file);
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          text = await extractTextFromDocx(file);
          break;
        case "image/jpeg":
        case "image/png":
          text = await extractTextFromImage(file);
          break;
        case "text/plain":
          text = await extractTextFromTxt(file);
          break;
        default:
          throw new Error("Unsupported file type");
      }

      setExtractedText(text);
      toast.success("Text extracted successfully!");
      return true;
    } catch (error) {
      console.error("Extraction error:", error);
      setError(
        `${file.name} is damaged or cannot be opened. Please try a different file.`
      );
      toast.error(error.message || "Failed to extract text");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e) => {
    await processFile(e.target.files[0]);
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(async (acceptedFiles) => {
      if (acceptedFiles?.length > 0) await processFile(acceptedFiles[0]);
    }, []),
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  // Effects
  useEffect(() => {
    const container = textContainerRef.current;
    if (container) {
      container.addEventListener("mouseup", handleTextSelection);
      return () =>
        container.removeEventListener("mouseup", handleTextSelection);
    }
  }, [handleTextSelection]);

  useEffect(() => {
    if (extractedText) {
      const formattedText = formatText(extractedText);
      const chunks = [];
      for (let i = 0; i < formattedText.length; i += CHUNK_SIZE) {
        chunks.push(formattedText.substring(i, i + CHUNK_SIZE));
      }
      setTextChunks(chunks);
      setCurrentPage(1);
    }
  }, [extractedText]);

  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Render functions
  const highlightText = (text) => {
    if (!text) return null;

    return text.split(/\n\s*\n/).map((section, i) => {
      if (/^#\s/.test(section)) {
        return (
          <h1 key={i} className="document-title">
            {section.replace(/^#\s/, "")}
          </h1>
        );
      } else if (/^##\s/.test(section)) {
        return (
          <h2 key={i} className="document-section">
            {section.replace(/^##\s/, "")}
          </h2>
        );
      } else if (/^###\s/.test(section)) {
        return (
          <h3 key={i} className="document-subsection">
            {section.replace(/^###\s/, "")}
          </h3>
        );
      } else if (
        /^\*\s/.test(section) ||
        /^-\s/.test(section) ||
        /^\d+\.\s/.test(section)
      ) {
        return (
          <ul key={i} className="document-list">
            {section.split("\n").map((item, j) => (
              <li key={j} className="document-list-item">
                {item.replace(/^[*-]\s|^\d+\.\s/, "")}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <p key={i} className="document-paragraph">
            {section}
          </p>
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FiUpload className="text-blue-600" />
        Smart Document Processor
      </h3>

      {/* File Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload
          className={`mx-auto h-12 w-12 ${
            isDragActive ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the file here"
            : "Drag and drop files here or click to browse"}
        </p>
        <button
          className={`mt-4 px-4 py-2 text-white rounded-md cursor-pointer inline-block ${
            isProcessing ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Select Files"}
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Supports PDF, DOCX, TXT, JPG, PNG (Max 10MB)
        </p>
      </div>

      {/* Document Processing Section */}
      {(extractedText || isProcessing) && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {/* Header with filename and controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h4 className="font-medium text-blue-800 truncate max-w-full">
              {fileName} {isProcessing && "(Processing...)"}
            </h4>

            {/* Toolbar - now responsive with better spacing */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {/* Zoom Controls */}
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title="Zoom Out"
                  disabled={isProcessing}
                >
                  <FiZoomOut className="text-gray-700" />
                </button>
                <span className="px-2 text-sm text-gray-700">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title="Zoom In"
                  disabled={isProcessing}
                >
                  <FiZoomIn className="text-gray-700" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className={`p-1.5 rounded-md flex items-center gap-1 text-sm ${
                    isTextCopied
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-colors`}
                  title="Copy to Clipboard"
                  disabled={isProcessing}
                >
                  <FiCopy />
                  <span className="hidden sm:inline">Copy</span>
                </button>

                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className={`p-2 rounded-md flex items-center gap-1 text-sm ${
                    showExplanation
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-all duration-200`}
                  disabled={isProcessing}
                  aria-label={showExplanation ? "Close AI" : "Open AI"}
                >
                  <FiMessageSquare className="flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {showExplanation ? "Close AI" : "AI"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search in document..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              value={searchTerm}
              onChange={handleSearch}
              disabled={isProcessing}
            />
            {searchTerm && (
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {searchResults.length > 0
                    ? `${currentSearchIndex + 1}/${searchResults.length}`
                    : "0 results"}
                </span>
              </div>
            )}
          </div>

          {/* Document Content */}
          <div
            ref={contentContainerRef}
            className="p-3 rounded border border-gray-200 min-h-[200px] max-h-[400px] sm:max-h-[500px] overflow-auto bg-white shadow-inner"
            style={{
              fontFamily: "monospace",
              fontSize: `${zoomLevel}%`,
              lineHeight: "1.5",
            }}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div
                ref={textContainerRef}
                className="prose max-w-none"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "inherit",
                }}
              >
                {highlightText(textChunks[currentPage - 1] || extractedText)}
              </div>
            )}
          </div>

          {/* Document Stats */}
          {!isProcessing && extractedText && (
            <div className="mt-3 flex flex-wrap justify-between items-center text-sm text-gray-500 bg-gray-50 p-2 rounded">
              <div className="flex gap-3">
                <span>Characters: {extractedText.length.toLocaleString()}</span>
                <span>
                  Words:{" "}
                  {extractedText
                    .split(/\s+/)
                    .filter(Boolean)
                    .length.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 sm:mt-0 text-xs text-gray-400">
                Page {currentPage} of {textChunks.length || 1}
              </div>
            </div>
          )}
        </div>
      )}

      {showExplanation && (
        <div className="mt-2 animate-fade-in">
          <AIExplanation
            selectedText={selectedText}
            fullText={extractedText}
            onClose={() => setShowExplanation(false)}
            disabled={isProcessing}
          />
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadExtract;
