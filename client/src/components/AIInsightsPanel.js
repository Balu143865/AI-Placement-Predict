import React from 'react';

/**
 * AIInsightsPanel Component
 * Displays smart insights about user's skills
 */
function AIInsightsPanel({ strongestSkill, weakestSkill, placementCategory }) {
  return (
    <div className="ai-insights-panel glass-card">
      <div className="insights-header">
        <span className="insights-icon">🧠</span>
        <h3>AI Insights</h3>
      </div>
      
      <div className="insights-content">
        <div className="insight-item">
          <div className="insight-label">
            <span className="insight-badge strongest">💪 Strongest</span>
          </div>
          <div className="insight-value">
            <span className="skill-name">{strongestSkill}</span>
          </div>
        </div>
        
        <div className="insight-divider"></div>
        
        <div className="insight-item">
          <div className="insight-label">
            <span className="insight-badge weakest">🎯 Focus Area</span>
          </div>
          <div className="insight-value">
            <span className="skill-name">{weakestSkill}</span>
          </div>
        </div>
        
        <div className="insight-divider"></div>
        
        <div className="insight-item highlight">
          <div className="insight-label">
            <span className="insight-badge category">🏢 Target</span>
          </div>
          <div className="insight-value">
            <span className="category-name">{placementCategory}</span>
          </div>
        </div>
      </div>
      
      <div className="insights-footer">
        <p>Based on your current skill profile analysis</p>
      </div>
    </div>
  );
}

export default AIInsightsPanel;
