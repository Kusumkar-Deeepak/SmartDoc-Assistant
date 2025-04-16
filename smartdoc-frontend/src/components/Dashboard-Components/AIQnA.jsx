import { useState, useCallback } from "react";
import {
  FiMessageSquare,
  FiFile,
  FiX,
  FiUpload,
  FiSearch,
} from "react-icons/fi";
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
  const [activeTab, setActiveTab] = useState("upload"); // 'upload', 'ask', 'questions'
  const [error, setError] = useState("");

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
          setError(
            `${file.name} is damaged or cannot be opened. Please try a different file.`
          );
          console.error(`Error processing ${file.name}:`, error);
        }
      }

      setUploadedDocs((prev) => [...prev, ...newDocs]);
      if (newDocs.length > 0) {
        setSelectedDoc(newDocs[0].id);
        setActiveTab("ask");
      }
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
      setSelectedDoc(uploadedDocs.length > 1 ? uploadedDocs[0].id : "");
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
      setActiveTab("answer");
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
      setActiveTab("questions");
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
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      <h3 className="text-2xl font-semibold flex items-center gap-2">
        <FiMessageSquare /> AI Document Q&A
      </h3>

      {/* Mobile Tabs */}
      <div className="lg:hidden flex overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex border-b min-w-max">
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "upload"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <FiUpload size={16} />
            Upload
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "ask"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("ask")}
            disabled={uploadedDocs.length === 0}
          >
            <FiSearch size={16} />
            Ask
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "questions"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("questions")}
            disabled={uploadedDocs.length === 0}
          >
            <FiFile size={16} />
            Questions
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Upload & Input (Always visible on desktop, tabbed on mobile) */}
        <div
          className={`flex-1 ${
            activeTab !== "upload" ? "hidden lg:block" : ""
          }`}
        >
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
              <FiUpload /> Upload Documents
            </h4>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              } ${isAnswering ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <FiFile className="mx-auto h-10 w-10 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-500 font-medium">
                    Drop files to upload
                  </p>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium">
                      Drag & drop files here
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse files
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports: PDF, DOCX, TXT, JPG, PNG (Max 10 files)
                    </p>
                  </>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center mt-1">
                  Uploading {uploadProgress}%
                </p>
              </div>
            )}

            {/* Uploaded Documents List */}
            {uploadedDocs.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium mb-3">Your Documents</h5>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        selectedDoc === doc.id
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 flex-1 min-w-0"
                        onClick={() => {
                          setSelectedDoc(doc.id);
                          setActiveTab("ask");
                        }}
                      >
                        <FiFile className="text-gray-500 flex-shrink-0" />
                        <span className="truncate">{doc.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(doc.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove document"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column - Question Input & Answer (Always visible on desktop, tabbed on mobile) */}
        <div
          className={`flex-1 ${activeTab !== "ask" ? "hidden lg:block" : ""}`}
        >
          <div className="bg-white rounded-lg shadow-sm p-4 border h-full flex flex-col">
            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
              <FiSearch /> Ask About Documents
            </h4>

            {uploadedDocs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Please upload documents first
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Document
                  </label>
                  <select
                    value={selectedDoc}
                    onChange={(e) => setSelectedDoc(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {uploadedDocs.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Question
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask anything about the selected document..."
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm h-32"
                    />
                    <button
                      onClick={handleAskQuestion}
                      disabled={!selectedDoc || !question.trim() || isAnswering}
                      className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {isAnswering ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Ask Question"
                      )}
                    </button>
                  </div>

                  {activeTab === "answer" || answer ? (
                    <div className="mt-4 border-t pt-4">
                      <h5 className="font-medium text-gray-700 mb-2">
                        AI Answer
                      </h5>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {answer ? (
                          <p className="whitespace-pre-wrap text-sm">
                            {answer}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Your answer will appear here
                          </p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Generated Questions (Always visible on desktop, tabbed on mobile) */}
        <div
          className={`lg:w-80 ${
            activeTab !== "questions" ? "hidden lg:block" : ""
          }`}
        >
          <div className="bg-white rounded-lg shadow-sm p-4 border h-full">
            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
              <FiFile /> Suggested Questions
            </h4>

            {uploadedDocs.length === 0 ? (
              <div className="text-gray-500 text-sm">
                Upload and select a document to generate questions
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions: {numQuestions}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleGenerateQuestions}
                  disabled={!selectedDoc || isGeneratingQuestions}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  {isGeneratingQuestions ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    `Generate Questions`
                  )}
                </button>

                {generatedQuestions.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {generatedQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors text-sm"
                        onClick={() => {
                          setQuestion(q);
                          setActiveTab("ask");
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500">{i + 1}.</span>
                          <span className="whitespace-pre-wrap">{q}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIQnA;
