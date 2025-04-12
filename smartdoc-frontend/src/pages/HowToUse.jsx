import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiCopy,
  FiVolume2,
  FiSearch,
  FiLock,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import {
  FaRobot,
  FaLightbulb,
  FaQuestionCircle,
  FaFolderOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="flex justify-center mb-4 text-blue-600 text-4xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

const HowToUse = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);

  const features = [
    {
      title: "Upload & Extract",
      icon: <FiUpload />,
      description:
        "Upload PDFs, images, DOCX, or TXT files. Use powerful tools like search, copy, zoom in/out to analyze your documents.",
      steps: [
        "Click the upload button or drag & drop files",
        "Supported formats: PDF, DOCX, TXT, JPG, PNG",
        "Use search to find text, zoom to adjust view",
        "Copy extracted text with one click",
      ],
      animation: "fadeIn",
    },
    {
      title: "AI Summarization",
      icon: <FaRobot />,
      description:
        "Get concise summaries of your documents with our advanced AI. Listen to summaries or copy them with ease.",
      steps: [
        "Upload your document",
        "Click 'Summarize' button",
        "AI generates key points instantly",
        "Use voice feature to listen or copy text",
      ],
      animation: "slideUp",
    },
    {
      title: "Insight Mirror",
      icon: <FaLightbulb />,
      description:
        "Deep document intelligence revealing hidden insights, sentiment analysis, and key entities beyond basic text processing.",
      steps: [
        "Upload any document type",
        "Receive comprehensive analysis",
        "View emotional tone and biases",
        "Explore visual data representations",
      ],
      animation: "scaleIn",
    },
    {
      title: "AI Q&A",
      icon: <FaQuestionCircle />,
      description:
        "Ask questions about your documents and get accurate answers powered by our AI engine.",
      steps: [
        "Upload multiple documents",
        "Select a document to analyze",
        "Ask any question about the content",
        "Receive AI-generated answers",
      ],
      animation: "rotateIn",
    },
    {
      title: "Manage Docs",
      icon: <FaFolderOpen />,
      description:
        "Securely store, organize, and manage all your documents with password protection.",
      steps: [
        "Store unlimited documents",
        "Add password protection",
        "Quickly view/download files",
        "Delete documents when needed",
      ],
      animation: "fadeInRight",
    },
  ];

  function handleClick() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">SmartDoc - AI</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your intelligent document processing assistant with powerful AI
          capabilities
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-full font-medium transition-colors relative ${
                activeTab === index
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {feature.icon}
              <span className="ml-2">{feature.title}</span>
              {hoveredTab === index && (
                <motion.div
                  layoutId="hoverIndicator"
                  className="absolute inset-0 bg-blue-200 rounded-full mix-blend-multiply"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Feature Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="flex items-center mb-6">
                  <div className="text-4xl text-blue-600 mr-4">
                    {features[activeTab].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {features[activeTab].title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-8 text-lg">
                  {features[activeTab].description}
                </p>

                <div className="space-y-4">
                  {features[activeTab].steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-1">
                        {i + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="md:w-1/2 bg-gray-50 p-8 md:p-12 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 4px 6px rgba(0,0,0,0.1)",
                      "0 10px 15px rgba(0,0,0,0.1)",
                      "0 4px 6px rgba(0,0,0,0.1)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md"
                >
                  {/* Feature-specific mock UI */}
                  {activeTab === 0 && (
                    <div className="p-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                        <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                        <p className="text-gray-600">Drag & drop files here</p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF, DOCX, TXT, JPG, PNG
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-gray-100 rounded flex items-center">
                          <FiSearch className="mr-1" /> Search
                        </button>
                        <button className="px-3 py-1 bg-gray-100 rounded flex items-center">
                          <FiCopy className="mr-1" /> Copy
                        </button>
                        <button className="px-3 py-1 bg-gray-100 rounded">
                          Zoom +
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="p-6">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-blue-800 mb-2">
                          Document Summary
                        </h4>
                        <p className="text-gray-700 mb-4">
                          The document discusses AI advancements in 2023 with
                          focus on...
                        </p>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded flex items-center">
                            <FiVolume2 className="mr-1" /> Listen
                          </button>
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded flex items-center">
                            <FiCopy className="mr-1" /> Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">
                            Sentiment Analysis
                          </h4>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4"></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            75% Positive
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">
                            Key Entities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {["AI", "Technology", "Innovation", "2023"].map(
                              (tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="p-6">
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Ask a question about the document..."
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-700">
                          Q: What are the main points about AI?
                        </p>
                        <p className="text-gray-600 mt-2">
                          A: The document highlights three key advancements in
                          AI for 2023...
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 4 && (
                    <div className="p-6">
                      <div className="space-y-3">
                        {[
                          "Annual_Report.pdf",
                          "Contract.docx",
                          "Notes.txt",
                        ].map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                          >
                            <span className="truncate">{file}</span>
                            <div className="flex space-x-2">
                              <button className="text-gray-500 hover:text-blue-600">
                                <FiLock size={16} />
                              </button>
                              <button className="text-gray-500 hover:text-blue-600">
                                <FiDownload size={16} />
                              </button>
                              <button className="text-gray-500 hover:text-red-600">
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-16"
      >
        <button
          onClick={handleClick}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started with SmartDoc
        </button>
      </motion.div>
    </div>
  );
};

export default HowToUse;
