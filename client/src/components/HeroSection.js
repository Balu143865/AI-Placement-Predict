import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * HeroSection Component
 * Modern animated hero section for landing page
 */
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section">
      {/* Animated Background Elements */}
      <div className="hero-bg-elements">
        <div 
          className="hero-orb hero-orb-1"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        />
        <div 
          className="hero-orb hero-orb-2"
          style={{
            transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`
          }}
        />
        <div 
          className="hero-orb hero-orb-3"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px)`
          }}
        />
        <div className="hero-grid" />
      </div>

      {/* Main Content */}
      <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
        <div className="hero-badge">
          <span className="badge-icon">🚀</span>
          <span className="badge-text">AI-Powered Career Analytics</span>
        </div>

        <h1 className="hero-title">
          <span className="title-line">AI Placement</span>
          <span className="title-line gradient-text">Readiness Analyzer</span>
        </h1>

        <p className="hero-subtitle">
          Predict your future with AI-powered analytics. Get personalized skill roadmaps, 
          placement probability scores, and actionable insights to boost your career.
        </p>

        <div className="hero-cta">
          <h3 className="hero-cta-title">🎯 Ready to Predict Your Future?</h3>
          <div className="hero-cta-buttons">
            <Link to="/predictor" className="hero-btn primary-btn">
              <span className="btn-icon">🎯</span>
              <span className="btn-text">Start Prediction</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/register" className="hero-btn secondary-btn">
              <span className="btn-icon">👤</span>
              <span className="btn-text">Create Account</span>
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-number">95%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Students Helped</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Placements</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default HeroSection;
