# ============================================
# Unified Flask Application
# Serves: ML API + Backend API + React Frontend
# All from a single URL
# ============================================

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
import hashlib
import uuid
from datetime import datetime, timedelta
import json

# ============================================
# APP CONFIGURATION
# ============================================
# Static folder is client/build after React build
app = Flask(__name__, static_folder='client/build')

# Enable CORS for development
CORS(app)

# Secret key for sessions
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

# ============================================
# IN-MEMORY DATABASE (Replace with MongoDB in production)
# ============================================
users_db = {}
predictions_db = []
sessions_db = {}

# ============================================
# LOAD ML MODEL
# ============================================
# Try multiple paths for model files
MODEL_PATHS = [
    'placement_model.joblib',
    'ml-model/placement_model.joblib'
]
SCALER_PATHS = [
    'scaler.joblib',
    'ml-model/scaler.joblib'
]

def find_file(paths):
    """Find first existing file from list of paths"""
    for path in paths:
        if os.path.exists(path):
            return path
    return None

MODEL_PATH = find_file(MODEL_PATHS) or 'placement_model.joblib'
SCALER_PATH = find_file(SCALER_PATHS) or 'scaler.joblib'

def load_model():
    """Load the trained model and scaler"""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        print("Model not found! Training new model...")
        from train_model import train_placement_model
        train_placement_model()
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler

try:
    model, scaler = load_model()
    print("✅ ML Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading model: {e}")
    model, scaler = None, None

# Feature names for analysis
FEATURE_NAMES = ['cgpa', 'dsa_score', 'projects', 'communication', 'internships']
FEATURE_LABELS = {
    'cgpa': 'CGPA',
    'dsa_score': 'DSA Skills',
    'projects': 'Projects',
    'communication': 'Communication',
    'internships': 'Internships'
}

# Ideal skill values for gap analysis
IDEAL_SKILLS = {
    'dsa_score': 70,
    'communication': 7,
    'projects': 3,
    'internships': 2,
    'cgpa': 8.0
}

# ============================================
# HELPER FUNCTIONS
# ============================================
def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    """Generate a unique session token"""
    return str(uuid.uuid4())

def get_user_by_token(token):
    """Get user from session token"""
    if token in sessions_db:
        user_id = sessions_db[token]
        return users_db.get(user_id)
    return None

def calculate_readiness_score(data):
    """Calculate comprehensive readiness score"""
    weights = {
        'cgpa': 0.25,
        'dsa_score': 0.25,
        'projects': 0.20,
        'communication': 0.15,
        'internships': 0.15
    }
    
    normalized = {
        'cgpa': min(data['cgpa'] / 10.0, 1.0),
        'dsa_score': min(data['dsa_score'] / 100.0, 1.0),
        'projects': min(data['projects'] / 5.0, 1.0),
        'communication': min(data['communication'] / 10.0, 1.0),
        'internships': min(data['internships'] / 3.0, 1.0)
    }
    
    score = sum(normalized[k] * weights[k] for k in weights) * 100
    return round(score, 2)

def get_recommendation_level(score):
    """Get recommendation level based on score"""
    if score >= 75:
        return {
            'level': 'Strong Candidate',
            'color': '#4ade80',
            'icon': '🎯',
            'message': 'Excellent profile! You are well-prepared for placements.',
            'urgency': 'Low'
        }
    elif score >= 50:
        return {
            'level': 'Moderate',
            'color': '#fbbf24',
            'icon': '⚡',
            'message': 'Good progress! Focus on improving weak areas.',
            'urgency': 'Medium'
        }
    else:
        return {
            'level': 'High Risk',
            'color': '#f87171',
            'icon': '🚨',
            'message': 'Immediate action needed! Work on skill gaps.',
            'urgency': 'High'
        }

def analyze_skill_gaps(data):
    """Analyze skill gaps and provide recommendations"""
    gaps = {}
    for feature in FEATURE_NAMES:
        ideal = IDEAL_SKILLS.get(feature, 0)
        actual = data.get(feature, 0)
        
        if feature == 'cgpa':
            gap = max(0, (ideal - actual) / 10.0 * 100)
            score = min(100, (actual / 10.0) * 100)
        elif feature == 'dsa_score':
            gap = max(0, ideal - actual)
            score = min(100, actual)
        elif feature == 'communication':
            gap = max(0, (ideal - actual) / 10.0 * 100)
            score = min(100, (actual / 10.0) * 100)
        elif feature == 'projects':
            gap = max(0, ideal - actual)
            score = min(100, (actual / 5.0) * 100)
        else:  # internships
            gap = max(0, ideal - actual)
            score = min(100, (actual / 3.0) * 100)
        
        if score >= 80:
            status = 'Strong'
        elif score >= 60:
            status = 'Good'
        elif score >= 40:
            status = 'Average'
        else:
            status = 'Needs Work'
        
        gaps[feature] = {
            'score': round(score, 1),
            'status': status,
            'gap': round(gap, 1),
            'ideal': ideal,
            'actual': actual
        }
    
    return gaps

def generate_roadmap(gaps):
    """Generate personalized learning roadmap"""
    roadmap = []
    day = 1
    
    # Sort by gap (largest first)
    sorted_gaps = sorted(gaps.items(), key=lambda x: x[1]['gap'], reverse=True)
    
    for feature, data in sorted_gaps:
        if data['gap'] > 0:
            if feature == 'dsa_score':
                roadmap.append({
                    'day': day,
                    'task': f"Solve 2 DSA problems daily on LeetCode/HackerRank",
                    'category': 'DSA',
                    'priority': 'High' if data['gap'] > 30 else 'Medium',
                    'duration': '2 hours',
                    'duration_days': 30
                })
                day += 1
            elif feature == 'communication':
                roadmap.append({
                    'day': day,
                    'task': f"Practice English speaking and mock interviews",
                    'category': 'Communication',
                    'priority': 'High' if data['gap'] > 20 else 'Medium',
                    'duration': '1 hour',
                    'duration_days': 21
                })
                day += 1
            elif feature == 'projects':
                roadmap.append({
                    'day': day,
                    'task': f"Build a new project to add to your portfolio",
                    'category': 'Projects',
                    'priority': 'Medium',
                    'duration': '4 hours/week',
                    'duration_days': 14
                })
                day += 1
            elif feature == 'internships':
                roadmap.append({
                    'day': day,
                    'task': f"Apply for internships on LinkedIn/Internshala",
                    'category': 'Internships',
                    'priority': 'High' if data['gap'] > 1 else 'Medium',
                    'duration': '30 min daily',
                    'duration_days': 7
                })
                day += 1
            elif feature == 'cgpa':
                roadmap.append({
                    'day': day,
                    'task': f"Focus on academics to improve CGPA",
                    'category': 'Academics',
                    'priority': 'Medium',
                    'duration': '2 hours daily',
                    'duration_days': 60
                })
                day += 1
    
    return roadmap[:7]  # Return max 7 tasks

# ============================================
# API ROUTES - AUTH
# ============================================
@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400
        
        if email in [u['email'] for u in users_db.values()]:
            return jsonify({'error': 'Email already registered'}), 400
        
        user_id = str(uuid.uuid4())
        users_db[user_id] = {
            'id': user_id,
            'name': name,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat()
        }
        
        token = generate_token()
        sessions_db[token] = user_id
        
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': user_id,
                'name': name,
                'email': email
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        user = next((u for u in users_db.values() if u['email'] == email), None)
        
        if not user or user['password'] != hash_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        token = generate_token()
        sessions_db[token] = user['id']
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = get_user_by_token(token)
    
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    return jsonify({
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'created_at': user['created_at']
        }
    }), 200

# ============================================
# API ROUTES - PREDICTION
# ============================================
@app.route('/api/predict', methods=['POST'])
def predict():
    """Make placement prediction"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = get_user_by_token(token)
    
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        
        # Validate input
        required = ['cgpa', 'dsa_score', 'projects', 'communication', 'internships']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Prepare features
        features = np.array([[
            float(data['cgpa']),
            int(data['dsa_score']),
            int(data['projects']),
            int(data['communication']),
            int(data['internships'])
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict
        probability = model.predict_proba(features_scaled)[0][1]
        placement_probability = round(probability * 100, 2)
        
        # Calculate readiness score
        readiness_score = calculate_readiness_score(data)
        
        # Get recommendation level
        recommendation = get_recommendation_level(readiness_score)
        
        # Analyze skill gaps
        skill_gaps = analyze_skill_gaps(data)
        
        # Generate roadmap
        roadmap = generate_roadmap(skill_gaps)
        
        # Find weakest and strongest skills
        sorted_skills = sorted(skill_gaps.items(), key=lambda x: x[1]['score'])
        weakest = sorted_skills[0][0]
        strongest = sorted_skills[-1][0]
        
        # Save prediction
        prediction_id = str(uuid.uuid4())
        prediction_record = {
            'id': prediction_id,
            'user_id': user['id'],
            'data': data,
            'placement_probability': placement_probability,
            'readiness_score': readiness_score,
            'created_at': datetime.now().isoformat()
        }
        predictions_db.append(prediction_record)
        
        return jsonify({
            'status': 'success',
            'prediction_id': prediction_id,
            'placement_probability': placement_probability,
            'readiness_score': readiness_score,
            'recommendation_level': recommendation,
            'skill_analysis': skill_gaps,
            'weakest_skill': FEATURE_LABELS.get(weakest, weakest),
            'strongest_skill': FEATURE_LABELS.get(strongest, strongest),
            'roadmap_tasks': roadmap,
            'saved_to_history': True
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get prediction history"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = get_user_by_token(token)
    
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_predictions = [p for p in predictions_db if p['user_id'] == user['id']]
    
    return jsonify({
        'data': user_predictions
    }), 200

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get user analytics"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = get_user_by_token(token)
    
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_predictions = [p for p in predictions_db if p['user_id'] == user['id']]
    
    if not user_predictions:
        return jsonify({
            'data': {
                'total_predictions': 0,
                'average_score': 0,
                'trend': []
            }
        }), 200
    
    avg_score = sum(p['readiness_score'] for p in user_predictions) / len(user_predictions)
    trend = [{'date': p['created_at'], 'score': p['readiness_score']} for p in user_predictions]
    
    return jsonify({
        'data': {
            'total_predictions': len(user_predictions),
            'average_score': round(avg_score, 2),
            'trend': trend
        }
    }), 200

# ============================================
# HEALTH CHECK
# ============================================
@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/health')
def api_health():
    """API health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    }), 200

# ============================================
# SERVE REACT FRONTEND
# ============================================
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve React frontend"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# ============================================
# MAIN
# ============================================
if __name__ == '__main__':
    print("=" * 50)
    print("🚀 AI Placement Readiness Predictor")
    print("=" * 50)
    print("Features: ML Prediction + Auth + Frontend")
    print("=" * 50)
    
    # Use PORT from environment variable (required for Render)
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)