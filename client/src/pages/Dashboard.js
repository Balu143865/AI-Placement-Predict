import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ReadinessMeter from '../components/ReadinessMeter';
import WeakSkillCard from '../components/WeakSkillCard';
import RoadmapCard from '../components/RoadmapCard';
import AIInsightsPanel from '../components/AIInsightsPanel';
import RecommendationLevelCard from '../components/RecommendationLevelCard';
import AnimatedCard from '../components/AnimatedCard';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/**
 * Dashboard Page Component (PRO VERSION)
 * Professional AI Analytics Dashboard with advanced features
 */
function Dashboard() {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Retrieve prediction data from sessionStorage
    const storedPrediction = sessionStorage.getItem('predictionData');
    const storedForm = sessionStorage.getItem('formData');

    if (!storedPrediction) {
      navigate('/predictor');
      return;
    }

    setPredictionData(JSON.parse(storedPrediction));
    setFormData(JSON.parse(storedForm));
  }, [navigate]);

  if (!predictionData || !formData) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading your AI analysis...</p>
      </div>
    );
  }

  const { 
    prediction, 
    readiness_score, 
    weak_skills, 
    skill_analysis, 
    roadmap_tasks,
    recommendation_level,
    ai_recommendations,
    strongest_skill,
    weakest_skill,
    placement_category,
    placement_probability
  } = predictionData;
  
  // Handle both response formats: prediction.placement_probability or direct placement_probability
  // Add fallback to 0 if undefined
  const probability = prediction?.placement_probability ?? placement_probability ?? 0;
  
  // Ensure readiness_score has a default value
  const readinessScore = readiness_score ?? 0;

  // Chart data for skill comparison (User vs Ideal)
  const skillLabels = ['CGPA', 'DSA Skills', 'Projects', 'Communication', 'Internships'];
  const userScores = skill_analysis?.scores ? Object.values(skill_analysis.scores) : [];
  const idealScores = skill_analysis?.ideal_scores ? Object.values(skill_analysis.ideal_scores) : [];
  
  const comparisonChartData = {
    labels: skillLabels,
    datasets: [
      {
        label: 'Your Score',
        data: userScores,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Ideal Score',
        data: idealScores,
        backgroundColor: 'rgba(74, 222, 128, 0.6)',
        borderColor: '#4ade80',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const comparisonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#9ca3af',
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Skills vs Ideal Benchmarks',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#9ca3af',
          callback: (value) => `${value}%`
        },
        grid: {
          color: '#374151'
        }
      },
      x: {
        ticks: {
          color: '#9ca3af'
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Doughnut chart for placement probability
  const doughnutData = {
    labels: ['Placement Probability', 'Gap'],
    datasets: [
      {
        data: [probability, 100 - probability],
        backgroundColor: [
          probability >= 70 ? '#4ade80' : probability >= 40 ? '#fbbf24' : '#f87171',
          '#374151'
        ],
        borderColor: [
          probability >= 70 ? '#22c55e' : probability >= 40 ? '#f59e0b' : '#ef4444',
          '#1f2937'
        ],
        borderWidth: 2,
        cutout: '75%'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    }
  };

  // Get probability status
  const getProbabilityStatus = () => {
    if (probability >= 70) return { text: 'High', color: '#4ade80', icon: '🎯' };
    if (probability >= 40) return { text: 'Medium', color: '#fbbf24', icon: '📈' };
    return { text: 'Low', color: '#f87171', icon: '⚠️' };
  };

  const status = getProbabilityStatus();

  return (
    <div className="dashboard-page pro-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link to="/predictor" className="back-link">← New Prediction</Link>
          <h1>AI Analytics Dashboard</h1>
          <p>Professional placement readiness analysis powered by AI</p>
        </div>

        {/* ============================================
            TOP SECTION: Main Metrics
            ============================================ */}
        <div className="top-metrics-section">
          {/* Placement Probability Card */}
          <AnimatedCard delay={100} className="metric-card glass-card">
            <div className="metric-header">
              <span className="metric-icon">🎯</span>
              <h3>Placement Probability</h3>
            </div>
            <div className="metric-body">
              <div className="probability-display">
                <span className="probability-value" style={{ color: status.color }}>
                  {probability.toFixed(1)}%
                </span>
                <span className="probability-status" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                  {status.icon} {status.text}
                </span>
              </div>
              <div className="probability-chart-mini">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
            <div className="metric-footer">
              <span className="confidence-label">Confidence: </span>
              <span className="confidence-value">{prediction?.confidence || 'High'}</span>
            </div>
          </AnimatedCard>

          {/* Readiness Score Meter */}
          <AnimatedCard delay={200} className="metric-card glass-card">
            <div className="metric-header">
              <span className="metric-icon">📊</span>
              <h3>Readiness Score</h3>
            </div>
            <div className="metric-body center-content">
              <ReadinessMeter score={readinessScore} size={180} />
            </div>
            <div className="metric-footer">
              <span className="score-formula">Weighted skill analysis</span>
            </div>
          </AnimatedCard>

          {/* Recommendation Level Card */}
          <AnimatedCard delay={300} className="metric-card glass-card">
            <div className="metric-header">
              <span className="metric-icon">🤖</span>
              <h3>AI Recommendation</h3>
            </div>
            <div className="metric-body">
              <RecommendationLevelCard
                level={recommendation_level?.level || 'Analyzing...'}
                color={recommendation_level?.color || '#6b7280'}
                icon={recommendation_level?.icon || '🤖'}
                message={recommendation_level?.message || 'Processing your profile...'}
                urgency={recommendation_level?.urgency || 'Medium'}
              />
            </div>
          </AnimatedCard>

          {/* AI Insights Panel */}
          <AnimatedCard delay={400} className="metric-card glass-card">
            <AIInsightsPanel
              strongestSkill={strongest_skill || 'N/A'}
              weakestSkill={weakest_skill || 'N/A'}
              placementCategory={placement_category || 'N/A'}
            />
          </AnimatedCard>
        </div>

        {/* ============================================
            MIDDLE SECTION: Skills Chart
            ============================================ */}
        <AnimatedCard delay={500} className="chart-section glass-card">
          <h2>Skill Comparison Analysis</h2>
          <p className="section-subtitle">Your skills compared to ideal placement benchmarks</p>
          <div className="chart-container-large">
            <Bar data={comparisonChartData} options={comparisonChartOptions} />
          </div>
        </AnimatedCard>

        {/* ============================================
            AI RECOMMENDATIONS PANEL
            ============================================ */}
        <AnimatedCard delay={600} className="ai-recommendations-section glass-card">
          <div className="section-header">
            <span className="section-icon">🤖</span>
            <h2>AI Recommendations</h2>
          </div>
          <p className="section-subtitle">Smart suggestions based on your profile analysis</p>
          
          <div className="ai-recommendations-grid">
            {ai_recommendations && ai_recommendations.map((rec, index) => (
              <div key={index} className="ai-recommendation-item">
                <span className="rec-number">{index + 1}</span>
                <span className="rec-text">{rec}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* ============================================
            SKILL GAPS DETAILED VIEW
            ============================================ */}
        {skill_analysis.skill_gaps && skill_analysis.skill_gaps.length > 0 && (
          <AnimatedCard delay={700} className="skill-gaps-section">
            <h2>Skill Gap Analysis</h2>
            <p className="section-subtitle">Detailed breakdown of areas needing improvement</p>
            <div className="skill-gaps-grid">
              {skill_analysis.skill_gaps.map((gap, index) => (
                <WeakSkillCard
                  key={index}
                  skill={gap.skill}
                  current={gap.current}
                  ideal={gap.ideal}
                  gap={gap.gap}
                  severity={gap.severity}
                />
              ))}
            </div>
          </AnimatedCard>
        )}

        {/* ============================================
            SMART ROADMAP PREVIEW
            ============================================ */}
        <AnimatedCard delay={800} className="roadmap-preview-section glass-card">
          <div className="section-header">
            <span className="section-icon">🗺️</span>
            <h2>Your Learning Roadmap</h2>
          </div>
          <p className="section-subtitle">AI-generated tasks based on your skill gaps</p>
          
          <div className="roadmap-cards-grid">
            {roadmap_tasks.slice(0, 6).map((task, index) => (
              <RoadmapCard
                key={index}
                day={task.day}
                task={task.task}
                category={task.category}
                priority={task.priority}
                skillFocus={task.skill_focus}
                expectedImprovement={task.expected_improvement}
              />
            ))}
          </div>
          
          <Link to="/roadmap" className="view-full-roadmap-btn">
            View Full Roadmap
            <span className="button-arrow">→</span>
          </Link>
        </AnimatedCard>

        {/* ============================================
            INPUT SUMMARY
            ============================================ */}
        <AnimatedCard delay={900} className="input-summary glass-card">
          <h3>Your Input Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">CGPA</span>
              <span className="summary-value">{formData.cgpa}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">DSA Score</span>
              <span className="summary-value">{formData.dsa_score}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Projects</span>
              <span className="summary-value">{formData.projects}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Communication</span>
              <span className="summary-value">{formData.communication}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Internships</span>
              <span className="summary-value">{formData.internships}</span>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}

export default Dashboard;
