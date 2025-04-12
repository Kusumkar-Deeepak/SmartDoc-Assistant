import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaCompass, FaHome, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { RiErrorWarningFill } from "react-icons/ri";
import { TbError404 } from "react-icons/tb";

const NotFound = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const rocketVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl w-full text-center"
      >
        {/* Animated 404 Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <TbError404 className="text-9xl text-indigo-600 opacity-20" />
            <RiErrorWarningFill className="text-6xl text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {/* Floating Rocket Animation */}
        <motion.div variants={rocketVariants} animate="float" className="mb-10">
          <FaRocket className="text-6xl text-purple-500 mx-auto" />
        </motion.div>

        {/* Main Message */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-bold text-gray-800 mb-6"
        >
          Lost in Space?
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          The page you're looking for doesn't exist or has been moved. Don't
          worry, we'll help you find your way back!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <Link
            to="/"
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1"
          >
            <FaHome className="mr-2" />
            Return Home
          </Link>
          <Link
            to="/contact"
            className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-900 transition transform hover:-translate-y-1"
          >
            <FaCompass className="mr-2" />
            Get Help
          </Link>
        </motion.div>

        {/* Animated Search Illustration */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full px-6 py-4 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition">
                <FaSearch className="text-xl" />
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Try searching for what you need or check out our{" "}
            <Link to="/sitemap" className="text-indigo-600 hover:underline">
              sitemap
            </Link>
          </p>
        </motion.div>

        {/* Fun Animated Elements */}
        <motion.div
          variants={containerVariants}
          className="flex justify-center space-x-6 mt-12"
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <motion.div
              key={item}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: item * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  },
                },
                hover: { scale: 1.1 },
              }}
              whileHover="hover"
              className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-indigo-500 cursor-pointer"
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
