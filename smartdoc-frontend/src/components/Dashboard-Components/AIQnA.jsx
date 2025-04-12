import { useState, useRef } from "react";
import { FiMessageSquare, FiUpload, FiFile } from "react-icons/fi";
import {
  extractTextFromPDF,
  extractTextFromDocx,
  extractTextFromImage,
  extractTextFromTxt,
} from "../../services/clientTextExtractors";
import API from "../../services/Api";

const AIQnA = () => {
  const [selectedDoc, setSelectedDoc] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [numQuestions, setNumQuestions] = useState(3);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsAnswering(true);
      const newDocs = await Promise.all(
        files.map(async (file) => {
          let text;
          const fileType = file.type;

          if (fileType === "application/pdf") {
            text = await extractTextFromPDF(file);
          } else if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            text = await extractTextFromDocx(file);
          } else if (
            fileType === "image/jpeg" ||
            fileType === "image/png" ||
            fileType === "image/jpg"
          ) {
            text = await extractTextFromImage(file);
          } else if (fileType === "text/plain") {
            text = await extractTextFromTxt(file);
          } else {
            throw new Error("Unsupported file type");
          }

          return {
            id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content: text,
            file,
          };
        })
      );

      setUploadedDocs((prev) => [...prev, ...newDocs]);
    } catch (error) {
      console.error("Error processing files:", error);
      alert(`Error processing files: ${error.message}`);
    } finally {
      setIsAnswering(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedDoc || !question.trim()) return;

    setIsAnswering(true);
    try {
      const doc = uploadedDocs.find((d) => d.id === selectedDoc);
      if (!doc) throw new Error("Document not found");

      const { data } = await API.post("/api/ai-qna/ask-question", {
        documentText: doc.content,
        question: question,
      });

      setAnswer(data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedDoc || numQuestions < 1 || numQuestions > 10) return;

    setIsGeneratingQuestions(true);
    try {
      const doc = uploadedDocs.find((d) => d.id === selectedDoc);
      if (!doc) throw new Error("Document not found");

      const { data } = await API.post("/api/ai-qna/generate-questions", {
        documentText: doc.content,
        numQuestions: numQuestions,
      });

      setGeneratedQuestions(data.questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      setGeneratedQuestions([
        `Error generating questions: ${
          error.response?.data?.error || error.message
        }`,
      ]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold flex items-center gap-2">
        <FiMessageSquare /> AI Document Q&A
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Inputs */}
        <div className="flex-1 space-y-4">
          {/* Document Upload Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <label className="block mb-2 font-medium">Upload Documents</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiUpload /> Select Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                className="hidden"
              />
              {isAnswering && <span className="text-gray-500">Processing documents...</span>}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Supported formats: PDF, DOCX, TXT, JPG, PNG
            </p>
          </div>

          {/* Document Selection */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <label className="block mb-2 font-medium">Select Document</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={uploadedDocs.length === 0}
            >
              <option value="">Select a document to query</option>
              {uploadedDocs.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Input */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <label className="block mb-2 font-medium">Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about the selected document..."
              className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAskQuestion}
              disabled={!selectedDoc || !question.trim() || isAnswering}
              className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isAnswering ? "Processing..." : "Ask AI"}
            </button>
          </div>

          {/* Question Generation Section */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <label className="block mb-2 font-medium">
              Generate Questions ({numQuestions} max)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
            <button
              onClick={handleGenerateQuestions}
              disabled={!selectedDoc || isGeneratingQuestions}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isGeneratingQuestions
                ? "Generating Questions..."
                : `Generate ${numQuestions} Questions`}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="flex-1 flex flex-col gap-4">
          {/* AI Response */}
          <div className="border rounded-lg p-4 bg-white shadow-sm flex-1">
            <h4 className="font-medium text-blue-800 mb-3">AI Response</h4>
            <div className="p-4 bg-blue-50 rounded-lg min-h-48">
              {answer ? (
                <p className="whitespace-pre-wrap">{answer}</p>
              ) : (
                <p className="text-gray-500">Ask a question to get an answer...</p>
              )}
            </div>
          </div>

          {/* Generated Questions - Now appears below on mobile */}
          <div className="lg:hidden">
            {generatedQuestions.length > 0 && (
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h4 className="font-medium text-green-800 mb-3">
                  Generated Questions
                </h4>
                <ul className="space-y-2">
                  {generatedQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="p-3 bg-green-50 rounded border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => setQuestion(q)}
                    >
                      <div className="flex items-start">
                        <FiFile className="mt-1 mr-2 flex-shrink-0 text-green-600" />
                        <span className="whitespace-pre-wrap">{q}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Generated Questions - Sidebar on desktop */}
        <div className="hidden lg:block w-72">
          {generatedQuestions.length > 0 && (
            <div className="border rounded-lg p-4 bg-white shadow-sm h-full sticky top-4">
              <h4 className="font-medium text-green-800 mb-3">
                Generated Questions
              </h4>
              <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {generatedQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="p-3 bg-green-50 rounded border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => setQuestion(q)}
                  >
                    <div className="flex items-start">
                      <FiFile className="mt-1 mr-2 flex-shrink-0 text-green-600" />
                      <span className="whitespace-pre-wrap">{q}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Generated Questions - Fallback for mobile when not in sidebar */}
      {generatedQuestions.length > 0 && (
        <div className="lg:hidden border rounded-lg p-4 bg-white shadow-sm">
          <h4 className="font-medium text-green-800 mb-3">
            Generated Questions
          </h4>
          <ul className="space-y-2">
            {generatedQuestions.map((q, i) => (
              <li
                key={i}
                className="p-3 bg-green-50 rounded border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => setQuestion(q)}
              >
                <div className="flex items-start">
                  <FiFile className="mt-1 mr-2 flex-shrink-0 text-green-600" />
                  <span className="whitespace-pre-wrap">{q}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIQnA;
