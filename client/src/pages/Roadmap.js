import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoadmapCard from '../components/RoadmapCard';

/**
 * Roadmap Page Component (UPGRADED)
 * Displays personalized learning roadmap based on skill gaps
 */
function Roadmap() {
  const navigate = useNavigate();
  const [roadmapTasks, setRoadmapTasks] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    // Retrieve prediction data from sessionStorage
    const storedPrediction = sessionStorage.getItem('predictionData');

    if (!storedPrediction) {
      navigate('/predictor');
      return;
    }

    const data = JSON.parse(storedPrediction);
    setPredictionData(data);
    setRoadmapTasks(data.roadmap_tasks || []);
  }, [navigate]);

  if (!predictionData) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading your roadmap...</p>
      </div>
    );
  }

  // Get unique categories
  const categories = ['All', ...new Set(roadmapTasks.map(task => task.category))];

  // Filter tasks by category
  const filteredTasks = activeCategory === 'All' 
    ? roadmapTasks 
    : roadmapTasks.filter(task => task.category === activeCategory);

  // Group tasks by category for display
  const groupedTasks = roadmapTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {});

  // Toggle task completion
  const toggleTaskComplete = (day) => {
    setCompletedTasks(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Category icons and colors
  const categoryStyles = {
    'Academic': { icon: '📚', color: '#8b5cf6', bg: '#8b5cf620' },
    'DSA': { icon: '💻', color: '#3b82f6', bg: '#3b82f620' },
    'Projects': { icon: '🚀', color: '#10b981', bg: '#10b98120' },
    'Communication': { icon: '🗣️', color: '#f59e0b', bg: '#f59e0b20' },
    'Career': { icon: '💼', color: '#ec4899', bg: '#ec489920' }
  };

  const getCategoryStyle = (category) => categoryStyles[category] || { icon: '📌', color: '#6b7280', bg: '#6b728020' };

  // Calculate progress
  const completedCount = completedTasks.length;
  const totalCount = roadmapTasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="roadmap-page">
      <div className="roadmap-container">
        <div className="roadmap-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>Your Personalized Learning Roadmap</h1>
          <p>AI-generated tasks based on your skill gaps</p>
        </div>

        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-card">
            <div className="progress-icon">🎯</div>
            <div className="progress-info">
              <h3>{totalCount}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          
          <div className="progress-card">
            <div className="progress-icon">✅</div>
            <div className="progress-info">
              <h3>{completedCount}</h3>
              <p>Completed</p>
            </div>
          </div>
          
          <div className="progress-card">
            <div className="progress-icon">📊</div>
            <div className="progress-info">
              <h3>{Object.keys(groupedTasks).length}</h3>
              <p>Categories</p>
            </div>
          </div>
          
          <div className="progress-card">
            <div className="progress-icon">⏱️</div>
            <div className="progress-info">
              <h3>{Math.ceil(totalCount / 3)} Weeks</h3>
              <p>Estimated Time</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="overall-progress">
          <div className="progress-header">
            <h3>Overall Progress</h3>
            <span className="progress-percentage">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="progress-bar-large">
            <div 
              className="progress-fill-large" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`filter-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category !== 'All' && (
                <span className="filter-icon">{getCategoryStyle(category).icon}</span>
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Roadmap Cards Grid */}
        <div className="roadmap-cards-grid">
          {filteredTasks.map((task, index) => (
            <div 
              key={index} 
              className={`roadmap-card-wrapper ${completedTasks.includes(task.day) ? 'completed' : ''}`}
              onClick={() => toggleTaskComplete(task.day)}
            >
              <RoadmapCard
                day={task.day}
                task={task.task}
                category={task.category}
                priority={task.priority}
                skillFocus={task.skill_focus}
                expectedImprovement={task.expected_improvement}
              />
              {completedTasks.includes(task.day) && (
                <div className="completed-overlay">
                  <span className="completed-check">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Category Summary */}
        <div className="category-summary">
          <h2>Tasks by Category</h2>
          <div className="category-cards">
            {Object.entries(groupedTasks).map(([category, tasks], index) => {
              const style = getCategoryStyle(category);
              const categoryCompleted = tasks.filter(t => completedTasks.includes(t.day)).length;
              return (
                <div key={index} className="category-card" style={{ borderColor: style.color }}>
                  <div className="category-header" style={{ backgroundColor: style.bg }}>
                    <span className="category-icon-large">{style.icon}</span>
                    <h3>{category}</h3>
                  </div>
                  <div className="category-body">
                    <p className="task-count">{tasks.length} tasks • {categoryCompleted} completed</p>
                    <div className="category-progress">
                      <div 
                        className="category-progress-fill" 
                        style={{ 
                          width: `${(categoryCompleted / tasks.length) * 100}%`,
                          backgroundColor: style.color 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h2>💡 Tips for Success</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">📅</span>
              <h4>Stay Consistent</h4>
              <p>Follow the roadmap daily for best results.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📝</span>
              <h4>Track Progress</h4>
              <p>Mark tasks as complete to see your improvement.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🔄</span>
              <h4>Reassess Regularly</h4>
              <p>Take the prediction test again after completing tasks.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🎯</span>
              <h4>Focus on Weak Areas</h4>
              <p>Prioritize tasks in categories where you scored lower.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="roadmap-actions">
          <Link to="/predictor" className="action-button secondary">
            <span>🔄</span>
            Retake Assessment
          </Link>
          <Link to="/dashboard" className="action-button primary">
            <span>📊</span>
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;
