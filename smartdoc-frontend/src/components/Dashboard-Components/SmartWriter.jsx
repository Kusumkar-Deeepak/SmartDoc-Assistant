import React, { useState } from "react";
import { generateReport } from "../../services/reportAPI";
import { FiCopy, FiCheck } from "react-icons/fi";

const SmartWriter = () => {
  const [selectedFileType, setSelectedFileType] = useState("pdf");
  const [generatedFileType, setGeneratedFileType] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [pageLimit, setPageLimit] = useState(5);
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await generateReport(
        selectedFileType,
        prompt,
        pageLimit
      );
      setReport(response.content);
      setGeneratedFileType(selectedFileType);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Smart Document Generator
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Create professional documents with AI in seconds
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Output Format
                </label>
                <div className="flex space-x-3">
                  {["pdf", "docx", "pptx"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedFileType(type)}
                      className={`flex-1 py-2 px-4 rounded-md border transition-all ${
                        selectedFileType === type
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-indigo-300"
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Document Content Instructions
                </label>
                <textarea
                  placeholder="Describe what you want to create (e.g., 'A 5-page market analysis report on electric vehicles')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Page Length (1-20)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={pageLimit}
                    onChange={(e) => setPageLimit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
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
                      </span>
                    ) : (
                      "Generate Document"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {report && (
            <div className="border-t border-gray-200">
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Your Generated Document
                    </h3>
                    <p className="text-sm text-gray-500">
                      {generatedFileType?.toUpperCase() ||
                        selectedFileType.toUpperCase()}{" "}
                      format
                    </p>
                  </div>
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="h-5 w-5" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="h-5 w-5" />
                        <span className="text-sm">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none"
                    rows="12"
                    style={{ minHeight: "300px" }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {report.length} characters
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartWriter;
