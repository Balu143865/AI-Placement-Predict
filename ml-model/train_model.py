"""
Training script for Placement Prediction Model
Uses Logistic Regression to predict placement probability
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train_placement_model():
    # Load dataset
    df = pd.read_csv('dataset.csv')
    
    # Features and target
    X = df[['cgpa', 'dsa_score', 'projects', 'communication', 'internships']]
    y = df['placed']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Logistic Regression model
    model = LogisticRegression(random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Calculate accuracy
    train_accuracy = model.score(X_train_scaled, y_train)
    test_accuracy = model.score(X_test_scaled, y_test)
    
    print(f"Training Accuracy: {train_accuracy * 100:.2f}%")
    print(f"Testing Accuracy: {test_accuracy * 100:.2f}%")
    
    # Save model and scaler
    joblib.dump(model, 'placement_model.joblib')
    joblib.dump(scaler, 'scaler.joblib')
    
    print("\nModel and scaler saved successfully!")
    print("- placement_model.joblib")
    print("- scaler.joblib")
    
    return model, scaler

if __name__ == "__main__":
    train_placement_model()
