import { useState, useEffect } from "react";
import API from "../../services/Api";
import { FiCopy, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

const AIExplanation = ({ fullText }) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptType, setPromptType] = useState("EXPLAIN_SELECTION");
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");

  // Track if we have valid content
  const hasFullText = fullText && fullText.trim().length >= 10;

  const commonPrompts = [
    {
      type: "EXPLAIN_SELECTION",
      label: "Explain this in simple terms",
      description: "Get a simplified explanation of the document content",
    },
    {
      type: "LEGAL_TRANSLATION",
      label: "Convert legal text to plain language",
      description: "Translate complex legal terms to everyday language",
    },
    {
      type: "SCIENTIFIC_EXPLANATION",
      label: "Explain scientific terms",
      description: "Break down technical or scientific concepts",
    },
    {
      type: "SUMMARY",
      label: "Summarize key points",
      description: "Get a concise summary of the main points",
    },
  ];

  const handleExplain = async () => {
    try {
      setIsLoading(true);
      setError("");
      setOutput("");

      if (!hasFullText) {
        throw new Error(
          "Document content is too short (minimum 10 characters required)"
        );
      }

      const response = await API.post("/api/ai/explain", {
        fullText: fullText,
        promptType: customPrompt ? "CUSTOM" : promptType,
        customPrompt: customPrompt || null,
      });

      setOutput(
        response.data.analysis ||
          response.data.explanation ||
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          AI Document Analysis
        </h3>
        <p className="text-sm text-gray-600">
          Analyze the document content with different perspectives
        </p>
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
              disabled={isLoading || !hasFullText}
              className={`p-2 text-sm rounded text-left ${
                promptType === prompt.type && !customPrompt
                  ? "bg-blue-100 border-2 border-blue-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              title={prompt.description}
            >
              <span className="font-medium">{prompt.label}</span>
              <p className="text-xs text-gray-600 mt-1">{prompt.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 text-gray-700">
          Ask Custom Question
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              if (e.target.value) setPromptType("CUSTOM");
            }}
            placeholder="Ask anything about the document..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleExplain}
            disabled={isLoading || !customPrompt.trim() || !hasFullText}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 sm:w-auto w-full"
          >
            Ask
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
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
              {output.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-3">
                  {paragraph}
                </p>
              ))}
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
