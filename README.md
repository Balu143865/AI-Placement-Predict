# AI Powered Placement Readiness Predictor

A modern full-stack web application that predicts student placement probability using Machine Learning and generates personalized skill improvement roadmaps.

## 🎯 Project Overview

This application helps students understand their placement readiness by analyzing their academic and skill data. It uses a Logistic Regression model to predict placement probability and provides actionable recommendations for improvement.

## project URL: https://ai-placement-predictor-dv1b.onrender.com

**Version 4.0 - Viral UI + Deploy Ready** now features a stunning modern landing page, glassmorphism UI, smooth animations, and production deployment configuration!

## ✨ What's New in v4.0

### 🎨 Viral UI Upgrade
- **Modern Hero Section** - Animated gradient background with floating orbs
- **Glassmorphism Cards** - Beautiful frosted glass effect components
- **Smooth Animations** - CSS-only fade-in, float, and pulse animations
- **Feature Cards** - Interactive hover effects with glowing borders
- **Professional Footer** - Social links, tech stack badges, and navigation
- **Loading Animation** - Custom animated loader for API calls

### 🚀 Deployment Ready
- **Production CORS** - Secure cross-origin configuration
- **Environment Variables** - Production-ready .env template
- **Render.yaml** - One-click deployment configuration
- **Build Scripts** - Optimized production build commands

## 🏗️ Project Structure

```
placement-ai-project/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js         # Landing page
│   │   │   ├── Login.js        # User login
│   │   │   ├── Register.js     # User registration
│   │   │   ├── Predictor.js    # Input form
│   │   │   ├── Dashboard.js    # Results & analytics
│   │   │   ├── History.js      # Prediction history
│   │   │   └── Roadmap.js      # Learning roadmap
│   │   ├── components/
│   │   │   ├── Navbar.js           # Navigation bar
│   │   │   ├── ProtectedRoute.js   # Auth route guard
│   │   │   ├── ProfileCard.js      # User profile card
│   │   │   ├── ReadinessMeter.js   # Animated score meter
│   │   │   ├── AIInsightsPanel.js  # AI recommendations
│   │   │   ├── RecommendationLevelCard.js
│   │   │   └── AnimatedCard.js     # Fade-in animation
│   │   ├── context/
│   │   │   └── AuthContext.js      # Authentication state
│   │   ├── App.js              # Main app with routing
│   │   ├── App.css             # All styles
│   │   └── index.js            # Entry point
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Prediction.js    # Prediction history schema
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── server.js            # Express API server
│   ├── .env                 # Environment variables
│   └── package.json
│
└── ml-model/               # Python ML API
    ├── app.py              # Flask API with AI engine
    ├── train_model.py      # Model training script
    ├── dataset.csv         # Training data (50 records)
    └── requirements.txt
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - Functional Components with Hooks
- **React Router** - Client-side routing with protected routes
- **Chart.js** - Data visualization (bar charts, line charts)
- **Axios** - HTTP requests
- **CSS** - Modern dark glass morphism UI

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Axios** - HTTP client for ML API communication
- **CORS** - Cross-origin resource sharing

### Machine Learning
- **Python** - Programming language
- **Flask** - Web framework for ML API
- **scikit-learn** - Logistic Regression model
- **pandas** - Data manipulation
- **joblib** - Model serialization

## 📊 Features

### Core Features
1. **Home Page** - Introduction and feature overview
2. **User Authentication** - Register and login with JWT
3. **Predictor Form** - Input academic and skill data:
   - CGPA (0-10)
   - DSA Score (0-100)
   - Number of Projects
   - Communication Skill Level (1-10)
   - Number of Internships
4. **Dashboard** - Comprehensive analytics:
   - Placement probability percentage
   - Readiness score with animated meter
   - Skill analysis bar chart
   - Weak skill identification
   - AI-powered recommendations
   - Recommendation level (High Risk/Moderate/Strong Candidate)
5. **Roadmap** - Daily learning tasks based on skill gaps
6. **History** - Track all predictions with:
   - Line chart showing progress over time
   - Average scores and improvement tracking
   - Detailed prediction modal view

### Startup Level Features (v3.0)
- 🔐 **User Authentication** - Secure JWT-based login/register
- 💾 **Prediction History** - All predictions saved to MongoDB
- 📈 **Analytics Dashboard** - Track progress over time
- 👤 **User Profile** - Personal stats and quick actions
- 📊 **Progress Charts** - Visual readiness score trends
- 🔒 **Protected Routes** - Authenticated-only pages

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.7 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
cd placement-ai-project
```

#### 2. Setup MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas:
```bash
# Local MongoDB (Windows)
mongod --dbpath="C:\data\db"

# Or use MongoDB Atlas connection string in .env
```

#### 3. Setup ML Model (Python)
```bash
cd ml-model

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (creates model files)
python train_model.py

# Start Flask API
python app.py
```
The ML API will run on http://localhost:5000

#### 4. Setup Backend Server (Node.js)
Open a new terminal:
```bash
cd server

# Install dependencies
npm install

# Start server
npm start
```
The backend server will run on http://localhost:3001

#### 5. Setup Frontend (React)
Open another new terminal:
```bash
cd client

# Install dependencies
npm install

# Start React app
npm start
```
The React app will run on http://localhost:3000

## 📡 API Endpoints

### Node.js Backend (Port 3001)

#### Public Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/health` | GET | Check ML API & database status |
| `/api/register` | POST | Register new user |
| `/api/login` | POST | Login user |
| `/api/analyze` | POST | Get skill analysis (public) |

#### Protected Endpoints (Requires JWT Token)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile` | GET | Get user profile |
| `/api/predict` | POST | Get placement prediction (saves to history) |
| `/api/history` | GET | Get prediction history |
| `/api/history/:id` | GET | Get specific prediction |
| `/api/history/:id` | DELETE | Delete a prediction |
| `/api/analytics` | GET | Get user analytics & trends |
| `/api/analytics/summary` | GET | Get quick summary for dashboard |

### Python ML API (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/predict` | POST | ML prediction with AI recommendations |
| `/analyze` | POST | Skill analysis only |

### Authentication Request Format
```json
// POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Prediction Request Format
```json
// POST /api/predict (Requires Authorization header)
{
  "cgpa": 8.5,
  "dsa_score": 75,
  "projects": 3,
  "communication": 7,
  "internships": 2
}
```

### Prediction Response Format
```json
{
  "status": "success",
  "prediction_id": "64abc123...",
  "placement_probability": 78.5,
  "readiness_score": 73.85,
  "recommendation_level": {
    "level": "Strong Candidate",
    "color": "#4ade80",
    "icon": "🎯",
    "message": "Excellent profile...",
    "urgency": "Low"
  },
  "ai_recommendations": [
    "Prepare for technical interviews...",
    "Focus on system design..."
  ],
  "strongest_skill": "CGPA",
  "weakest_skill": "Internships",
  "placement_category": "Tier-1 Companies",
  "skill_analysis": {
    "cgpa": { "score": 85, "status": "Strong", "gap": 0 },
    "dsa": { "score": 75, "status": "Good", "gap": 15 },
    ...
  },
  "roadmap_tasks": [
    {
      "day": 1,
      "task": "Start DSA practice...",
      "category": "DSA",
      "priority": "High",
      "duration": "2 hours"
    },
    ...
  ],
  "saved_to_history": true
}
```

## 🎨 UI Design

- Modern dark theme with glass morphism effects
- Gradient accents and glowing borders
- Card-based responsive layout
- Interactive charts and visualizations
- Smooth animations and transitions
- Clean typography with Inter font
- Mobile-friendly navigation

## 📈 ML Model Details

- **Algorithm**: Logistic Regression
- **Features**: CGPA, DSA Score, Projects, Communication, Internships
- **Training Data**: 50 sample records with placement outcomes
- **Preprocessing**: StandardScaler for feature normalization
- **Output**: Probability score (0-100%)

### AI Recommendation Engine
- Analyzes skill gaps against ideal values
- Generates personalized improvement suggestions
- Categorizes users into risk levels
- Creates day-by-day learning roadmap

## 🔧 Environment Variables

### Server (.env)
```env
# Server Configuration
PORT=3001

# ML API Configuration
ML_API_URL=http://localhost:5000

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/placement-ai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

## 📝 Future Enhancements

- ✅ ~~User authentication and profile management~~ (Completed v3.0)
- ✅ ~~Save prediction history~~ (Completed v3.0)
- ✅ ~~Analytics dashboard~~ (Completed v3.0)
- ✅ ~~Modern viral UI with animations~~ (Completed v4.0)
- ✅ ~~Production deployment ready~~ (Completed v4.0)
- More ML models for comparison
- Export roadmap as PDF
- Integration with job portals
- Real-time placement statistics
- Email notifications
- Admin dashboard
- Company-specific predictions

## 🚀 Deployment Guide

> **📖 For detailed step-by-step deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy Overview

The project includes configuration files for one-click deployment:

| File | Platform | Purpose |
|------|----------|---------|
| [`render.yaml`](./render.yaml) | Render | Blueprint for all 3 services |
| [`railway.json`](./railway.json) | Railway | Railway configuration |
| [`nixpacks.toml`](./nixpacks.toml) | Railway | Build configuration |
| [`.gitignore`](./gitignore) | All | Git ignore rules |

### Prerequisites for Deployment
1. **MongoDB Atlas Account** (Free tier works)
   - Create cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0) for Render

2. **GitHub Account** - For code repository

3. **Render Account** - For hosting at [render.com](https://render.com)

### One-Click Deploy with render.yaml

1. Push code to GitHub
2. Go to Render Dashboard → New → Blueprint
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create all services
5. Set `MONGODB_URI` environment variable in backend service

### Services to Deploy

| Service | Platform | Root Directory | Port |
|---------|----------|----------------|------|
| ML Model | Render (Python) | `ml-model/` | 5000 |
| Backend | Render (Node) | `server/` | 3001 |
| Frontend | Render (Static) | `client/` | 3000 |

### Environment Variables

#### Backend Service (server/)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random 32-char string |
| `ML_API_URL` | ML model service URL | `https://placement-ai-ml.onrender.com` |
| `CLIENT_URL` | Frontend URL | `https://placement-ai-frontend.onrender.com` |
| `NODE_ENV` | Environment | `production` |

#### Frontend Service (client/)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://placement-ai-backend.onrender.com` |

### Manual Deployment Steps

#### 1. Deploy ML Model (Python Flask)
1. Create new **Web Service** on Render
2. Connect GitHub repository
3. Configure:
   - **Environment**: Python 3
   - **Root Directory**: `ml-model`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
4. Deploy and note the URL

#### 2. Deploy Backend (Node.js)
1. Create new **Web Service** on Render
2. Connect GitHub repository
3. Configure:
   - **Environment**: Node
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add all environment variables
5. Deploy and note the URL

#### 3. Deploy Frontend (React)
1. Create new **Web Service** on Render
2. Connect GitHub repository
3. Configure:
   - **Environment**: Node
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s build`
4. Add `REACT_APP_API_URL` environment variable
5. Deploy

### Production Build Commands

```bash
# Frontend production build
cd client
npm run build

# The build folder contains static files for deployment
```

## 📄 License

MIT License

## 👥 Authors

Created as a demonstration project for AI-powered placement prediction.

---

**Happy Coding! 🎯**

## 🔧 Troubleshooting

### Common Issues

1. **ML API not connecting**
   - Ensure Python Flask server is running on port 5000
   - Check if all Python dependencies are installed

2. **MongoDB connection error**
   - Verify MongoDB is running locally or check Atlas connection string
   - Ensure MONGODB_URI in .env is correct

3. **JWT authentication failing**
   - Check JWT_SECRET is set in .env
   - Clear localStorage and login again

4. **CORS errors**
   - Verify CLIENT_URL in server/.env matches React app URL
   - Ensure backend CORS is configured properly

### Quick Start Commands
```bash
# Terminal 1 - ML API
cd ml-model && python app.py

# Terminal 2 - Backend
cd server && npm start

# Terminal 3 - Frontend
cd client && npm start
