import { useState, useRef, useEffect } from "react";
import {
  FiFileText,
  FiUpload,
  FiCopy,
  FiCheck,
  FiVolume2,
} from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import axios from "../../services/Api";
import {
  extractTextFromPDF,
  extractTextFromDocx,
  extractTextFromTxt,
} from "../../services/clientTextExtractors";

const Summarize = () => {
  const [originalText, setOriginalText] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState({ summary: false });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [utterance, setUtterance] = useState(null);
  const synthRef = useRef(null);

  // Initialize speech synthesis in useEffect
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    loadVoices();

    // Some browsers need this event to populate voices
    const synth = synthRef.current;
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        setError("");

        try {
          const text = await extractTextFromFile(file);
          setOriginalText(text);
        } catch (error) {
          console.error("Error extracting text:", error);
          setError(
            "Failed to extract text from file. Please try another file."
          );
        }
      }
    },
  });

  const extractTextFromFile = async (file) => {
    try {
      switch (file.type) {
        case "application/pdf":
          return await extractTextFromPDF(file);
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          return await extractTextFromDocx(file);
        case "text/plain":
          return await extractTextFromTxt(file);
        default:
          throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error("Extraction error:", error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  };

  const handleSummarize = async () => {
    if (!originalText.trim()) {
      setError("Please provide text to summarize");
      return;
    }

    setIsSummarizing(true);
    setError("");
    try {
      const response = await axios.post("/api/summarize", {
        text: originalText,
      });
      setSummary(response.data.summary);

      // Load voices when summary is generated
      loadVoices();
    } catch (error) {
      console.error("Summarization error:", error);
      setError("Error generating summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const loadVoices = () => {
    const synth = synthRef.current;
    const availableVoices = synth.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0) {
      // Default to first English voice or first available voice
      const defaultVoice =
        availableVoices.find((v) => v.lang.includes("en")) ||
        availableVoices[0];
      setVoice(defaultVoice);
    }
  };

  const speakText = () => {
    if (!summary || isSpeaking) return;

    const synth = synthRef.current;
    synth.cancel(); // Cancel any ongoing speech

    const newUtterance = new SpeechSynthesisUtterance(summary);
    setUtterance(newUtterance);

    if (voice) {
      newUtterance.voice = voice;
    }

    newUtterance.onboundary = (event) => {
      // Optional: You could track word boundaries here
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setUtterance(null);
    };

    newUtterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      setIsSpeaking(false);
      setUtterance(null);
    };

    synth.speak(newUtterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    const synth = synthRef.current;
    synth.cancel();
    setIsSpeaking(false);
    setUtterance(null);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FiFileText className="text-blue-600" />
              Document Summarization
            </h1>
            <p className="text-gray-600 mt-1">
              Upload a document or paste text to generate a summary
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div
          {...getRootProps()}
          className={`mb-6 border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto text-3xl text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-700">
            {isDragActive
              ? "Drop the file here"
              : fileName || "Drag & drop a document here, or click to select"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: .txt, .pdf, .doc, .docx
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 md:p-5 h-full">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Original Text
              </h2>
              {originalText && (
                <button
                  onClick={() => copyToClipboard(originalText, "original")}
                  className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                  title="Copy text"
                >
                  {copied.original ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiCopy />
                  )}
                </button>
              )}
            </div>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste your text here or upload a file..."
              className="w-full h-48 md:h-64 p-3 md:p-4 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSummarize}
              disabled={!originalText.trim() || isSummarizing}
              className={`mt-4 w-full py-2 md:py-3 px-4 rounded-lg font-medium transition-colors ${
                !originalText.trim() || isSummarizing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSummarizing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                </span>
              ) : (
                "Generate Summary"
              )}
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 md:p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800">
                AI Summary
              </h2>
              <div className="flex gap-2">
                {summary && (
                  <>
                    <button
                      onClick={() => copyToClipboard(summary, "summary")}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                      title="Copy summary"
                    >
                      {copied.summary ? (
                        <FiCheck className="text-green-500" />
                      ) : (
                        <FiCopy />
                      )}
                    </button>
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakText}
                      className={`p-1 ${
                        isSpeaking ? "text-red-500" : "text-blue-600"
                      } hover:text-blue-800 transition-colors`}
                      title={isSpeaking ? "Stop speaking" : "Read aloud"}
                      disabled={!summary}
                    >
                      <FiVolume2 />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-lg border border-blue-100 flex-grow">
              {summary ? (
                <div className="h-full overflow-auto">
                  <p className="text-gray-700 whitespace-pre-line">{summary}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 italic">
                    Summary will appear here...
                  </p>
                </div>
              )}
            </div>

            {/* Voice selection dropdown */}
            {voices.length > 0 && summary && (
              <div className="mt-3">
                <label
                  htmlFor="voice-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Voice:
                </label>
                <select
                  id="voice-select"
                  value={voice ? voice.voiceURI : ""}
                  onChange={(e) => {
                    const selectedVoice = voices.find(
                      (v) => v.voiceURI === e.target.value
                    );
                    if (selectedVoice) setVoice(selectedVoice);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {voices
                    .filter((v) => v.lang.includes("en")) // Filter English voices by default
                    .map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {`${v.name} (${v.lang})`} {v.default && "— DEFAULT"}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarize;
