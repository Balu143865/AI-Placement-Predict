import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

/**
 * Home Page Component - VIRAL UI VERSION
 * Modern landing page with hero section, features, and how it works
 * Deploy-ready with professional UI
 */
function Home() {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI Prediction',
      description: 'Advanced ML model analyzes your academic data to predict placement probability with 95% accuracy.'
    },
    {
      icon: '📊',
      title: 'Skill Gap Analyzer',
      description: 'Identify your weak areas with detailed analytics and visual insights for targeted improvement.'
    },
    {
      icon: '🗺️',
      title: 'Smart Roadmap',
      description: 'Get a personalized day-by-day learning plan tailored to your specific skill gaps.'
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed history and trend analysis.'
    },
    {
      icon: '🎯',
      title: 'Readiness Score',
      description: 'Comprehensive placement readiness score calculated from multiple skill parameters.'
    },
    {
      icon: '💡',
      title: 'AI Recommendations',
      description: 'Smart suggestions and tips powered by AI to help you improve faster.'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Enter Your Data',
      description: 'Input your CGPA, DSA score, projects, communication skills, and internship experience.',
      icon: '📝'
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our ML model processes your data and calculates your placement probability.',
      icon: '🧠'
    },
    {
      step: '03',
      title: 'Get Roadmap',
      description: 'Receive a personalized skill improvement roadmap with actionable tasks.',
      icon: '🚀'
    }
  ];

  return (
    <div className="home-page-viral">
      {/* Hero Section */}
      <HeroSection />

      {/* Welcome Message for Logged In Users */}
      {user && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-emoji">👋</span>
            <div className="welcome-text">
              <h3>Welcome back, {user.name}!</h3>
              <p>Ready to check your placement readiness?</p>
            </div>
            <Link to="/predictor" className="welcome-cta">
              New Prediction →
            </Link>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="features-section animate-on-scroll">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            Powerful tools to help you prepare for your placement journey
          </p>
        </div>

        <div className="features-grid-viral">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works animate-on-scroll">
        <div className="section-header">
          <span className="section-badge">Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to predict your placement readiness
          </p>
        </div>

        <div className="steps-container">
          {howItWorks.map((item, index) => (
            <div key={index} className="step-card" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="step-number">{item.step}</div>
              <div className="step-icon">{item.icon}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-description">{item.description}</p>
              {index < howItWorks.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section animate-on-scroll">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">95%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">10K+</div>
            <div className="stat-label">Students Helped</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-value">500+</div>
            <div className="stat-label">Placements</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">4.9</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section animate-on-scroll">
        <div className="cta-container glass-card">
          <div className="cta-content">
            <h2>Ready to Predict Your Future?</h2>
            <p>Join thousands of students who have improved their placement chances with our AI-powered analyzer.</p>
            <div className="cta-buttons">
              {isAuthenticated() ? (
                <>
                  <Link to="/predictor" className="cta-btn primary">
                    <span>🎯</span> Start Prediction
                  </Link>
                  <Link to="/dashboard" className="cta-btn secondary">
                    <span>📊</span> View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="cta-btn primary">
                    <span>🚀</span> Get Started Free
                  </Link>
                  <Link to="/login" className="cta-btn secondary">
                    <span>👤</span> Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="cta-decoration">
            <div className="cta-orb cta-orb-1" />
            <div className="cta-orb cta-orb-2" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section animate-on-scroll">
        <div className="about-container">
          <h2>About This Project</h2>
          <p>
            This AI-powered placement readiness predictor was built to help students understand 
            their strengths and weaknesses, and provide actionable insights for improvement. 
            Using machine learning (Logistic Regression), the system analyzes multiple parameters 
            to predict placement probability and generate personalized learning roadmaps.
          </p>
          <div className="tech-stack">
            <h4>Built With</h4>
            <div className="tech-icons">
              <span className="tech-item" title="React">⚛️ React</span>
              <span className="tech-item" title="Node.js">🟢 Node.js</span>
              <span className="tech-item" title="Python">🐍 Python</span>
              <span className="tech-item" title="Flask">🔥 Flask</span>
              <span className="tech-item" title="MongoDB">🍃 MongoDB</span>
              <span className="tech-item" title="scikit-learn">🤖 scikit-learn</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer className="animate-on-scroll" />
    </div>
  );
}

export default Home;
