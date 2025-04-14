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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SmartDocLanding = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      title: "AI-Powered Document Understanding",
      desc: "Your files come alive with our intelligent analysis",
      icon: <FiFileText className="text-3xl" />,
    },
    {
      title: "Instant Summarization",
      desc: "Get key points from lengthy documents in seconds",
      icon: <FiMessageSquare className="text-3xl" />,
    },
    {
      title: "Military-Grade Security",
      desc: "End-to-end encryption for all your documents",
      icon: <FiShield className="text-3xl" />,
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
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white"
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
            Your documents aren't just files—they're conversations waiting to
            happen.
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
            EXPLORE
          </span>

          <div className="relative h-10 sm:h-12 w-4 sm:w-6">
            {/* Main scroll track */}
            <div className="absolute inset-0 mx-auto w-0.5 bg-gray-400/30 rounded-full"></div>

            {/* Animated scroll thumb */}
            <motion.div
              className="absolute left-1/2 w-1.5 sm:w-2 h-4 sm:h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full -translate-x-1/2"
              initial={{ y: 0 }}
              animate={{
                y: 12,
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            />
          </div>
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
          Your Documents, <span className="text-cyan-400">Supercharged</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm ${
                activeFeature === index
                  ? "bg-white/10 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveFeature(index)}
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                {feature.desc}
              </p>
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
                SmartDoc AI - Document Analysis
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className="h-48 sm:h-64 bg-gray-800 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      {activeFeature === 0 && (
                        <div className="p-2 sm:p-4">
                          <FiUpload className="text-3xl sm:text-5xl mx-auto text-cyan-400 mb-2 sm:mb-4" />
                          <p className="text-xs sm:text-base">
                            Upload any document to begin
                          </p>
                        </div>
                      )}
                      {activeFeature === 1 && (
                        <div className="p-2 sm:p-4">
                          <div className="bg-gray-700/50 rounded-lg p-2 sm:p-4 mb-2 sm:mb-3 text-left">
                            <div className="h-1 sm:h-2 bg-gray-600 rounded w-3/4 mb-1 sm:mb-2"></div>
                            <div className="h-1 sm:h-2 bg-gray-600 rounded w-1/2"></div>
                          </div>
                          <div className="bg-cyan-500/10 rounded-lg p-2 sm:p-4 text-left border border-cyan-500/30">
                            <div className="h-1 sm:h-2 bg-cyan-400 rounded w-full mb-1 sm:mb-2"></div>
                            <div className="h-1 sm:h-2 bg-cyan-400 rounded w-2/3"></div>
                          </div>
                        </div>
                      )}
                      {activeFeature === 2 && (
                        <div className="p-2 sm:p-4">
                          <div className="flex items-center justify-center mb-2 sm:mb-3">
                            <FiShield className="text-3xl sm:text-5xl text-green-400 mr-2 sm:mr-3" />
                            <div className="text-left">
                              <div className="h-1 sm:h-2 bg-green-400 rounded w-12 sm:w-16 mb-1 sm:mb-2"></div>
                              <div className="h-1 sm:h-2 bg-green-400 rounded w-8 sm:w-12"></div>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm">256-bit encryption active</p>
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
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        activeFeature === index ? "bg-cyan-400" : "bg-gray-600"
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
                <button
                  onClick={handleTryFree}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-xs sm:text-sm md:text-base font-medium"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Learn More"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
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
            <button
              onClick={handleTryFree}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started - It's Free"}
            </button>
          </motion.div>
        </div>
      </section>

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