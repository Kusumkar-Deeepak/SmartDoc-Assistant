import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FiUpload,
  FiSearch,
  FiFileText,
  FiMessageSquare,
  FiShield,
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiMoon,
  FiSun,
  FiBell,
  FiGlobe,
  FiBookOpen,
} from "react-icons/fi";
import UploadExtract from "../components/Dashboard-Components/UploadExtract";
import Summarize from "../components/Dashboard-Components/Summarize";
import AIQnA from "../components/Dashboard-Components/AIQnA";
import InsightMirror from "../components/Dashboard-Components/InsightMirror";
import SmartWriter from "../components/Dashboard-Components/SmartWriter";

const Dashboard = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth0();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  const { darkMode, setDarkMode } = useTheme();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const tabs = [
    {
      id: "upload",
      name: "Upload & Extract",
      icon: <FiUpload />,
      component: <UploadExtract />,
    },
    {
      id: "summarize",
      name: "Summarize",
      icon: <FiMessageSquare />,
      component: <Summarize />,
    },
    {
      id: "search",
      name: "Insight Mirror",
      icon: <FiSearch />,
      component: <InsightMirror />,
    },
    { id: "qa", name: "AI Q&A", icon: <FiFileText />, component: <AIQnA /> },
    {
      id: "generate",
      name: "SmartWriter",
      icon: <FiBookOpen />,
      component: <SmartWriter />,
    },
  ];

  const extractNameFromEmail = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    const cleanName = username.replace(/[^a-zA-Z]/g, " ");
    return (
      cleanName
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "User"
    );
  };

  const getUserPicture = () => {
    if (user?.picture) return user.picture;
    if (user?.email) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        extractNameFromEmail(user.email)
      )}&background=6366f1&color=fff`;
    }
    return `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff`;
  };

  const getUserName = () => {
    if (user?.name && !user.name.includes("@")) return user.name;
    if (user?.email) return extractNameFromEmail(user.email);
    return "User";
  };

  function howToUse() {
    navigate("/how-to-use");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:relative bg-indigo-800 text-white`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          <h1 className="text-xl font-semibold">SmartDoc AI</h1>
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-700">
            <img
              src={getUserPicture()}
              alt="User"
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  getUserName()
                )}&background=6366f1&color=fff`;
              }}
            />
            <div>
              <p className="font-medium">{getUserName()}</p>
              <p className="text-[11px] text-indigo-200">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-left ${
                activeTab === tab.id ? "bg-indigo-700" : "hover:bg-indigo-700"
              } transition-colors`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-indigo-700 rounded transition-colors"
          >
            <FiUser className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-600"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
              {tabs.find((t) => t.id === activeTab)?.name}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={howToUse}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <FiHelpCircle size={20} />
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <FiSettings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              {tabs.find((t) => t.id === activeTab)?.component}
            </div>
          </div>
        </main>
      </div>
      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white dark:bg-gray-900 dark:text-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
                <h3 className="text-xl font-semibold">Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-5 overflow-y-auto space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? <FiSun /> : <FiMoon />}
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      darkMode ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500 }}
                      className="w-4 h-4 bg-white rounded-full shadow"
                      animate={{ x: darkMode ? 24 : 0 }}
                    />
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiBell />
                    <span className="font-medium">Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>

                {/* Language Selector */}
                <div className="flex items-center gap-3">
                  <FiGlobe />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white border dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
