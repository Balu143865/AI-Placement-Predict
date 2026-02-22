import React from 'react';

/**
 * WeakSkillCard Component
 * Displays a weak skill with gap analysis and improvement suggestion
 */
function WeakSkillCard({ skill, current, ideal, gap, severity, icon }) {
  // Get severity color
  const getSeverityColor = () => {
    switch (severity) {
      case 'High': return '#f87171';
      case 'Medium': return '#fbbf24';
      case 'Low': return '#4ade80';
      default: return '#6b7280';
    }
  };
  
  // Get skill icon
  const getSkillIcon = () => {
    const icons = {
      'DSA Skills': '💻',
      'Communication': '🗣️',
      'Projects': '🚀',
      'CGPA': '📚',
      'Internships': '💼'
    };
    return icon || icons[skill] || '📌';
  };
  
  const color = getSeverityColor();
  const progressPercentage = Math.min(100, (current / ideal) * 100);
  
  return (
    <div className="weak-skill-card" style={{ borderColor: color }}>
      <div className="weak-skill-header">
        <span className="weak-skill-icon">{getSkillIcon()}</span>
        <h4 className="weak-skill-name">{skill}</h4>
        <span className="severity-badge" style={{ backgroundColor: `${color}20`, color }}>
          {severity}
        </span>
      </div>
      
      <div className="weak-skill-progress">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: color
            }}
          />
        </div>
        <div className="progress-labels">
          <span className="current-value">Current: {current}</span>
          <span className="ideal-value">Ideal: {ideal}</span>
        </div>
      </div>
      
      <div className="gap-info">
        <span className="gap-label">Gap:</span>
        <span className="gap-value" style={{ color }}>{gap} points</span>
      </div>
      
      <div className="improvement-hint">
        <span className="hint-icon">💡</span>
        <span>Focus on this skill to improve your placement chances</span>
      </div>
    </div>
  );
}

export default WeakSkillCard;
