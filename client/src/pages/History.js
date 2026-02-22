import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import AuthContext from '../context/AuthContext';
import AnimatedCard from '../components/AnimatedCard';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * History Page Component
 * Shows user's prediction history with analytics
 */
const History = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchAnalytics();
  }, []);

  // Use environment variable for API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.data);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data.data);
    } catch (err) {
      console.error('Failed to load analytics');
    }
  };

  const deletePrediction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter(p => p._id !== id));
      if (selectedPrediction && selectedPrediction._id === id) {
        setSelectedPrediction(null);
      }
    } catch (err) {
      alert('Failed to delete prediction');
    }
  };

  // Chart configuration - with safety checks
  const chartData = analytics && analytics.trend && Array.isArray(analytics.trend) && analytics.trend.length > 0 ? {
    labels: analytics.trend.map((item, index) => `#${index + 1}`),
    datasets: [
      {
        label: 'Readiness Score',
        data: analytics.trend.map(item => item.score ?? 0),
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: '#6366f1',
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#6366f1',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Score: ${context.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9ca3af',
          callback: (value) => `${value}%`
        }
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div className="header-content">
          <h1>📊 Prediction History</h1>
          <p>Track your placement readiness journey</p>
        </div>
        <Link to="/predictor" className="new-prediction-btn">
          + New Prediction
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Analytics Summary */}
      {analytics && (
        <div className="analytics-summary">
          <AnimatedCard delay={0}>
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>{analytics.total_predictions ?? 0}</h3>
                <p>Total Predictions</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={100}>
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <div className="summary-content">
                <h3>{analytics.averages?.avgReadinessScore?.toFixed(1) ?? 0}%</h3>
                <p>Avg Readiness</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>{analytics.averages?.avgPlacementProbability?.toFixed(1) ?? 0}%</h3>
                <p>Avg Probability</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={300}>
            <div className="summary-card">
              <div className={`summary-icon ${analytics.improvement?.direction ?? ''}`}>
                {analytics.improvement?.direction === 'up' ? '⬆️' : 
                 analytics.improvement?.direction === 'down' ? '⬇️' : '➡️'}
              </div>
              <div className="summary-content">
                <h3>{analytics.improvement?.value > 0 ? '+' : ''}{analytics.improvement?.value ?? 0}%</h3>
                <p>Progress</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      )}

      {/* Progress Chart */}
      {chartData ? (
        <AnimatedCard delay={400}>
          <div className="chart-container glass-card">
            <h2>📈 Readiness Score Trend</h2>
            <div className="chart-wrapper">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </AnimatedCard>
      ) : (
        history.length > 0 && (
          <AnimatedCard delay={400}>
            <div className="chart-container glass-card">
              <h2>📈 Readiness Score Trend</h2>
              <div className="no-chart-data">
                <p>Make at least 2 predictions to see your progress trend!</p>
              </div>
            </div>
          </AnimatedCard>
        )
      )}

      {/* History List */}
      <div className="history-list-section">
        <h2>📋 All Predictions</h2>
        
        {history.length === 0 ? (
          <div className="no-history glass-card">
            <div className="no-history-icon">📭</div>
            <h3>No Predictions Yet</h3>
            <p>Start your first prediction to see your history here.</p>
            <Link to="/predictor" className="start-btn">
              Start Prediction
            </Link>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((prediction, index) => (
              <AnimatedCard key={prediction._id} delay={index * 50}>
                <div 
                  className={`history-card glass-card ${selectedPrediction?._id === prediction._id ? 'selected' : ''}`}
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <div className="history-card-header">
                    <span className="prediction-number">#{history.length - index}</span>
                    <span className="prediction-date">{formatDate(prediction.createdAt)}</span>
                  </div>
                  
                  <div className="history-card-scores">
                    <div className="score-item">
                      <span className="score-label">Readiness</span>
                      <span className="score-value readiness">{(prediction.readiness_score ?? 0).toFixed(1)}%</span>
                    </div>
                    <div className="score-item">
                      <span className="score-label">Probability</span>
                      <span className="score-value probability">{(prediction.placement_probability ?? 0).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="history-card-skills">
                    <div className="skill-mini">
                      <span>CGPA</span>
                      <span>{prediction.cgpa}</span>
                    </div>
                    <div className="skill-mini">
                      <span>DSA</span>
                      <span>{prediction.dsa_score}</span>
                    </div>
                    <div className="skill-mini">
                      <span>Projects</span>
                      <span>{prediction.projects}</span>
                    </div>
                    <div className="skill-mini">
                      <span>Comm</span>
                      <span>{prediction.communication}</span>
                    </div>
                    <div className="skill-mini">
                      <span>Intern</span>
                      <span>{prediction.internships}</span>
                    </div>
                  </div>

                  <div className="history-card-actions">
                    <button 
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPrediction(prediction);
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePrediction(prediction._id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>

      {/* Selected Prediction Details Modal */}
      {selectedPrediction && (
        <div className="prediction-modal-overlay" onClick={() => setSelectedPrediction(null)}>
          <div className="prediction-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPrediction(null)}>×</button>
            
            <h2>Prediction Details</h2>
            <p className="modal-date">{formatDate(selectedPrediction.createdAt)}</p>

            <div className="modal-scores">
              <div className="modal-score-card">
                <h3>Readiness Score</h3>
                <div className="modal-score-value">{(selectedPrediction.readiness_score ?? 0).toFixed(1)}%</div>
              </div>
              <div className="modal-score-card">
                <h3>Placement Probability</h3>
                <div className="modal-score-value">{(selectedPrediction.placement_probability ?? 0).toFixed(1)}%</div>
              </div>
            </div>

            <div className="modal-inputs">
              <h3>Input Data</h3>
              <div className="input-grid">
                <div className="input-item">
                  <span>CGPA</span>
                  <strong>{selectedPrediction.cgpa}</strong>
                </div>
                <div className="input-item">
                  <span>DSA Score</span>
                  <strong>{selectedPrediction.dsa_score}</strong>
                </div>
                <div className="input-item">
                  <span>Projects</span>
                  <strong>{selectedPrediction.projects}</strong>
                </div>
                <div className="input-item">
                  <span>Communication</span>
                  <strong>{selectedPrediction.communication}</strong>
                </div>
                <div className="input-item">
                  <span>Internships</span>
                  <strong>{selectedPrediction.internships}</strong>
                </div>
              </div>
            </div>

            {selectedPrediction.recommendation_level && (
              <div className="modal-recommendation">
                <h3>Recommendation</h3>
                <div 
                  className="recommendation-badge"
                  style={{ borderColor: selectedPrediction.recommendation_level.color }}
                >
                  <span className="rec-icon">{selectedPrediction.recommendation_level.icon}</span>
                  <span className="rec-level">{selectedPrediction.recommendation_level.level}</span>
                </div>
                <p>{selectedPrediction.recommendation_level.message}</p>
              </div>
            )}

            {selectedPrediction.ai_recommendations && selectedPrediction.ai_recommendations.length > 0 && (
              <div className="modal-ai-recs">
                <h3>AI Recommendations</h3>
                <ul>
                  {selectedPrediction.ai_recommendations.slice(0, 5).map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-actions">
              <Link 
                to="/roadmap" 
                state={{ prediction: selectedPrediction }}
                className="view-roadmap-btn"
              >
                View Full Roadmap
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;