import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';

/**
 * Predictor Form Page Component
 * Form for entering student academic and skill data
 * Updated for Startup Level with authentication
 */
function Predictor() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    cgpa: '',
    dsa_score: '',
    projects: '',
    communication: '',
    internships: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    const { cgpa, dsa_score, projects, communication, internships } = formData;
    
    if (!cgpa || !dsa_score || !projects || !communication || !internships) {
      setError('Please fill in all fields');
      return false;
    }

    if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
      setError('CGPA must be between 0 and 10');
      return false;
    }

    if (parseInt(dsa_score) < 0 || parseInt(dsa_score) > 100) {
      setError('DSA Score must be between 0 and 100');
      return false;
    }

    if (parseInt(projects) < 0) {
      setError('Number of projects cannot be negative');
      return false;
    }

    if (parseInt(communication) < 1 || parseInt(communication) > 10) {
      setError('Communication skill level must be between 1 and 10');
      return false;
    }

    if (parseInt(internships) < 0) {
      setError('Number of internships cannot be negative');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Get auth token
      const token = localStorage.getItem('token');
      
      // Use relative URLs for unified deployment
      const API_URL = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:3001');
      
      const response = await axios.post(`${API_URL}/api/predict`, {
        cgpa: parseFloat(formData.cgpa),
        dsa_score: parseInt(formData.dsa_score),
        projects: parseInt(formData.projects),
        communication: parseInt(formData.communication),
        internships: parseInt(formData.internships)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Store prediction data in sessionStorage for Dashboard
      sessionStorage.setItem('predictionData', JSON.stringify(response.data));
      sessionStorage.setItem('formData', JSON.stringify(formData));

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Prediction error:', err);
      if (err.response) {
        // Check for auth errors
        if (err.response.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError(err.response.data.message || 'Prediction failed. Please try again.');
        }
      } else if (err.request) {
        setError('Unable to connect to server. Please ensure the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predictor-page">
      <div className="predictor-container">
        <div className="predictor-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>Enter Your Details</h1>
          <p>Fill in your academic and skill information for accurate prediction</p>
          {user && (
            <p className="user-greeting">Hello, <strong>{user.name}</strong>! Ready to analyze your profile?</p>
          )}
        </div>

        <form className="predictor-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cgpa">
                <span className="label-icon">🎓</span>
                CGPA
              </label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="Enter your CGPA (0-10)"
                step="0.1"
                min="0"
                max="10"
                required
              />
              <span className="input-hint">Scale: 0 to 10</span>
            </div>

            <div className="form-group">
              <label htmlFor="dsa_score">
                <span className="label-icon">💻</span>
                DSA Score
              </label>
              <input
                type="number"
                id="dsa_score"
                name="dsa_score"
                value={formData.dsa_score}
                onChange={handleChange}
                placeholder="Enter your DSA score (0-100)"
                min="0"
                max="100"
                required
              />
              <span className="input-hint">Based on coding practice platforms</span>
            </div>

            <div className="form-group">
              <label htmlFor="projects">
                <span className="label-icon">🚀</span>
                Number of Projects
              </label>
              <input
                type="number"
                id="projects"
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                placeholder="Enter number of projects"
                min="0"
                required
              />
              <span className="input-hint">Include personal & academic projects</span>
            </div>

            <div className="form-group">
              <label htmlFor="communication">
                <span className="label-icon">🗣️</span>
                Communication Skill Level
              </label>
              <input
                type="number"
                id="communication"
                name="communication"
                value={formData.communication}
                onChange={handleChange}
                placeholder="Enter skill level (1-10)"
                min="1"
                max="10"
                required
              />
              <span className="input-hint">Self-assessment: 1 (Beginner) to 10 (Expert)</span>
            </div>

            <div className="form-group full-width">
              <label htmlFor="internships">
                <span className="label-icon">💼</span>
                Number of Internships
              </label>
              <input
                type="number"
                id="internships"
                name="internships"
                value={formData.internships}
                onChange={handleChange}
                placeholder="Enter number of internships completed"
                min="0"
                required
              />
              <span className="input-hint">Include all completed internships</span>
            </div>
          </div>

          {/* Resume Upload Section */}
          <ResumeUpload 
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            onFileSelect={(file) => console.log('File selected:', file)}
          />

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                Predict Placement
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="predictor-info">
          <h3>How it works</h3>
          <div className="info-steps">
            <div className="info-step">
              <div className="step-number">1</div>
              <p>Enter your academic and skill details</p>
            </div>
            <div className="info-step">
              <div className="step-number">2</div>
              <p>AI model analyzes your profile</p>
            </div>
            <div className="info-step">
              <div className="step-number">3</div>
              <p>Get prediction & personalized roadmap</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Predictor;
