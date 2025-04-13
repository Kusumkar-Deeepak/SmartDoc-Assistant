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
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import AIExplanation from "./AIExplanation";

const UploadExtract = () => {
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const textContainerRef = useRef(null);
  const contentContainerRef = useRef(null);
  const [textChunks, setTextChunks] = useState([]);
  const CHUNK_SIZE = 5000; // Characters per page
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  // Format extracted text with basic structure
  const formatText = (text) => {
    if (!text) return "";

    // Preserve indentation and alignment
    const lines = text.split("\n");
    const formattedLines = lines.map((line) => {
      // Preserve leading spaces/tabs for indentation
      const leadingWhitespace = line.match(/^\s*/)[0];
      const content = line.trim();

      // Handle bullet points and numbered lists
      if (/^\d+\./.test(content)) {
        return `${leadingWhitespace}${content}`;
      }
      if (/^[-•*]/.test(content)) {
        return `${leadingWhitespace}${content}`;
      }

      // Preserve table-like structures
      if (line.includes("  ") && line.trim().split(/\s{2,}/).length > 2) {
        return line.replace(/\s{2,}/g, "    "); // Convert multiple spaces to tabs
      }

      return line;
    });

    return formattedLines.join("\n");
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  useEffect(() => {
    const container = textContainerRef.current;
    if (container) {
      container.addEventListener("mouseup", handleTextSelection);
      return () => {
        container.removeEventListener("mouseup", handleTextSelection);
      };
    }
  }, [handleTextSelection]);

  // Split text into manageable chunks
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

  // Highlight syntax and search results
  // Highlight search results
  useEffect(() => {
    if (!textContainerRef.current || !searchTerm) return;

    // Remove previous highlights
    const highlights =
      textContainerRef.current.querySelectorAll("mark.bg-yellow-200");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    });

    // Apply new highlights
    const regex = new RegExp(escapeRegExp(searchTerm), "gi");
    const walker = document.createTreeWalker(
      textContainerRef.current,
      NodeFilter.SHOW_TEXT
    );

    let node;
    const matches = [];
    while ((node = walker.nextNode())) {
      if (node.textContent.match(regex)) {
        matches.push(node);
      }
    }

    matches.forEach((textNode) => {
      const span = document.createElement("span");
      span.innerHTML = textNode.textContent.replace(
        regex,
        '<mark class="bg-yellow-200">$&</mark>'
      );
      textNode.parentNode.replaceChild(span, textNode);
    });

    // Update search results
    setSearchResults(matches);
    setCurrentSearchIndex(0);
  }, [searchTerm, currentPage]);

  // Helper function to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Helper function to highlight search terms in text
  const highlightSearchInText = (text, regex) => {
    if (typeof text !== "string") return text;
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Helper function to highlight search terms in React element children
  const highlightSearchInChildren = (children, regex) => {
    if (typeof children === "string") {
      return highlightSearchInText(children, regex);
    }
    if (Array.isArray(children)) {
      return children.map((child) => highlightSearchInChildren(child, regex));
    }
    return children;
  };

  // Scroll to top when page changes
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Handle file processing
  const processFile = async (file) => {
    if (!file) return;

    // Validate file type and size (10MB limit)
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
      toast.error(error.message || "Failed to extract text");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload via input
  const handleFileUpload = async (e) => {
    await processFile(e.target.files[0]);
  };

  // Handle drop with react-dropzone
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      await processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigateToSearchResult = (direction) => {
    if (searchResults.length === 0) return;

    const newIndex =
      direction === "next"
        ? (currentSearchIndex + 1) % searchResults.length
        : (currentSearchIndex - 1 + searchResults.length) %
          searchResults.length;

    setCurrentSearchIndex(newIndex);
    scrollToSearchResult(searchResults[newIndex]);
  };

  const scrollToSearchResult = (position) => {
    if (textContainerRef.current) {
      const textNode = textContainerRef.current;
      const range = document.createRange();
      range.setStart(textNode.firstChild, position);
      range.setEnd(textNode.firstChild, position + searchTerm.length);
      range.getBoundingClientRect(); // Needed for scrollIntoView to work
      range.startContainer.parentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

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

  const highlightText = (text) => {
    if (!text) return null;

    // Split into paragraphs and sections
    const sections = text.split(/\n\s*\n/); // Split by double newlines

    return (
      <div className="document-content">
        {sections.map((section, i) => {
          // Check for heading levels
          if (/^#\s/.test(section)) {
            // Main title (H1)
            return (
              <h1 key={i} className="document-title" data-searchable="true">
                {section.replace(/^#\s/, "")}
              </h1>
            );
          } else if (/^##\s/.test(section)) {
            // Section heading (H2)
            return (
              <h2 key={i} className="document-section" data-searchable="true">
                {section.replace(/^##\s/, "")}
              </h2>
            );
          } else if (/^###\s/.test(section)) {
            // Subsection heading (H3)
            return (
              <h3
                key={i}
                className="document-subsection"
                data-searchable="true"
              >
                {section.replace(/^###\s/, "")}
              </h3>
            );
          } else if (
            /^\*\s/.test(section) ||
            /^-\s/.test(section) ||
            /^\d+\.\s/.test(section)
          ) {
            // List items
            const items = section.split("\n");
            return (
              <ul key={i} className="document-list">
                {items.map((item, j) => (
                  <li
                    key={j}
                    className="document-list-item"
                    data-searchable="true"
                  >
                    {item.replace(/^[*-]\s|^\d+\.\s/, "")}
                  </li>
                ))}
              </ul>
            );
          } else {
            // Regular paragraph
            return (
              <p key={i} className="document-paragraph" data-searchable="true">
                {section}
              </p>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FiUpload className="text-blue-600" />
        Smart Document Processor
      </h3>

      {/* File Upload Section with Dropzone */}
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
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-blue-800">
              {fileName} {isProcessing ? "(Processing...)" : ""}
            </h4>

            {/* Toolbar */}
            <div className="flex space-x-2">
              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                className="p-2 rounded hover:bg-gray-100"
                title="Zoom Out"
                disabled={isProcessing}
              >
                <FiZoomOut />
              </button>
              <span className="flex items-center px-2">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded hover:bg-gray-100"
                title="Zoom In"
                disabled={isProcessing}
              >
                <FiZoomIn />
              </button>

              {/* Copy to Clipboard */}
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded hover:bg-gray-100 ${
                  isTextCopied ? "text-green-500" : ""
                }`}
                title="Copy to Clipboard"
                disabled={isProcessing}
              >
                <FiCopy />
              </button>
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
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchTerm}
              onChange={handleSearch}
              disabled={isProcessing}
            />
            {searchTerm && (
              <div className="absolute right-2 top-2 flex space-x-1">
                <span className="text-sm text-gray-500">
                  {searchResults.length > 0
                    ? `${currentSearchIndex + 1}/${searchResults.length}`
                    : "0 results"}
                </span>
                {searchResults.length > 0 && (
                  <>
                    <button
                      onClick={() => navigateToSearchResult("prev")}
                      className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                      disabled={isProcessing}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => navigateToSearchResult("next")}
                      className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                      disabled={isProcessing}
                    >
                      ▼
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Document Content */}
          <div
            ref={contentContainerRef}
            className={`p-3 rounded border border-gray-200 min-h-32 max-h-96 overflow-auto bg-white`}
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
            <div className="mt-2 text-sm text-gray-500">
              <p>Characters: {extractedText.length.toLocaleString()}</p>
              <p>
                Words:{" "}
                {extractedText
                  .split(/\s+/)
                  .filter(Boolean)
                  .length.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className={`p-2 rounded-md flex items-center gap-1 transition-all ${
          showExplanation
            ? "bg-blue-100 text-blue-600 ring-2 ring-blue-300"
            : "hover:bg-gray-100 text-gray-600"
        } ${
          isProcessing || !extractedText ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title={
          isProcessing
            ? "Please wait while processing completes"
            : !extractedText
            ? "Upload or extract text first"
            : showExplanation
            ? "Close AI Assistant"
            : "Open AI Assistant"
        }
        disabled={isProcessing || !extractedText}
      >
        <FiMessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">
          {showExplanation ? "Close AI" : "AI Assistant"}
        </span>
      </button>

      {showExplanation && (
        <div className="mt-4 animate-fade-in">
          <AIExplanation
            selectedText={selectedText}
            fullText={extractedText}
            onClose={() => setShowExplanation(false)}
            disabled={isProcessing}
          />
        </div>
      )}
    </div>
  );
};

export default UploadExtract;
