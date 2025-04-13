import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./InsightVisualizations.css";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const InsightVisualizations = ({ insights }) => {
  // Document Quality Chart Data
  const qualityData = {
    labels: ["Content Quality", "Effectiveness", "Clarity", "Conciseness"],
    datasets: [
      {
        label: "Scores (%)",
        data: [
          insights.documentOverview.qualityScore,
          insights.documentOverview.effectivenessScore,
          insights.styleAnalysis.clarityScore,
          insights.styleAnalysis.concisenessScore,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sentiment Analysis Chart Data
  const sentimentData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          insights.sentimentAnalysis.positiveSentiment,
          insights.sentimentAnalysis.negativeSentiment,
          insights.sentimentAnalysis.neutralSentiment,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(201, 203, 207, 0.7)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="insights-container">
      {/* Document Header */}
      <div className="document-header">
        <h2 className="document-type">
          📄 {insights.documentType.toUpperCase()} ANALYSIS
        </h2>
        <p className="document-purpose">
          <strong>Main Purpose:</strong> {insights.documentOverview.mainPurpose}
        </p>
      </div>

      {/* Key Metrics Row - Now responsive grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Quality Score</h4>
          <div className="metric-value">
            {Math.round(insights.documentOverview.qualityScore)}%
          </div>
        </div>
        <div className="metric-card">
          <h4>Effectiveness</h4>
          <div className="metric-value">
            {Math.round(insights.documentOverview.effectivenessScore)}%
          </div>
        </div>
        <div className="metric-card">
          <h4>Readability</h4>
          <div className="metric-value">
            {insights.styleAnalysis.readabilityLevel}
          </div>
        </div>
        <div className="metric-card">
          <h4>Primary Tone</h4>
          <div className="metric-value">{insights.styleAnalysis.tone}</div>
        </div>
      </div>

      {/* Charts Row - Now stacked on mobile */}
      <div className="charts-container">
        <div className="chart-wrapper">
          <h4>📊 Document Quality Metrics</h4>
          <div className="chart-responsive-container">
            <Bar
              data={qualityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, max: 100 },
                },
              }}
            />
          </div>
        </div>
        <div className="chart-wrapper">
          <h4>🧠 Sentiment Analysis</h4>
          <div className="chart-responsive-container">
            <Doughnut
              data={sentimentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Analysis */}
      <div className="analysis-section">
        <h3>🔍 Content Analysis</h3>
        <div className="analysis-grid">
          <div className="analysis-column">
            <h4>✅ Strengths</h4>
            <ul className="styled-list">
              {insights.contentAnalysis.strengths.map((item, i) => (
                <li key={`strength-${i}`}>
                  <strong>• {item}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="analysis-column">
            <h4>⚠️ Weaknesses</h4>
            <ul className="styled-list">
              {insights.contentAnalysis.weaknesses.map((item, i) => (
                <li key={`weakness-${i}`}>
                  <strong>• {item}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Key Entities */}
      <div className="entities-section">
        <h3>🔑 Key Entities & Terms</h3>
        <div className="entity-tags-container">
          {insights.entities.keyTerms.map((term, i) => (
            <span key={`term-${i}`} className="entity-tag">
              {term}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3>💡 Professional Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <h4>Content Improvements</h4>
            <ul className="styled-list">
              {insights.recommendations.content.map((item, i) => (
                <li key={`content-rec-${i}`}>
                  <strong>• {item}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="recommendation-card">
            <h4>Structural Suggestions</h4>
            <ul className="styled-list">
              {insights.recommendations.structure.map((item, i) => (
                <li key={`struct-rec-${i}`}>
                  <strong>• {item}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightVisualizations;
