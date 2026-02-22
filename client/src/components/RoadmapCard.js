import React from 'react';

/**
 * RoadmapCard Component
 * Displays a single roadmap task with category and expected improvement
 */
function RoadmapCard({ day, task, category, priority, skillFocus, expectedImprovement }) {
  // Get category color
  const getCategoryColor = () => {
    const colors = {
      'DSA': '#3b82f6',
      'Communication': '#f59e0b',
      'Projects': '#10b981',
      'Academic': '#8b5cf6',
      'Career': '#ec4899'
    };
    return colors[category] || '#6b7280';
  };
  
  // Get category icon
  const getCategoryIcon = () => {
    const icons = {
      'DSA': '💻',
      'Communication': '🗣️',
      'Projects': '🚀',
      'Academic': '📚',
      'Career': '💼'
    };
    return icons[category] || '📌';
  };
  
  const color = getCategoryColor();
  
  return (
    <div className="roadmap-card" style={{ borderLeftColor: color }}>
      <div className="roadmap-card-header">
        <div className="day-badge" style={{ backgroundColor: color }}>
          Day {day}
        </div>
        <div className="category-badge" style={{ backgroundColor: `${color}20`, color }}>
          <span className="category-icon">{getCategoryIcon()}</span>
          {category}
        </div>
      </div>
      
      <p className="roadmap-task-text">{task}</p>
      
      <div className="roadmap-card-footer">
        {skillFocus && (
          <div className="skill-focus">
            <span className="focus-label">Focus:</span>
            <span className="focus-value">{skillFocus}</span>
          </div>
        )}
        {expectedImprovement && (
          <div className="expected-improvement">
            <span className="improvement-icon">📈</span>
            <span>{expectedImprovement}</span>
          </div>
        )}
      </div>
      
      <button className="mark-complete-btn">
        <span className="check-icon">✓</span>
        Mark Complete
      </button>
    </div>
  );
}

export default RoadmapCard;
