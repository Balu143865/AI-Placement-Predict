"""
Flask API for Placement Prediction ML Model
Provides endpoints for prediction, skill analysis, and roadmap generation
UPGRADED: Advanced Readiness Score, Skill Gap Analyzer, Smart Roadmap Generator
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load model and scaler
MODEL_PATH = 'placement_model.joblib'
SCALER_PATH = 'scaler.joblib'

def load_model():
    """Load the trained model and scaler"""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        print("Model not found! Training new model...")
        from train_model import train_placement_model
        train_placement_model()
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler

model, scaler = load_model()

# Feature names for analysis
FEATURE_NAMES = ['cgpa', 'dsa_score', 'projects', 'communication', 'internships']
FEATURE_LABELS = {
    'cgpa': 'CGPA',
    'dsa_score': 'DSA Skills',
    'projects': 'Projects',
    'communication': 'Communication',
    'internships': 'Internships'
}

# ============================================
# IDEAL SKILL VALUES FOR GAP ANALYSIS
# ============================================
IDEAL_SKILLS = {
    'dsa_score': 70,
    'communication': 7,
    'projects': 3,
    'cgpa': 7.5,
    'internships': 2
}

# Maximum possible values for percentage calculation
SKILL_MAX = {
    'cgpa': 10,
    'dsa_score': 100,
    'projects': 6,
    'communication': 10,
    'internships': 4
}

# ============================================
# 1. PLACEMENT READINESS SCORE CALCULATOR
# ============================================
def calculate_readiness_score(data):
    """
    Calculate advanced placement readiness score
    Formula: (cgpa * 10 + dsa_score + communication + projects*5 + internships*5) / 5
    """
    cgpa = data.get('cgpa', 0)
    dsa_score = data.get('dsa_score', 0)
    communication = data.get('communication', 0)
    projects = data.get('projects', 0)
    internships = data.get('internships', 0)
    
    # Calculate raw readiness score
    raw_score = (cgpa * 10 + dsa_score + communication + projects * 5 + internships * 5) / 5
    
    # Normalize to 0-100 scale
    # Max possible: (10*10 + 100 + 10 + 6*5 + 4*5) / 5 = (100 + 100 + 10 + 30 + 20) / 5 = 260/5 = 52
    # So we normalize by dividing by 52 and multiplying by 100
    max_possible = 52
    normalized_score = min(100, (raw_score / max_possible) * 100)
    
    return round(normalized_score, 2)

# ============================================
# 2. SKILL GAP ANALYZER
# ============================================
def analyze_skill_gaps(data):
    """
    Analyze skill gaps by comparing user scores with ideal values
    Returns list of weak skills and gap details
    """
    weak_skills = []
    skill_gaps = []
    
    for skill, ideal_value in IDEAL_SKILLS.items():
        user_value = data.get(skill, 0)
        
        if user_value < ideal_value:
            gap_percentage = ((ideal_value - user_value) / ideal_value) * 100
            weak_skills.append(FEATURE_LABELS.get(skill, skill))
            skill_gaps.append({
                'skill': FEATURE_LABELS.get(skill, skill),
                'skill_key': skill,
                'current': user_value,
                'ideal': ideal_value,
                'gap': ideal_value - user_value,
                'gap_percentage': round(gap_percentage, 1),
                'severity': 'High' if gap_percentage > 30 else 'Medium' if gap_percentage > 15 else 'Low'
            })
    
    # Sort by gap percentage (highest first)
    skill_gaps.sort(key=lambda x: x['gap_percentage'], reverse=True)
    
    return weak_skills, skill_gaps

# ============================================
# 3. SMART ROADMAP GENERATOR
# ============================================
def generate_smart_roadmap(data, skill_gaps):
    """
    Generate intelligent roadmap based on skill gaps
    Provides specific tasks for each weak skill
    """
    roadmap_tasks = []
    day_counter = 1
    
    # Priority order for skill improvement
    priority_tasks = {
        'dsa_score': [
            {'day': 1, 'task': 'Practice Arrays and Sorting Problems (2 hours)', 'category': 'DSA', 'priority': 1},
            {'day': 2, 'task': 'Learn Linked Lists and solve 5 problems', 'category': 'DSA', 'priority': 1},
            {'day': 3, 'task': 'Study Trees and Graph Traversals', 'category': 'DSA', 'priority': 1},
            {'day': 4, 'task': 'Practice Dynamic Programming basics', 'category': 'DSA', 'priority': 1},
            {'day': 5, 'task': 'Solve 10 medium LeetCode problems', 'category': 'DSA', 'priority': 1},
        ],
        'communication': [
            {'day': 1, 'task': 'Daily English Speaking Practice (20 mins)', 'category': 'Communication', 'priority': 2},
            {'day': 2, 'task': 'Record yourself explaining a technical concept', 'category': 'Communication', 'priority': 2},
            {'day': 3, 'task': 'Practice mock interview with a friend', 'category': 'Communication', 'priority': 2},
            {'day': 4, 'task': 'Write a technical blog post', 'category': 'Communication', 'priority': 2},
            {'day': 5, 'task': 'Join a public speaking group or online community', 'category': 'Communication', 'priority': 2},
        ],
        'projects': [
            {'day': 1, 'task': 'Build 1 Mini React Project (Todo App)', 'category': 'Projects', 'priority': 3},
            {'day': 2, 'task': 'Create a REST API with Node.js', 'category': 'Projects', 'priority': 3},
            {'day': 3, 'task': 'Deploy your project to Vercel/Heroku', 'category': 'Projects', 'priority': 3},
            {'day': 4, 'task': 'Add authentication to your project', 'category': 'Projects', 'priority': 3},
            {'day': 5, 'task': 'Write documentation and README', 'category': 'Projects', 'priority': 3},
        ],
        'cgpa': [
            {'day': 1, 'task': 'Review current semester subjects and identify weak areas', 'category': 'Academic', 'priority': 4},
            {'day': 2, 'task': 'Create a study schedule with 2 hours daily', 'category': 'Academic', 'priority': 4},
            {'day': 3, 'task': 'Focus on improving grades in one subject this week', 'category': 'Academic', 'priority': 4},
            {'day': 4, 'task': 'Attend extra classes or seek faculty help', 'category': 'Academic', 'priority': 4},
            {'day': 5, 'task': 'Practice previous year question papers', 'category': 'Academic', 'priority': 4},
        ],
        'internships': [
            {'day': 1, 'task': 'Update your resume and LinkedIn profile', 'category': 'Career', 'priority': 5},
            {'day': 2, 'task': 'Apply to 5 internships on LinkedIn/Internshala', 'category': 'Career', 'priority': 5},
            {'day': 3, 'task': 'Network with alumni and professionals', 'category': 'Career', 'priority': 5},
            {'day': 4, 'task': 'Prepare for common interview questions', 'category': 'Career', 'priority': 5},
            {'day': 5, 'task': 'Research companies you want to apply to', 'category': 'Career', 'priority': 5},
        ]
    }
    
    # Generate tasks based on skill gaps (sorted by severity)
    for gap in skill_gaps:
        skill_key = gap['skill_key']
        if skill_key in priority_tasks:
            tasks = priority_tasks[skill_key][:3]  # Get top 3 tasks for each weak skill
            for task in tasks:
                roadmap_tasks.append({
                    'day': day_counter,
                    'task': task['task'],
                    'category': task['category'],
                    'priority': task['priority'],
                    'skill_focus': gap['skill'],
                    'expected_improvement': f"+{gap['gap']:.0f} points"
                })
                day_counter += 1
    
    # If no weak skills, provide general improvement tasks
    if not roadmap_tasks:
        roadmap_tasks = [
            {'day': 1, 'task': 'Continue practicing advanced DSA problems', 'category': 'DSA', 'priority': 1, 'skill_focus': 'General', 'expected_improvement': 'Maintain'},
            {'day': 2, 'task': 'Work on a complex project with new technologies', 'category': 'Projects', 'priority': 2, 'skill_focus': 'General', 'expected_improvement': 'Enhance'},
            {'day': 3, 'task': 'Prepare for system design interviews', 'category': 'Career', 'priority': 3, 'skill_focus': 'General', 'expected_improvement': 'Advanced'},
            {'day': 4, 'task': 'Contribute to open source projects', 'category': 'Projects', 'priority': 4, 'skill_focus': 'General', 'expected_improvement': 'Portfolio'},
            {'day': 5, 'task': 'Practice mock interviews with peers', 'category': 'Communication', 'priority': 5, 'skill_focus': 'General', 'expected_improvement': 'Confidence'},
        ]
    
    return roadmap_tasks

# ============================================
# GENERATE RECOMMENDATIONS
# ============================================
def generate_recommendations(skill_gaps, readiness_score):
    """Generate personalized recommendations based on skill gaps"""
    recommendations = []
    
    for gap in skill_gaps[:3]:  # Top 3 gaps
        if gap['skill_key'] == 'dsa_score':
            recommendations.append({
                'title': 'Strengthen DSA Skills',
                'description': f"Your DSA score is {gap['current']}, ideal is {gap['ideal']}. Practice coding problems daily on LeetCode, HackerRank.",
                'priority': gap['severity'],
                'icon': '💻',
                'action': 'Start with Arrays and Strings'
            })
        elif gap['skill_key'] == 'communication':
            recommendations.append({
                'title': 'Enhance Communication Skills',
                'description': f"Communication level is {gap['current']}/10, ideal is {gap['ideal']}/10. Practice speaking and presentations.",
                'priority': gap['severity'],
                'icon': '🗣️',
                'action': 'Join public speaking practice'
            })
        elif gap['skill_key'] == 'projects':
            recommendations.append({
                'title': 'Build More Projects',
                'description': f"You have {gap['current']} projects, ideal is {gap['ideal']}. Create real-world projects to showcase skills.",
                'priority': gap['severity'],
                'icon': '🚀',
                'action': 'Build a full-stack application'
            })
        elif gap['skill_key'] == 'cgpa':
            recommendations.append({
                'title': 'Improve Academic Performance',
                'description': f"CGPA is {gap['current']}, ideal is {gap['ideal']}. Focus on core subjects and consistent study.",
                'priority': gap['severity'],
                'icon': '📚',
                'action': 'Create a study schedule'
            })
        elif gap['skill_key'] == 'internships':
            recommendations.append({
                'title': 'Gain Industry Experience',
                'description': f"You have {gap['current']} internships, ideal is {gap['ideal']}. Apply for internships to gain practical experience.",
                'priority': gap['severity'],
                'icon': '💼',
                'action': 'Update LinkedIn and apply'
            })
    
    # Add general recommendation if score is good
    if readiness_score >= 70 and len(recommendations) < 3:
        recommendations.append({
            'title': 'Stay Updated',
            'description': 'Keep learning new technologies and stay updated with industry trends.',
            'priority': 'Low',
            'icon': '📰',
            'action': 'Follow tech blogs'
        })
    
    return recommendations

# ============================================
# PRO FEATURE: AI RECOMMENDATION ENGINE
# ============================================
def get_recommendation_level(probability):
    """
    Determine recommendation level based on placement probability
    """
    if probability < 0.5:
        return {
            'level': 'High Risk',
            'color': '#f87171',
            'icon': '⚠️',
            'message': 'Immediate action required. Focus on skill improvement.',
            'urgency': 'Critical'
        }
    elif probability <= 0.75:
        return {
            'level': 'Moderate',
            'color': '#fbbf24',
            'icon': '📈',
            'message': 'Good potential. Targeted improvements needed.',
            'urgency': 'Medium'
        }
    else:
        return {
            'level': 'Strong Candidate',
            'color': '#4ade80',
            'icon': '🎯',
            'message': 'Excellent profile. Focus on interview preparation.',
            'urgency': 'Low'
        }

def generate_ai_recommendations(skill_gaps, probability, readiness_score):
    """
    Generate AI-powered smart recommendations
    """
    ai_recommendations = []
    
    # Based on probability level
    if probability < 0.5:
        ai_recommendations.extend([
            "Focus intensively on core skill gaps",
            "Consider additional certification courses",
            "Seek mentorship from placed seniors",
            "Practice daily coding challenges"
        ])
    elif probability <= 0.75:
        ai_recommendations.extend([
            "Improve DSA consistency with daily practice",
            "Build 2 advanced React projects",
            "Practice Mock Interviews weekly",
            "Enhance LinkedIn presence"
        ])
    else:
        ai_recommendations.extend([
            "Prepare for technical interviews",
            "Research target companies",
            "Practice system design questions",
            "Build a strong GitHub portfolio"
        ])
    
    # Add specific recommendations based on skill gaps
    for gap in skill_gaps[:2]:
        if gap['skill_key'] == 'dsa_score':
            ai_recommendations.append("Solve 50+ LeetCode problems in next 30 days")
        elif gap['skill_key'] == 'communication':
            ai_recommendations.append("Join Toastmasters or similar speaking club")
        elif gap['skill_key'] == 'projects':
            ai_recommendations.append("Deploy 2 projects with live demos")
        elif gap['skill_key'] == 'internships':
            ai_recommendations.append("Apply to 10+ internships this month")
    
    return ai_recommendations[:6]  # Return top 6 recommendations

def identify_skill_insights(data, skill_scores):
    """
    Identify strongest and weakest skills
    """
    # Find strongest skill
    strongest_skill = max(skill_scores, key=skill_scores.get)
    strongest_score = skill_scores[strongest_skill]
    
    # Find weakest skill
    weakest_skill = min(skill_scores, key=skill_scores.get)
    weakest_score = skill_scores[weakest_skill]
    
    # Determine placement category
    avg_score = sum(skill_scores.values()) / len(skill_scores)
    if avg_score >= 75:
        placement_category = "Tier-1 Companies"
    elif avg_score >= 60:
        placement_category = "Tier-2 Companies"
    elif avg_score >= 45:
        placement_category = "Startups & Mid-size"
    else:
        placement_category = "Needs Significant Improvement"
    
    return {
        'strongest_skill': FEATURE_LABELS.get(strongest_skill, strongest_skill),
        'strongest_score': strongest_score,
        'weakest_skill': FEATURE_LABELS.get(weakest_skill, weakest_skill),
        'weakest_score': weakest_score,
        'placement_category': placement_category
    }

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "success",
        "message": "Placement Prediction ML API is running",
        "version": "2.0",
        "features": ["readiness_score", "skill_gap_analyzer", "smart_roadmap"],
        "endpoints": ["/predict", "/analyze"]
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict placement probability with advanced analytics
    Returns: placement_probability, readiness_score, weak_skills, roadmap_tasks
    """
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['cgpa', 'dsa_score', 'projects', 'communication', 'internships']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        # Extract features
        features = np.array([[
            float(data['cgpa']),
            int(data['dsa_score']),
            int(data['projects']),
            int(data['communication']),
            int(data['internships'])
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict probability
        probability = model.predict_proba(features_scaled)[0][1]
        prediction = model.predict(features_scaled)[0]
        
        # ============================================
        # NEW: CALCULATE READINESS SCORE
        # ============================================
        readiness_score = calculate_readiness_score(data)
        
        # ============================================
        # NEW: ANALYZE SKILL GAPS
        # ============================================
        weak_skills, skill_gaps = analyze_skill_gaps(data)
        
        # ============================================
        # NEW: GENERATE SMART ROADMAP
        # ============================================
        roadmap_tasks = generate_smart_roadmap(data, skill_gaps)
        
        # Generate recommendations
        recommendations = generate_recommendations(skill_gaps, readiness_score)
        
        # Calculate skill scores as percentages
        skill_scores = {}
        for feature in FEATURE_NAMES:
            score = data[feature]
            max_score = SKILL_MAX[feature]
            percentage = (score / max_score) * 100
            skill_scores[feature] = round(percentage, 1)
        
        # Ideal skill scores for comparison
        ideal_scores = {
            'cgpa': (IDEAL_SKILLS['cgpa'] / SKILL_MAX['cgpa']) * 100,
            'dsa_score': (IDEAL_SKILLS['dsa_score'] / SKILL_MAX['dsa_score']) * 100,
            'projects': (IDEAL_SKILLS['projects'] / SKILL_MAX['projects']) * 100,
            'communication': (IDEAL_SKILLS['communication'] / SKILL_MAX['communication']) * 100,
            'internships': (IDEAL_SKILLS['internships'] / SKILL_MAX['internships']) * 100
        }
        
        # ============================================
        # PRO FEATURES: AI RECOMMENDATION ENGINE
        # ============================================
        recommendation_level = get_recommendation_level(probability)
        ai_recommendations = generate_ai_recommendations(skill_gaps, probability, readiness_score)
        skill_insights = identify_skill_insights(data, skill_scores)
        
        return jsonify({
            "status": "success",
            "prediction": {
                "placement_probability": round(probability * 100, 2),
                "will_be_placed": bool(prediction),
                "confidence": "High" if probability > 0.8 or probability < 0.2 else "Medium" if probability > 0.6 or probability < 0.4 else "Low"
            },
            "readiness_score": readiness_score,
            "weak_skills": weak_skills,
            "recommendation_level": recommendation_level,
            "ai_recommendations": ai_recommendations,
            "strongest_skill": skill_insights['strongest_skill'],
            "weakest_skill": skill_insights['weakest_skill'],
            "placement_category": skill_insights['placement_category'],
            "skill_analysis": {
                "scores": skill_scores,
                "ideal_scores": ideal_scores,
                "skill_gaps": skill_gaps,
                "recommendations": recommendations
            },
            "roadmap_tasks": roadmap_tasks
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Detailed skill analysis without prediction
    """
    try:
        data = request.get_json()
        
        # Calculate readiness score
        readiness_score = calculate_readiness_score(data)
        
        # Analyze skill gaps
        weak_skills, skill_gaps = analyze_skill_gaps(data)
        
        # Generate roadmap
        roadmap_tasks = generate_smart_roadmap(data, skill_gaps)
        
        # Generate recommendations
        recommendations = generate_recommendations(skill_gaps, readiness_score)
        
        # Calculate skill scores
        skill_scores = {}
        for feature in FEATURE_NAMES:
            score = data.get(feature, 0)
            max_score = SKILL_MAX[feature]
            percentage = (score / max_score) * 100
            skill_scores[feature] = round(percentage, 1)
        
        return jsonify({
            "status": "success",
            "readiness_score": readiness_score,
            "weak_skills": weak_skills,
            "skill_analysis": {
                "scores": skill_scores,
                "skill_gaps": skill_gaps,
                "recommendations": recommendations
            },
            "roadmap_tasks": roadmap_tasks
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Placement Prediction ML API v2.0...")
    print("Features: Readiness Score, Skill Gap Analyzer, Smart Roadmap Generator")
    print("Model loaded successfully!")
    
    # Use PORT from environment variable (required for Render deployment)
    port = int(os.environ.get('PORT', 5000))
    # Disable debug mode in production
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
