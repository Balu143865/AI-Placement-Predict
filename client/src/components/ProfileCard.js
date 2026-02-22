import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * Profile Card Component
 * Displays user profile information in dashboard
 */
const ProfileCard = ({ stats }) => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="profile-card glass-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {stats && (
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total_predictions || 0}</span>
            <span className="stat-label">Predictions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {stats.average_readiness ? `${stats.average_readiness}%` : 'N/A'}
            </span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>
      )}

      <div className="profile-actions">
        <Link to="/history" className="profile-btn">
          📊 View History
        </Link>
        <button onClick={logout} className="profile-btn logout">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;