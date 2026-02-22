import React from 'react';

/**
 * RecommendationLevelCard Component
 * Displays the AI recommendation level with visual styling
 */
function RecommendationLevelCard({ level, color, icon, message, urgency }) {
  // Get urgency styling
  const getUrgencyStyle = () => {
    switch (urgency) {
      case 'Critical':
        return { bg: 'rgba(248, 113, 113, 0.2)', border: '#f87171' };
      case 'Medium':
        return { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24' };
      case 'Low':
        return { bg: 'rgba(74, 222, 128, 0.2)', border: '#4ade80' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280' };
    }
  };
  
  const urgencyStyle = getUrgencyStyle();
  
  return (
    <div className="recommendation-level-content">
      <div className="level-badge" style={{ backgroundColor: `${color}20`, borderColor: color }}>
        <span className="level-icon">{icon}</span>
        <span className="level-text" style={{ color }}>{level}</span>
      </div>
      
      <p className="level-message">{message}</p>
      
      <div className="urgency-indicator" style={{ backgroundColor: urgencyStyle.bg, borderColor: urgencyStyle.border }}>
        <span className="urgency-label">Urgency:</span>
        <span className="urgency-value" style={{ color: urgencyStyle.border }}>{urgency}</span>
      </div>
    </div>
  );
}

export default RecommendationLevelCard;
