import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Predictor from './pages/Predictor';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main App Component
 * Handles routing, authentication, and theme context
 * 
 * VERSION 4.0 - VIRAL UI + THEME SUPPORT
 * Features:
 * - User Authentication
 * - Protected Routes
 * - Prediction History
 * - Analytics Dashboard
 * - Theme Toggle (Light/Dark/System)
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/predictor" 
                element={
                  <ProtectedRoute>
                    <Predictor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/roadmap" 
                element={
                  <ProtectedRoute>
                    <Roadmap />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
