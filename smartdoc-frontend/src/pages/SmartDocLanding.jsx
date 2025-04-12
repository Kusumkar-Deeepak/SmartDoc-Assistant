import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiFileText,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SmartDocLanding = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
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
      {/* Header Section */}
      <header className="relative h-screen flex flex-col items-center justify-center px-4">
        {/* Floating documents */}
        <motion.div
          className="absolute top-1/4 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiFileText className="text-2xl text-cyan-300" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-20 w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-xl shadow-xl flex items-center justify-center"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <FiUpload className="text-3xl text-blue-300" />
        </motion.div>

        {/* AI Assistant Character */}
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <div className="w-6 h-6 bg-white rounded-full absolute top-4 left-4"></div>
            <div className="w-6 h-6 bg-white rounded-full absolute top-4 right-4"></div>
            <div className="w-16 h-8 bg-white/30 rounded-full absolute bottom-4 left-4"></div>
          </div>
        </motion.div>

        {/* Main hero content */}
        <div className="text-center z-10">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SmartDoc AI
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-gray-300"
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
          >
            <button
              onClick={handleTryFree}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 mr-4"
            >
              {isAuthenticated ? "Go to Dashboard" : "Try It Free"}
            </button>
            <button
              onClick={handleHowItWorks}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              See How It Works
            </button>
          </motion.div>
        </div>

        {/* Modern Scroll Indicator Animation */}
        <motion.div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-gray-400 mb-3 text-sm font-light tracking-wider">
            EXPLORE
          </span>

          <div className="relative h-12 w-6">
            {/* Main scroll track */}
            <div className="absolute inset-0 mx-auto w-0.5 bg-gray-400/30 rounded-full"></div>

            {/* Animated scroll thumb */}
            <motion.div
              className="absolute left-1/2 w-2 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full -translate-x-1/2"
              initial={{ y: 0 }}
              animate={{
                y: 18,
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            />

            {/* Pulsing dot at bottom */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </div>
        </motion.div>
      </header>

      {/* Features section */}
      <section
        id="features"
        className="py-20 px-4 max-w-6xl mx-auto"
        ref={containerRef}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Your Documents, <span className="text-cyan-400">Supercharged</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-2xl backdrop-blur-sm ${
                activeFeature === index
                  ? "bg-white/10 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveFeature(index)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 text-white">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive demo preview */}
        <motion.div
          className="mt-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 text-gray-400">
                SmartDoc AI - Document Analysis
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="h-64 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
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
                        <div className="p-4">
                          <FiUpload className="text-5xl mx-auto text-cyan-400 mb-4" />
                          <p>Upload any document to begin</p>
                        </div>
                      )}
                      {activeFeature === 1 && (
                        <div className="p-4">
                          <div className="bg-gray-700/50 rounded-lg p-4 mb-3 text-left">
                            <div className="h-2 bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                          </div>
                          <div className="bg-cyan-500/10 rounded-lg p-4 text-left border border-cyan-500/30">
                            <div className="h-2 bg-cyan-400 rounded w-full mb-2"></div>
                            <div className="h-2 bg-cyan-400 rounded w-2/3"></div>
                          </div>
                        </div>
                      )}
                      {activeFeature === 2 && (
                        <div className="p-4">
                          <div className="flex items-center justify-center mb-3">
                            <FiShield className="text-5xl text-green-400 mr-3" />
                            <div className="text-left">
                              <div className="h-2 bg-green-400 rounded w-16 mb-2"></div>
                              <div className="h-2 bg-green-400 rounded w-12"></div>
                            </div>
                          </div>
                          <p className="text-sm">256-bit encryption active</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-3 h-3 rounded-full ${
                        activeFeature === index ? "bg-cyan-400" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {features[activeFeature].desc}
                </p>
                <button
                  onClick={handleTryFree}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Learn More"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Security assurance section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FiShield className="text-5xl mx-auto text-green-400 mb-6" />
            <h2 className="text-3xl font-bold mb-6">
              Your Data Never Leaves Your Control
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We use end-to-end encryption and never store your documents longer
              than necessary. Your privacy is our top priority.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-full border border-green-400/30 text-green-400">
                GDPR Compliant
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full border border-blue-400/30 text-blue-400">
                AES-256 Encryption
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full border border-purple-400/30 text-purple-400">
                Zero-Knowledge Architecture
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-3xl p-8 backdrop-blur-sm border border-white/10"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Documents?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who save hours every week with
              SmartDoc AI
            </p>
            <button
              onClick={handleTryFree}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started - It's Free"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
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
