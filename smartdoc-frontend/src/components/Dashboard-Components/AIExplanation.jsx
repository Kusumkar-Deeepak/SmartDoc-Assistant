import { useState } from "react";
import API from "../../services/Api";
import { FiCopy, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

const AIExplanation = ({ selectedText, fullText }) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("selection");
  const [promptType, setPromptType] = useState("EXPLAIN_SELECTION");
  const [customPrompt, setCustomPrompt] = useState("");

  const commonPrompts = [
    {
      type: "EXPLAIN_SELECTION",
      label: "Explain this in simple terms",
      systemInstruction: `You are a helpful AI assistant that explains text clearly and concisely. Follow these rules:
1. If the text is empty or undefined, say "Please select some text to analyze"
2. Keep explanations to 1-2 short paragraphs maximum
3. Use simple language (8th grade level)
4. Provide examples when helpful
5. Format with clear paragraph breaks`,
    },
    {
      type: "LEGAL_TRANSLATION",
      label: "Convert legal text to plain language",
      systemInstruction: `You are a legal expert that translates complex legal terms to everyday language:
1. If text is empty, say "No legal text found to analyze"
2. Replace legalese with simple equivalents
3. Explain implications clearly
4. Maintain legal accuracy
5. Use bullet points for key clauses`,
    },
    {
      type: "SCIENTIFIC_EXPLANATION",
      label: "Explain scientific terms",
      systemInstruction: `You are a science communicator that explains technical concepts:
1. If text is empty, say "No scientific content found"
2. Define all technical terms
3. Use relatable analogies
4. Explain significance/context
5. Note real-world applications`,
    },
    {
      type: "SUMMARY",
      label: "Summarize key points",
      systemInstruction: `Create a concise summary of the provided content:
1. If text is empty, say "Please provide content to summarize"
2. Identify 3-5 main points
3. Use bullet points
4. Keep under 100 words
5. Maintain original meaning`,
    },
  ];

  const handleExplain = async () => {
    const textToAnalyze = mode === "document" ? fullText : selectedText;

    if (!textToAnalyze?.trim()) {
      setOutput("Please select some text or upload a document to analyze");
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      const endpoint = "/api/ai/explain";
      const selectedPrompt = commonPrompts.find((p) => p.type === promptType);

      const response = await API.post(endpoint, {
        text: textToAnalyze,
        promptType,
        customPrompt: promptType === "custom" ? customPrompt : null,
        systemInstruction:
          selectedPrompt?.systemInstruction ||
          `Explain the provided text clearly and concisely. If the text appears to be an error or empty, 
          respond with "Please provide valid content to analyze".`,
      });

      if (response.data?.explanation) {
        setOutput(response.data.explanation);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      console.error("Explanation error:", error);
      setOutput("Failed to generate explanation. Please try again.");
      toast.error(error.response?.data?.error || "AI service unavailable");
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
            onClick={() => setMode("selection")}
            disabled={!selectedText}
            className={`px-3 py-1 text-sm rounded-full ${
              mode === "selection"
                ? "bg-blue-500 text-white"
                : "bg-gray-200" + (!selectedText ? " opacity-50" : "")
            }`}
            title={!selectedText ? "Select text first" : ""}
          >
            Selected Text
          </button>
          <button
            onClick={() => setMode("document")}
            className={`px-3 py-1 text-sm rounded-full ${
              mode === "document" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
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
                if (prompt.type !== "custom") handleExplain();
              }}
              disabled={isLoading}
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

      {promptType === "custom" && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2 text-gray-700">
            Custom Question
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask anything about the text..."
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleExplain}
              disabled={isLoading || !customPrompt.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Ask
            </button>
          </div>
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
