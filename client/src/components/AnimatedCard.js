import React, { useEffect, useState } from 'react';

/**
 * AnimatedCard Component
 * Card with smooth fade-in and slide-up animation
 */
function AnimatedCard({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`animated-card ${isVisible ? 'visible' : ''} ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

export default AnimatedCard;
