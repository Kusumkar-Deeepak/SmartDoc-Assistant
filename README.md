<h1 align="center" id="title">SmartDoc-AI 📄✨</h1>

<p align="center" id="description">Your Intelligent AI-powered Document Processing Assistant. Extract, analyze, summarize, and interact with documents using cutting-edge technology.</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/badge/Frontend-React-blue" alt="frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js-brightgreen" alt="backend">
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-blueviolet" alt="tailwind">
  <img src="https://img.shields.io/badge/Auth-Auth0-orange" alt="auth">
</p>

<br/>

<p align="center">
  <img src="https://via.placeholder.com/1200x400?text=SmartDoc-AI+Banner" alt="SmartDoc-AI Banner">
</p>

## 🚀 Demo

👉 [Live Demo](http://localhost:5147)

---

## 🌟 Features

- 📤 Upload & Extract text from **PDF, DOCX, TXT, JPG, PNG**
- 🧠 **AI Summarization** with text-to-speech and one-click copy
- 🔍 **Insight Mirror**: Analyze sentiment, bias, and extract key entities
- 💬 **Ask Questions** and get AI-powered answers from documents
- 📂 **Secure Document Management** (password protection, download/delete)
- 🎨 **Dark/Light Theme** with system preference detection
- 🔐 Auth0 Integration (Email/Password, Google, GitHub login)
- 📊 Visual analytics with interactive graphs/charts

---

## 📸 Screenshots

> Add real screenshots later

<img src="https://via.placeholder.com/800x400?text=Upload+Document+UI" width="600" height="300">
<img src="https://via.placeholder.com/800x400?text=AI+Summary+Feature" width="600" height="300">

---

## 🛠️ Tech Stack

**Frontend:**

- ⚛️ React.js
- ⚡ Vite
- 🎨 Tailwind CSS
- 🌀 Framer Motion
- 🧩 React Icons

**Backend:**

- 🟩 Node.js
- 🚀 Express.js
- 🔐 Auth0 (authentication)
- 🧠 Google Gemini / PaLM API for AI features

---## ⚙️ Installation Guide

Follow the steps below to set up the project locally:

### 🔧 Prerequisites

- Node.js (v16+)
- npm or yarn
- Auth0 credentials (Client ID, Domain, etc.)
- Gemini API Key or OpenAI key (optional for AI features)

### 🛠️ Local Setup

```bash
# Clone the repository
git clone https://github.com/Kusumkar-Deeepak/smartdoc-ai.git

# Navigate into the project directory
cd smartdoc-ai

# Install dependencies
npm install

# Create a .env file based on .env.example
cp .env.example .env

# Start the development server
npm run dev
