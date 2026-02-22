import React, { useState } from 'react';

/**
 * FeatureCard Component
 * Animated feature card with hover effects
 */
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="feature-card glass-card"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`feature-icon-wrapper ${isHovered ? 'hovered' : ''}`}>
        <span className="feature-icon">{icon}</span>
        <div className="icon-glow" />
      </div>
      
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      
      <div className="feature-hover-line" />
    </div>
  );
};

export default FeatureCard;
