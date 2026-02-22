#!/bin/bash
# ============================================
# Build Script for Unified Deployment
# ============================================

echo "=========================================="
echo "Building AI Placement Predictor"
echo "=========================================="

# Build React frontend
echo "📦 Building React frontend..."
cd client
npm install
npm run build

# Copy build to root directory
echo "📋 Copying build files..."
cp -r build ../build

cd ..

# Copy ML model files
echo "🤖 Copying ML model files..."
cp ml-model/placement_model.joblib .
cp ml-model/scaler.joblib .
cp ml-model/dataset.csv .

echo "=========================================="
echo "✅ Build complete!"
echo "=========================================="
echo "Ready for deployment with: python unified_app.py"
