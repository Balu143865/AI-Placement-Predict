import React, { useEffect, useState } from 'react';

/**
 * ReadinessMeter Component (PRO VERSION)
 * Animated circular progress UI showing placement readiness score
 */
function ReadinessMeter({ score = 0, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Ensure score is a valid number
  const safeScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  
  // Animate score on mount
  useEffect(() => {
    setIsVisible(true);
    
    // Animate score from 0 to actual score
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = safeScore / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const newScore = Math.min(Math.round(increment * currentStep), safeScore);
      setAnimatedScore(newScore);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedScore(safeScore);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [safeScore]);
  
  // Calculate the circumference and stroke-dashoffset for the circle
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  
  // Determine color based on score
  const getScoreColor = () => {
    if (animatedScore >= 70) return '#4ade80'; // Green
    if (animatedScore >= 50) return '#fbbf24'; // Yellow
    return '#f87171'; // Red
  };
  
  const getScoreLabel = () => {
    if (animatedScore >= 80) return 'Excellent';
    if (animatedScore >= 70) return 'Good';
    if (animatedScore >= 50) return 'Average';
    if (animatedScore >= 30) return 'Needs Work';
    return 'At Risk';
  };
  
  const color = getScoreColor();
  
  return (
    <div className={`readiness-meter ${isVisible ? 'visible' : ''}`} style={{ width: size, height: size }}>
      <svg className="meter-svg" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          className="meter-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth="12"
        />
        
        {/* Animated progress circle */}
        <circle
          className="meter-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.3s ease',
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />
        
        {/* Glow effect */}
        <circle
          className="meter-glow"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 15px ${color})`,
            opacity: 0.4
          }}
        />
      </svg>
      
      <div className="meter-content">
        <span className="meter-score" style={{ color }}>
          {animatedScore}
        </span>
        <span className="meter-label">{getScoreLabel()}</span>
        <span className="meter-sublabel">Readiness Score</span>
      </div>
      
      {/* Animated particles */}
      <div className="meter-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              '--delay': `${i * 0.2}s`,
              '--angle': `${i * 60}deg`,
              '--color': color
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ReadinessMeter;
