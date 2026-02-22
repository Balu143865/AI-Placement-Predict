const mongoose = require('mongoose');

/**
 * Prediction Schema for MongoDB
 * Stores prediction history for each user
 */
const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  // Input data
  cgpa: {
    type: Number,
    required: true,
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10']
  },
  dsa_score: {
    type: Number,
    required: true,
    min: [0, 'DSA score cannot be negative'],
    max: [100, 'DSA score cannot exceed 100']
  },
  projects: {
    type: Number,
    required: true,
    min: [0, 'Projects cannot be negative']
  },
  communication: {
    type: Number,
    required: true,
    min: [0, 'Communication score cannot be negative'],
    max: [10, 'Communication score cannot exceed 10']
  },
  internships: {
    type: Number,
    required: true,
    min: [0, 'Internships cannot be negative']
  },
  // Prediction results
  placement_probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  readiness_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  recommendation_level: {
    level: String,
    color: String,
    icon: String,
    message: String,
    urgency: String
  },
  placement_category: {
    type: String,
    default: 'Not Specified'
  },
  strongest_skill: {
    type: String,
    default: 'N/A'
  },
  weakest_skill: {
    type: String,
    default: 'N/A'
  },
  skill_analysis: {
    cgpa: { score: Number, status: String, gap: Number },
    dsa: { score: Number, status: String, gap: Number },
    projects: { score: Number, status: String, gap: Number },
    communication: { score: Number, status: String, gap: Number },
    internships: { score: Number, status: String, gap: Number }
  },
  ai_recommendations: [{
    type: String
  }],
  roadmap_tasks: [{
    day: Number,
    task: String,
    category: String,
    priority: String,
    duration: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
predictionSchema.index({ userId: 1, createdAt: -1 });

// Static method to get user's prediction history
predictionSchema.statics.getUserHistory = async function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');
};

// Static method to get readiness score trend
predictionSchema.statics.getReadinessTrend = async function(userId, limit = 10) {
  const predictions = await this.find({ userId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .select('readiness_score createdAt');
  
  return predictions.map(p => ({
    score: p.readiness_score,
    date: p.createdAt
  }));
};

// Static method to get average scores
predictionSchema.statics.getUserAverages = async function(userId) {
  const result = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        avgPlacementProbability: { $avg: '$placement_probability' },
        avgReadinessScore: { $avg: '$readiness_score' },
        totalPredictions: { $sum: 1 },
        latestPrediction: { $max: '$createdAt' }
      }
    }
  ]);
  
  return result[0] || null;
};

module.exports = mongoose.model('Prediction', predictionSchema);