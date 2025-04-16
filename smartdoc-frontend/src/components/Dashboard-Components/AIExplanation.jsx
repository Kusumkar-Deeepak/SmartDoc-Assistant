import { useState, useEffect } from "react";
import API from "../../services/Api";
import { FiCopy, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

const AIExplanation = ({ selectedText, fullText }) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(selectedText ? "selection" : "document");
  const [promptType, setPromptType] = useState("EXPLAIN_SELECTION");
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");

  // Track if we have valid content
  const hasSelectedText = selectedText && selectedText.trim().length >= 3;
  const hasFullText = fullText && fullText.trim().length >= 10;

  // Update mode when selectedText changes
  useEffect(() => {
    if (hasSelectedText) {
      setMode("selection");
    } else if (hasFullText) {
      setMode("document");
    }
  }, [selectedText, fullText]);

  const commonPrompts = [
    {
      type: "EXPLAIN_SELECTION",
      label: "Explain this in simple terms",
    },
    {
      type: "LEGAL_TRANSLATION",
      label: "Convert legal text to plain language",
    },
    {
      type: "SCIENTIFIC_EXPLANATION",
      label: "Explain scientific terms",
    },
    {
      type: "SUMMARY",
      label: "Summarize key points",
    },
  ];

  const handleExplain = async () => {
    try {
      setIsLoading(true);
      setError("");
      setOutput("");

      const content = mode === "selection" ? selectedText : fullText;

      if (
        !content ||
        (mode === "selection" && !hasSelectedText) ||
        (mode === "document" && !hasFullText)
      ) {
        throw new Error(
          mode === "selection"
            ? "Please select at least 3 characters of text"
            : "Document content is too short"
        );
      }

      const response = await API.post("/api/ai/explain", {
        [mode === "selection" ? "text" : "fullText"]: content,
        promptType,
        ...(customPrompt && { customPrompt }),
      });

      setOutput(
        response.data.explanation ||
          response.data.analysis ||
          "No response received"
      );
    } catch (err) {
      console.error("Explanation error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to get explanation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(output)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          AI Text Analysis
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode("selection");
              if (hasSelectedText) handleExplain();
            }}
            disabled={!hasSelectedText}
            className={`px-3 py-1 text-sm rounded-full ${
              mode === "selection" ? "bg-blue-500 text-white" : "bg-gray-200"
            } ${!hasSelectedText ? " opacity-50 cursor-not-allowed" : ""}`}
            title={!hasSelectedText ? "Select at least 3 characters first" : ""}
          >
            Selected Text
          </button>
          <button
            onClick={() => {
              setMode("document");
              if (hasFullText) handleExplain();
            }}
            disabled={!hasFullText}
            className={`px-3 py-1 text-sm rounded-full ${
              mode === "document" ? "bg-blue-500 text-white" : "bg-gray-200"
            } ${!hasFullText ? " opacity-50 cursor-not-allowed" : ""}`}
            title={!hasFullText ? "Document content too short" : ""}
          >
            Full Document
          </button>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 text-gray-700">
          Analysis Type
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {commonPrompts.map((prompt) => (
            <button
              key={prompt.type}
              onClick={() => {
                setPromptType(prompt.type);
                setCustomPrompt("");
                handleExplain();
              }}
              disabled={
                isLoading ||
                !(mode === "selection" ? hasSelectedText : hasFullText)
              }
              className={`p-2 text-sm rounded ${
                promptType === prompt.type
                  ? "bg-blue-100 border-2 border-blue-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 text-gray-700">
          {promptType === "custom"
            ? "Custom Question"
            : "Or Ask Custom Question"}
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setPromptType("custom");
            }}
            placeholder="Ask anything about the text..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleExplain}
            disabled={
              isLoading ||
              !customPrompt.trim() ||
              !(mode === "selection" ? hasSelectedText : hasFullText)
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 sm:w-auto w-full"
          >
            Ask
          </button>
        </div>
      </div>
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error.includes("Failed") ? (
            <>
              <p>Failed to process your request:</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-1">
                Please try a shorter text selection.
              </p>
            </>
          ) : (
            error
          )}
        </div>
      )}
      <div className="bg-white border rounded overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
          <h4 className="font-medium text-gray-700">AI Analysis Result</h4>
          {output && (
            <button
              onClick={copyToClipboard}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              <FiCopy size={14} /> Copy
            </button>
          )}
        </div>

        <div className="p-4 min-h-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
              <FiLoader className="animate-spin text-blue-500" size={24} />
              <p>Analyzing content...</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : output ? (
            <div className="whitespace-pre-wrap text-gray-800">
              {output.startsWith("Analysis of Provided Content:") ? (
                <>
                  <h5 className="font-bold text-lg mb-2">Document Analysis</h5>
                  {output.split("**").map((section, i) => {
                    if (section.includes("Introduction:")) {
                      return (
                        <div key={i} className="mb-4">
                          <h6 className="font-semibold text-blue-600">
                            Introduction
                          </h6>
                          <p>{section.replace("Introduction:", "").trim()}</p>
                        </div>
                      );
                    } else if (section.includes("Body:")) {
                      return (
                        <div key={i} className="mb-4">
                          <h6 className="font-semibold text-blue-600">
                            Detailed Analysis
                          </h6>
                          {section.replace("Body:", "").trim()}
                        </div>
                      );
                    } else if (section.includes("Conclusion:")) {
                      return (
                        <div key={i} className="mb-4">
                          <h6 className="font-semibold text-blue-600">
                            Conclusion
                          </h6>
                          <p>{section.replace("Conclusion:", "").trim()}</p>
                        </div>
                      );
                    }
                    return <p key={i}>{section}</p>;
                  })}
                </>
              ) : (
                <div className="prose max-w-none">
                  {output.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              <p>Select an analysis type or enter a custom question</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIExplanation;
