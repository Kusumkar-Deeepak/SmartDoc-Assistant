import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiMenu,
  FiX,
  FiFile,
  FiImage,
  FiSearch,
  FiEdit,
  FiBarChart2,
  FiHelpCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SmartDocLanding = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      title: "AI-Powered Document Understanding",
      desc: "Upload and extract text from PDFs, DOCX, TXT, and images (OCR) then chat with your documents",
      icon: <FiFileText className="text-3xl" />,
      animation: "upload",
      supportedFormats: ["PDF", "DOCX", "TXT", "JPG/PNG"],
    },
    {
      title: "Instant Summarization",
      desc: "Get concise summaries of lengthy documents in seconds with key points extracted",
      icon: <FiMessageSquare className="text-3xl" />,
      animation: "summarize",
      benefits: ["Save time", "Focus on key info", "Multi-doc summaries"],
    },
    {
      title: "Insight Mirror - Deep Analysis",
      desc: "Reveal hidden insights, sentiment analysis, and key entities beyond basic text processing",
      icon: <FiBarChart2 className="text-3xl" />,
      animation: "analyze",
      features: ["Sentiment analysis", "Bias detection", "Data visualization"],
    },
    {
      title: "AI Q&A from Documents",
      desc: "Ask questions about your documents and get accurate answers powered by AI",
      icon: <FiHelpCircle className="text-3xl" />,
      animation: "qa",
      useCases: ["Research", "Legal review", "Technical docs"],
    },
    {
      title: "Smart Document Writer",
      desc: "Generate professional documents, reports, and presentations from simple prompts",
      icon: <FiEdit className="text-3xl" />,
      animation: "write",
      outputs: ["PDF", "DOCX", "PPTX", "HTML"],
    },
  ];

  const handleTryFree = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
      });
    }
  };

  const handleHowItWorks = () => {
    navigate("/how-to-use");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Animation variants for features
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hover: {
      y: -10,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="flex justify-between items-center px-4 py-3">
          <motion.h1
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            SmartDoc AI
          </motion.h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-2 space-y-2">
                <button
                  onClick={handleTryFree}
                  className="w-full px-4 py-2 m-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white"
                >
                  {isAuthenticated ? "Dashboard" : "Try It Free"}
                </button>
                <button
                  onClick={handleHowItWorks}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                >
                  How It Works
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header Section */}
      <header className="relative h-screen flex flex-col items-center justify-center px-4 pt-16 lg:pt-0">
        {/* Floating documents - Mobile optimized */}
        <motion.div
          className="hidden sm:block absolute top-1/4 left-4 sm:left-10 w-12 sm:w-16 h-12 sm:h-16 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiFileText className="text-xl sm:text-2xl text-cyan-300" />
        </motion.div>

        <motion.div
          className="hidden sm:block absolute top-1/3 right-4 sm:right-20 w-16 sm:w-20 h-16 sm:h-20 bg-blue-500/20 backdrop-blur-sm rounded-xl shadow-xl flex items-center justify-center"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <FiUpload className="text-2xl sm:text-3xl text-blue-300" />
        </motion.div>

        {/* AI Assistant Character - Mobile optimized */}
        <motion.div
          className="absolute bottom-10 right-4 sm:right-10 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={handleTryFree}
        >
          <div className="relative">
            <div className="w-4 sm:w-6 h-4 sm:h-6 bg-white rounded-full absolute top-2 sm:top-4 left-2 sm:left-4"></div>
            <div className="w-4 sm:w-6 h-4 sm:h-6 bg-white rounded-full absolute top-2 sm:top-4 right-2 sm:right-4"></div>
            <div className="w-10 sm:w-16 h-5 sm:h-8 bg-white/30 rounded-full absolute bottom-2 sm:bottom-4 left-2 sm:left-4"></div>
          </div>
        </motion.div>

        {/* Main hero content - Mobile optimized */}
        <div className="text-center z-10 px-2">
          <motion.h1
            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SmartDoc AI
          </motion.h1>

          <motion.p
            className="text-base sm:text-xl md:text-2xl max-w-xs sm:max-w-2xl mx-auto mb-6 sm:mb-10 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Transform your documents into intelligent conversations with
            AI-powered analysis and generation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <button
              onClick={handleTryFree}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              {isAuthenticated ? "Go to Dashboard" : "Try It Free"}
            </button>
            <button
              onClick={handleHowItWorks}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm rounded-full text-sm sm:text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              See How It Works
            </button>
          </motion.div>
        </div>

        {/* Modern Scroll Indicator Animation */}
        <motion.div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-gray-400 mb-2 sm:mb-3 text-xs sm:text-sm font-light tracking-wider">
            EXPLORE FEATURES
          </span>
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-8 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center"
          >
            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-1 w-1 bg-gray-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </header>

      {/* Features section - Mobile optimized */}
      <section
        id="features"
        className="py-12 sm:py-20 px-4 max-w-6xl mx-auto"
        ref={containerRef}
      >
        <motion.h2
          className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Five Powerful Ways to{" "}
          <span className="text-cyan-400">Supercharge</span> Your Documents
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-4 sm:p-6 rounded-xl backdrop-blur-sm cursor-pointer ${
                activeFeature === index
                  ? "bg-white/10 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              variants={featureVariants}
              onClick={() => setActiveFeature(index)}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3">
                {feature.desc}
              </p>
              {feature.supportedFormats && (
                <div className="mt-3">
                  <p className="text-xs text-cyan-300 mb-1">Supports:</p>
                  <div className="flex flex-wrap gap-1">
                    {feature.supportedFormats.map((format) => (
                      <span
                        key={format}
                        className="text-xs px-2 py-1 bg-cyan-500/10 rounded-full"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {feature.benefits && (
                <div className="mt-3">
                  <p className="text-xs text-cyan-300 mb-1">Benefits:</p>
                  <ul className="text-xs space-y-1">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center">
                        <span className="text-cyan-400 mr-1">•</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Interactive demo preview - Mobile optimized */}
        <motion.div
          className="mt-16 sm:mt-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-3xl p-0.5 sm:p-1 shadow-lg sm:shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-8">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500 mr-1 sm:mr-2"></div>
              <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-yellow-500 mr-1 sm:mr-2"></div>
              <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500"></div>
              <div className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-400">
                SmartDoc AI - {features[activeFeature].title}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className="h-48 sm:h-64 bg-gray-800 rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center w-full h-full p-4"
                    >
                      {activeFeature === 0 && (
                        <div className="h-full flex flex-col justify-center">
                          <div className="flex justify-center mb-4">
                            <div className="relative">
                              <FiUpload className="text-4xl sm:text-5xl text-cyan-400 animate-bounce" />
                              <motion.div
                                className="absolute -inset-1 bg-cyan-400 rounded-full blur opacity-20"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-sm sm:text-base mb-3">
                            Drag & drop your files here
                          </p>
                          <div className="flex justify-center gap-2 flex-wrap">
                            {features[0].supportedFormats.map((format) => (
                              <span
                                key={format}
                                className="text-xs px-2 py-1 bg-gray-700 rounded-full"
                              >
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeFeature === 1 && (
                        <div className="h-full flex flex-col">
                          <div className="flex-1 bg-gray-700/50 rounded-lg p-3 mb-2 text-left overflow-hidden">
                            <h4 className="text-xs text-gray-400 mb-2">
                              Original Document Excerpt:
                            </h4>
                            <p className="text-xs text-gray-300 mb-1">
                              "The study analyzed 1,200 patients across 5
                              hospitals. Results showed a 32% improvement in
                              recovery times with the new treatment protocol (p
                              0.01). Patient satisfaction scores averaged 4.7/5
                              compared to 3.9/5 in the control group..."
                            </p>
                            <p className="text-xs text-gray-300">
                              "Secondary outcomes included reduced hospital
                              stays (mean 2.1 days vs 3.4 days) and lower
                              readmission rates (8% vs 14%). Cost analysis
                              revealed..."
                            </p>
                          </div>
                          <div className="bg-cyan-500/10 rounded-lg p-3 text-left border border-cyan-500/30">
                            <h4 className="text-xs text-cyan-300 mb-1">
                              AI Summary:
                            </h4>
                            <p className="text-xs text-cyan-100">
                              • New treatment improved recovery by 32%
                              (significant) <br />
                              • Higher patient satisfaction (4.7 vs 3.9) <br />
                              • Reduced hospital stays by 1.3 days <br />• Lower
                              readmission rates (8% vs 14%)
                            </p>
                          </div>
                        </div>
                      )}
                      {activeFeature === 2 && (
                        <div className="h-full flex flex-col justify-center">
                          <div className="flex justify-center mb-3">
                            <FiBarChart2 className="text-4xl sm:text-5xl text-purple-400" />
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-lg p-2 mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Positive</span>
                              <span>75%</span>
                            </div>
                            <div className="h-2 bg-gray-600 rounded-full">
                              <motion.div
                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-700/50 rounded p-2">
                              <div className="text-xs text-cyan-300 mb-1">
                                Key Entities
                              </div>
                              <div className="h-1 bg-cyan-400 rounded w-full mb-1"></div>
                              <div className="h-1 bg-cyan-400 rounded w-3/4 mb-1"></div>
                            </div>
                            <div className="bg-gray-700/50 rounded p-2">
                              <div className="text-xs text-purple-300 mb-1">
                                Sentiment
                              </div>
                              <div className="h-1 bg-purple-400 rounded w-full mb-1"></div>
                              <div className="h-1 bg-purple-400 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeFeature === 3 && (
                        <div className="h-full flex flex-col">
                          <div className="flex-1 bg-gray-700/50 rounded-lg p-3 mb-2 text-left overflow-y-auto">
                            <h4 className="text-xs text-gray-400 mb-2">
                              Document Context:
                            </h4>
                            <p className="text-xs text-gray-300 mb-1">
                              "The contract specifies a 12-month term with
                              automatic renewal unless terminated with 30 days
                              written notice. Payment terms are net-30 with 2%
                              discount for net-10..."
                            </p>
                            <p className="text-xs text-gray-300">
                              "Section 4.2: Late payments incur 1.5% monthly
                              interest. Force majeure clauses cover..."
                            </p>
                          </div>
                          <div className="bg-blue-500/10 rounded-lg p-3 text-left border border-blue-500/30">
                            <div className="flex items-start">
                              <div className="w-4 h-4 bg-blue-400 rounded-full mr-2 mt-1 flex-shrink-0"></div>
                              <div>
                                <h4 className="text-xs text-blue-300 mb-1">
                                  User Question:
                                </h4>
                                <p className="text-xs text-blue-100 mb-2">
                                  What are the payment terms and late fees?
                                </p>
                                <h4 className="text-xs text-blue-300 mb-1">
                                  AI Answer:
                                </h4>
                                <p className="text-xs text-blue-100">
                                  • Net-30 terms with 2% discount for net-10{" "}
                                  <br />
                                  • 1.5% monthly interest on late payments{" "}
                                  <br />• Late fees apply after 30 days
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeFeature === 4 && (
                        <div className="h-full flex flex-col justify-center">
                          <div className="flex justify-center mb-3">
                            <FiEdit className="text-4xl sm:text-5xl text-green-400" />
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-lg p-3 mb-2">
                            <div className="h-2 bg-gray-600 rounded w-full mb-2"></div>
                            <div className="h-2 bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-600/50 rounded mt-3"></div>
                          </div>
                          <div className="flex justify-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                              DOCX
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                              PDF
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                              PPTX
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex space-x-1 sm:space-x-2 justify-center">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                        activeFeature === index
                          ? "bg-cyan-400"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-4 sm:mb-6">
                  {features[activeFeature].desc}
                </p>
                {features[activeFeature].features && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm sm:text-base font-medium text-cyan-300 mb-2">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {features[activeFeature].features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <span className="text-cyan-400 mr-2 mt-1">•</span>
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={handleTryFree}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-xs sm:text-sm md:text-base font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  {isAuthenticated ? "Try This Feature" : "Get Started Free"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            How <span className="text-cyan-400">SmartDoc AI</span> Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "1",
                title: "Upload Your Documents",
                desc: "Drag and drop your PDFs, Word files, or images. Our OCR handles even scanned documents.",
                icon: <FiUpload className="text-2xl" />,
              },
              {
                step: "2",
                title: "AI Processes Content",
                desc: "Our advanced algorithms extract text, analyze structure, and understand context.",
                icon: <FiFileText className="text-2xl" />,
              },
              {
                step: "3",
                title: "Interact & Generate",
                desc: "Ask questions, get summaries, or create new documents with simple prompts.",
                icon: <FiEdit className="text-2xl" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <div className="text-cyan-400 font-bold text-sm mb-1">
                  STEP {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Powerful Use Cases for{" "}
            <span className="text-cyan-400">Every Professional</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Legal Teams",
                desc: "Review contracts, extract clauses, and analyze legal documents in seconds.",
                color: "from-purple-500 to-indigo-600",
              },
              {
                title: "Researchers",
                desc: "Summarize papers, extract key findings, and generate literature reviews.",
                color: "from-cyan-500 to-blue-600",
              },
              {
                title: "Business Analysts",
                desc: "Process reports, extract insights, and generate executive summaries.",
                color: "from-green-500 to-teal-600",
              },
              {
                title: "Content Creators",
                desc: "Repurpose content, generate drafts, and create structured documents.",
                color: "from-pink-500 to-rose-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br rounded-xl p-6 backdrop-blur-sm h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div
                  className={`bg-gradient-to-br ${item.color} w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4`}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security assurance section - Mobile optimized */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <FiShield className="text-3xl sm:text-5xl mx-auto text-green-400 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
              Your Data Never Leaves Your Control
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto">
              We use end-to-end encryption and never store your documents longer
              than necessary. Your privacy is our top priority.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="px-2 sm:px-4 py-1 sm:py-2 bg-white/5 rounded-full border border-green-400/30 text-xs sm:text-sm text-green-400">
                GDPR Compliant
              </div>
              <div className="px-2 sm:px-4 py-1 sm:py-2 bg-white/5 rounded-full border border-blue-400/30 text-xs sm:text-sm text-blue-400">
                AES-256 Encryption
              </div>
              <div className="px-2 sm:px-4 py-1 sm:py-2 bg-white/5 rounded-full border border-purple-400/30 text-xs sm:text-sm text-purple-400">
                Zero-Knowledge
              </div>
              <div className="px-2 sm:px-4 py-1 sm:py-2 bg-white/5 rounded-full border border-cyan-400/30 text-xs sm:text-sm text-cyan-400">
                SOC 2 Certified
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section - Mobile optimized */}
      <section className="py-16 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-sm border border-white/10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Documents?
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 sm:mb-8">
              Join thousands of professionals who save hours every week with
              SmartDoc AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTryFree}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                {isAuthenticated
                  ? "Go to Dashboard"
                  : "Get Started - It's Free"}
              </button>
              <button
                onClick={handleHowItWorks}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm rounded-full text-sm sm:text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                See Live Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating particles background */}
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            */}

      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 8 + 3,
              height: Math.random() * 8 + 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 80],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SmartDocLanding;
