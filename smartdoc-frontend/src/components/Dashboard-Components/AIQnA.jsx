import { useState, useRef, useCallback } from "react";
import { FiMessageSquare, FiFile, FiX } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    try {
      setIsAnswering(true);
      setUploadProgress(0);

      const newDocs = [];
      const totalFiles = acceptedFiles.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = acceptedFiles[i];
        let text;
        const fileType = file.type;

        try {
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

          newDocs.push({
            id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content: text,
            file,
          });

          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          // Continue with next file even if one fails
        }
      }

      setUploadedDocs((prev) => [...prev, ...newDocs]);
    } catch (error) {
      console.error("Error processing files:", error);
      alert(`Error processing files: ${error.message}`);
    } finally {
      setIsAnswering(false);
      setUploadProgress(0);
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
    maxFiles: 10,
    disabled: isAnswering,
  });

  const removeDocument = (id) => {
    setUploadedDocs(uploadedDocs.filter((doc) => doc.id !== id));
    if (selectedDoc === id) {
      setSelectedDoc("");
      setAnswer("");
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
          {/* Document Upload Section with Dropzone */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <label className="block mb-2 font-medium">Upload Documents</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              } ${isAnswering ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <FiFile className="mx-auto h-10 w-10 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-500">Drop the files here</p>
                ) : (
                  <>
                    <p className="text-gray-600">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, DOCX, TXT, JPG, PNG
                    </p>
                    <p className="text-xs text-gray-400">
                      (Max 10 files at once)
                    </p>
                  </>
                )}
              </div>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Processing {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Documents List */}
          {uploadedDocs.length > 0 && (
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <label className="block mb-2 font-medium">
                Uploaded Documents
              </label>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {uploadedDocs.map((doc) => (
                  <li
                    key={doc.id}
                    className={`flex items-center justify-between p-3 rounded ${
                      selectedDoc === doc.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiFile className="text-gray-500" />
                      <span
                        className="truncate max-w-xs cursor-pointer"
                        onClick={() => setSelectedDoc(doc.id)}
                        title={doc.name}
                      >
                        {doc.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove document"
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                <p className="text-gray-500">
                  {selectedDoc
                    ? "Ask a question to get an answer..."
                    : "Select a document to begin"}
                </p>
              )}
            </div>
          </div>

          {/* Generated Questions - Mobile view */}
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

        {/* Generated Questions - Desktop sidebar */}
        {generatedQuestions.length > 0 && (
          <div className="hidden lg:block w-72">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQnA;
