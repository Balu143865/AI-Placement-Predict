import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

/**
 * Navbar Component
 * Navigation bar with user menu, logout, and theme toggle
 */
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🎯</span>
          <span className="logo-text">PlacementAI</span>
        </Link>

        {/* Navigation Links */}
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          {/* Mobile Theme Toggle - shown only in mobile menu */}
          <div className="mobile-theme-toggle">
            <ThemeToggle />
            <span className="mobile-theme-label">Theme</span>
          </div>
          
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/predictor" className={`nav-link ${isActive('/predictor')}`} onClick={closeMenu}>
                Predict
              </Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history')}`} onClick={closeMenu}>
                History
              </Link>
              <Link to="/roadmap" className={`nav-link ${isActive('/roadmap')}`} onClick={closeMenu}>
                Roadmap
              </Link>
              
              {/* Mobile Logout */}
              <button onClick={handleLogout} className="mobile-logout-btn">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Right Side Actions - Desktop */}
        <div className="navbar-actions">
          {user && (
            <div className="navbar-user" ref={dropdownRef}>
              <div 
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/dashboard" className="dropdown-item" onClick={() => { closeMenu(); setDropdownOpen(false); }}>
                    📊 Dashboard
                  </Link>
                  <Link to="/history" className="dropdown-item" onClick={() => { closeMenu(); setDropdownOpen(false); }}>
                    📋 History
                  </Link>
                  <Link to="/predictor" className="dropdown-item" onClick={() => { closeMenu(); setDropdownOpen(false); }}>
                    🎯 New Prediction
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;