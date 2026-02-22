# 🚀 Deployment Guide - AI Placement Readiness Predictor

This guide provides step-by-step instructions to deploy the full-stack application to **Render** (recommended) or **Railway**.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - To host your code repository
2. **Render Account** - Free at [render.com](https://render.com)
3. **MongoDB Atlas Account** - Free at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project named "placement-ai"

### 1.2 Create a Free Cluster
1. Click "Build a Database"
2. Select **M0 FREE** tier
3. Choose a region close to you
4. Name your cluster: `placement-ai-cluster`
5. Click "Create Cluster"

### 1.3 Create Database User
1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `placement-ai-user`
5. Generate a secure password (save this!)
6. Set privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to **Database** in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select Node.js and latest version
5. Copy the connection string:
   ```
   mongodb+srv://placement-ai-user:<password>@placement-ai-cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password

---

## 📁 Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository
```bash
cd placement-ai-project
git init
git add .
git commit -m "Initial commit - Placement AI Predictor"
```

### 2.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name: `placement-ai-predictor`
4. Make it **Public** or **Private**
5. Don't initialize with README (we already have one)
6. Click "Create Repository"

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/placement-ai-predictor.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 3: Deploy to Render

We'll deploy **3 services** in this order:
1. **ML Model** (Python Flask) - Port 5000
2. **Backend API** (Node.js) - Port 3001
3. **Frontend** (React) - Port 3000

### 3.1 Deploy ML Model (Python Flask)

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `placement-ai-ml` |
   | **Region** | Choose closest to you |
   | **Branch** | `main` |
   | **Root Directory** | `ml-model` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `python app.py` |
   | **Instance Type** | `Free` |

5. Click **"Advanced"** → **"Add Environment Variable"**:
   - Key: `PYTHON_VERSION`
   - Value: `3.11.0`

6. Click **"Deploy Web Service"**
7. Wait for deployment (2-3 minutes)
8. **Copy your ML API URL**: `https://placement-ai-ml.onrender.com`

### 3.2 Deploy Backend API (Node.js)

1. Click **"New +"** → **"Web Service"**
2. Select the same repository
3. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `placement-ai-backend` |
   | **Region** | Same as ML service |
   | **Branch** | `main` |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Instance Type** | `Free` |

4. Click **"Advanced"** → **"Add Environment Variables"**:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://placement-ai-user:YOUR_PASSWORD@placement-ai-cluster.mongodb.net/placement-ai?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `your-super-secret-jwt-key-change-this-12345` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `ML_API_URL` | `https://placement-ai-ml.onrender.com` |
   | `CLIENT_URL` | `https://placement-ai-frontend.onrender.com` |

5. Click **"Deploy Web Service"**
6. Wait for deployment (1-2 minutes)
7. **Copy your Backend URL**: `https://placement-ai-backend.onrender.com`

### 3.3 Deploy Frontend (React)

1. Click **"New +"** → **"Web Service"**
2. Select the same repository
3. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `placement-ai-frontend` |
   | **Region** | Same as other services |
   | **Branch** | `main` |
   | **Root Directory** | `client` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npx serve -s build` |
   | **Instance Type** | `Free` |

4. Click **"Advanced"** → **"Add Environment Variables"**:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://placement-ai-backend.onrender.com` |

5. Click **"Deploy Web Service"**
6. Wait for deployment (3-5 minutes)
7. Your app is live at: `https://placement-ai-frontend.onrender.com`

---

## ✅ Step 4: Verify Deployment

### 4.1 Check All Services
1. **ML Model**: Visit `https://placement-ai-ml.onrender.com/health`
   - Should return: `{"status": "healthy", "model_loaded": true}`

2. **Backend API**: Visit `https://placement-ai-backend.onrender.com/api/health`
   - Should return: `{"status": "healthy"}`

3. **Frontend**: Visit `https://placement-ai-frontend.onrender.com`
   - Should show the landing page

### 4.2 Test the Application
1. Register a new account
2. Fill in the prediction form
3. View your placement probability
4. Check the dashboard and roadmap

---

## 🔄 Step 5: Update Environment Variables (If URLs Differ)

If your Render service names differ, update the environment variables:

1. Go to each service in Render Dashboard
2. Click "Environment" in the left sidebar
3. Update the URLs accordingly
4. Click "Save Changes" - this will redeploy the service

---

## 🚂 Alternative: Deploy to Railway

Railway is another excellent platform with a simpler deployment process.

### 5.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 5.2 Deploy Services
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository
4. Configure each service similar to Render

### 5.3 Set Environment Variables
Railway provides a dashboard to set environment variables for each service.

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENDER CLOUD                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌───────────┐ │
│  │    Frontend     │────▶│    Backend      │────▶│  ML Model │ │
│  │    (React)      │     │   (Node.js)     │     │  (Flask)  │ │
│  │   Port 3000     │     │   Port 3001     │     │ Port 5000 │ │
│  └─────────────────┘     └────────┬────────┘     └───────────┘ │
│                                   │                             │
│                                   ▼                             │
│                          ┌─────────────────┐                    │
│                          │    MongoDB      │                    │
│                          │    Atlas        │                    │
│                          │   (Cloud DB)    │                    │
│                          └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. ML Model Fails to Start
- Check if `requirements.txt` has correct packages
- Verify Python version compatibility
- Check logs in Render Dashboard

#### 2. Backend Cannot Connect to MongoDB
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string format
- Ensure password is URL-encoded if it contains special characters

#### 3. Frontend Shows Blank Page
- Check if `REACT_APP_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser console for errors

#### 4. CORS Errors
- Ensure `CLIENT_URL` is set in backend environment
- Check that frontend URL matches exactly (including https://)

#### 5. Free Tier Limitations
- Render free tier spins down after inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for production

---

## 💰 Cost Estimation

### Render Free Tier
- **ML Model**: Free (750 hours/month)
- **Backend**: Free (750 hours/month)
- **Frontend**: Free (750 hours/month)
- **MongoDB Atlas**: Free (512MB storage)

**Total: $0/month** (with cold starts after inactivity)

### Paid Tier (Production)
- **Starter Plan**: $7/month per service
- **MongoDB Atlas**: $9/month (M2 tier)
- **Total**: ~$30/month for always-on services

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB Atlas IP whitelist (restrict to Render IPs in production)
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set `NODE_ENV=production`
- [ ] Review CORS settings
- [ ] Don't commit `.env` files to Git

---

## 📝 Quick Reference

### Service URLs (Replace with your actual URLs)
```
Frontend:  https://placement-ai-frontend.onrender.com
Backend:   https://placement-ai-backend.onrender.com
ML Model:  https://placement-ai-ml.onrender.com
```

### Health Check Endpoints
```
Frontend:  https://placement-ai-frontend.onrender.com
Backend:   https://placement-ai-backend.onrender.com/api/health
ML Model:  https://placement-ai-ml.onrender.com/health
```

### API Endpoints
```
POST /api/register    - Register new user
POST /api/login       - Login user
POST /api/predict     - Get placement prediction
GET  /api/history     - Get prediction history
GET  /api/analytics   - Get user analytics
GET  /api/profile     - Get user profile
```

---

## 🎉 Congratulations!

Your AI Placement Readiness Predictor is now live on the cloud! 

Share your deployment URL with students and start collecting predictions.

For issues or questions, check the logs in Render Dashboard or refer to the troubleshooting section above.
