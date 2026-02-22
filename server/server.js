/**
 * Backend Server for AI Powered Placement Readiness Predictor
 * Acts as middleware between React frontend and Python ML API
 * 
 * VERSION 3.0 - STARTUP LEVEL
 * Features:
 * - User Authentication (JWT)
 * - MongoDB Integration
 * - Prediction History
 * - Analytics API
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models and middleware
const User = require('./models/User');
const Prediction = require('./models/Prediction');
const { auth, generateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

// ============================================
// MONGODB CONNECTION
// ============================================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-ai';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Server will continue without database features');
  }
};

connectDB();

// ============================================
// MIDDLEWARE
// ============================================

// Production-ready CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.CLIENT_URL,
      process.env.RENDER_EXTERNAL_URL,
      // Add your production frontend URL here
      // 'https://your-frontend.onrender.com'
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Placement AI Backend Server is running',
    version: '3.0',
    features: [
      'user_authentication',
      'prediction_history',
      'analytics_dashboard',
      'readiness_score',
      'skill_gap_analyzer',
      'smart_roadmap'
    ],
    endpoints: {
      public: ['GET /', 'GET /api/health', 'POST /api/register', 'POST /api/login'],
      protected: ['POST /api/predict', 'GET /api/history', 'GET /api/analytics', 'GET /api/profile']
    }
  });
});

// Health check for ML API
app.get('/api/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/`);
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'success',
      message: 'All services are running',
      ml_api: response.data,
      database: {
        status: dbStatus,
        type: 'MongoDB'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Some services are unavailable',
      ml_api: 'unavailable',
      error: error.message
    });
  }
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/**
 * @route   POST /api/register
 * @desc    Register new user
 * @access  Public
 */
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
});

/**
 * @route   POST /api/login
 * @desc    Login user
 * @access  Public
 */
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Private
 */
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Get user stats
    const stats = await Prediction.getUserAverages(req.user._id);
    
    res.json({
      status: 'success',
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching profile'
    });
  }
});

// ============================================
// PREDICTION ROUTES (PROTECTED)
// ============================================

/**
 * @route   POST /api/predict
 * @desc    Make prediction and save to history
 * @access  Private
 */
app.post('/api/predict', auth, async (req, res) => {
  try {
    const { cgpa, dsa_score, projects, communication, internships } = req.body;

    // Validate input
    if (cgpa === undefined || dsa_score === undefined || projects === undefined || 
        communication === undefined || internships === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields. Please provide: cgpa, dsa_score, projects, communication, internships'
      });
    }

    // Validate ranges
    if (cgpa < 0 || cgpa > 10) {
      return res.status(400).json({
        status: 'error',
        message: 'CGPA must be between 0 and 10'
      });
    }

    if (dsa_score < 0 || dsa_score > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'DSA Score must be between 0 and 100'
      });
    }

    if (projects < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Number of projects cannot be negative'
      });
    }

    if (communication < 1 || communication > 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Communication skill level must be between 1 and 10'
      });
    }

    if (internships < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Number of internships cannot be negative'
      });
    }

    // Forward request to ML API
    const mlResponse = await axios.post(`${ML_API_URL}/predict`, {
      cgpa: parseFloat(cgpa),
      dsa_score: parseInt(dsa_score),
      projects: parseInt(projects),
      communication: parseInt(communication),
      internships: parseInt(internships)
    });

    const data = mlResponse.data;

    // Extract placement_probability from prediction object or direct
    const placementProbability = data.prediction?.placement_probability ?? data.placement_probability ?? 0;

    // Save prediction to database
    const prediction = new Prediction({
      userId: req.user._id,
      cgpa: parseFloat(cgpa),
      dsa_score: parseInt(dsa_score),
      projects: parseInt(projects),
      communication: parseInt(communication),
      internships: parseInt(internships),
      placement_probability: placementProbability,
      readiness_score: data.readiness_score,
      recommendation_level: data.recommendation_level,
      placement_category: data.placement_category,
      strongest_skill: data.strongest_skill,
      weakest_skill: data.weakest_skill,
      skill_analysis: data.skill_analysis,
      ai_recommendations: data.ai_recommendations,
      roadmap_tasks: data.roadmap_tasks
    });

    await prediction.save();

    // Enhanced response
    const enhancedResponse = {
      status: 'success',
      prediction_id: prediction._id,
      prediction: {
        placement_probability: placementProbability,
        confidence: data.prediction?.confidence || 'High',
        will_be_placed: data.prediction?.will_be_placed || true
      },
      placement_probability: placementProbability,
      readiness_score: data.readiness_score || 0,
      recommendation_level: data.recommendation_level || {},
      ai_recommendations: data.ai_recommendations || [],
      strongest_skill: data.strongest_skill || '',
      weakest_skill: data.weakest_skill || '',
      placement_category: data.placement_category || '',
      weak_skills: data.weak_skills || [],
      skill_analysis: {
        ...data.skill_analysis,
        summary: {
          total_skills: 5,
          weak_skills_count: data.weak_skills ? data.weak_skills.length : 0,
          strong_skills_count: 5 - (data.weak_skills ? data.weak_skills.length : 0),
          overall_status: (data.readiness_score || 0) >= 70 ? 'Ready' : (data.readiness_score || 0) >= 50 ? 'Needs Improvement' : 'At Risk'
        }
      },
      roadmap_tasks: data.roadmap_tasks || [],
      timestamp: new Date().toISOString(),
      saved_to_history: true
    };

    res.json(enhancedResponse);

  } catch (error) {
    console.error('Prediction error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: 'ML API error',
        error: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        status: 'error',
        message: 'ML API is not available. Please ensure the Python ML server is running on port 5000.'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
});

// ============================================
// HISTORY ROUTES (PROTECTED)
// ============================================

/**
 * @route   GET /api/history
 * @desc    Get user's prediction history
 * @access  Private
 */
app.get('/api/history', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await Prediction.getUserHistory(req.user._id, limit);

    res.json({
      status: 'success',
      count: history.length,
      data: history
    });

  } catch (error) {
    console.error('History error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching history'
    });
  }
});

/**
 * @route   GET /api/history/:id
 * @desc    Get specific prediction by ID
 * @access  Private
 */
app.get('/api/history/:id', auth, async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!prediction) {
      return res.status(404).json({
        status: 'error',
        message: 'Prediction not found'
      });
    }

    res.json({
      status: 'success',
      data: prediction
    });

  } catch (error) {
    console.error('History detail error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching prediction details'
    });
  }
});

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete a prediction from history
 * @access  Private
 */
app.delete('/api/history/:id', auth, async (req, res) => {
  try {
    const prediction = await Prediction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!prediction) {
      return res.status(404).json({
        status: 'error',
        message: 'Prediction not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Prediction deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting prediction'
    });
  }
});

// ============================================
// ANALYTICS ROUTES (PROTECTED)
// ============================================

/**
 * @route   GET /api/analytics
 * @desc    Get user analytics and trends
 * @access  Private
 */
app.get('/api/analytics', auth, async (req, res) => {
  try {
    // Get readiness score trend
    const trend = await Prediction.getReadinessTrend(req.user._id, 10);
    
    // Get averages
    const averages = await Prediction.getUserAverages(req.user._id);
    
    // Get recent predictions
    const recent = await Prediction.getUserHistory(req.user._id, 5);

    // Calculate improvement
    let improvement = 0;
    if (trend.length >= 2) {
      const firstScore = trend[0].score;
      const lastScore = trend[trend.length - 1].score;
      improvement = lastScore - firstScore;
    }

    res.json({
      status: 'success',
      data: {
        trend,
        averages,
        recent,
        improvement: {
          value: improvement.toFixed(2),
          direction: improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'stable'
        },
        total_predictions: averages ? averages.totalPredictions : 0
      }
    });

  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching analytics'
    });
  }
});

/**
 * @route   GET /api/analytics/summary
 * @desc    Get quick summary for dashboard
 * @access  Private
 */
app.get('/api/analytics/summary', auth, async (req, res) => {
  try {
    const averages = await Prediction.getUserAverages(req.user._id);
    const latest = await Prediction.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        total_predictions: averages ? averages.totalPredictions : 0,
        average_readiness: averages ? averages.avgReadinessScore.toFixed(2) : 0,
        average_probability: averages ? averages.avgPlacementProbability.toFixed(2) : 0,
        latest_prediction: latest ? {
          readiness_score: latest.readiness_score,
          placement_probability: latest.placement_probability,
          date: latest.createdAt
        } : null
      }
    });

  } catch (error) {
    console.error('Summary error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching summary'
    });
  }
});

// ============================================
// ANALYSIS ENDPOINT (PUBLIC - for testing)
// ============================================
app.post('/api/analyze', async (req, res) => {
  try {
    const { cgpa, dsa_score, projects, communication, internships } = req.body;

    const mlResponse = await axios.post(`${ML_API_URL}/analyze`, {
      cgpa: parseFloat(cgpa) || 0,
      dsa_score: parseInt(dsa_score) || 0,
      projects: parseInt(projects) || 0,
      communication: parseInt(communication) || 0,
      internships: parseInt(internships) || 0
    });

    res.json(mlResponse.data);

  } catch (error) {
    console.error('Analysis error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: 'ML API error',
        error: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        status: 'error',
        message: 'ML API is not available. Please ensure the Python ML server is running on port 5000.'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀 Placement AI Backend Server v3.0');
  console.log('🚀 ========================================');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🤖 ML API: ${ML_API_URL}`);
  console.log(`💾 Database: MongoDB`);
  console.log('');
  console.log('✨ Features:');
  console.log('   ✅ User Authentication (JWT)');
  console.log('   ✅ Prediction History');
  console.log('   ✅ Analytics Dashboard');
  console.log('   ✅ Readiness Score');
  console.log('   ✅ Skill Gap Analyzer');
  console.log('   ✅ Smart Roadmap');
  console.log('');
});
