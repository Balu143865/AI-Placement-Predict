import React from 'react';

/**
 * Loader Component
 * Animated loading spinner for API calls
 */
const Loader = ({ text = 'Loading...', fullScreen = false }) => {
  const loaderContent = (
    <div className="loader-container">
      <div className="loader-animation">
        <div className="loader-ring">
          <div className="ring-segment" />
          <div className="ring-segment" />
          <div className="ring-segment" />
          <div className="ring-segment" />
        </div>
        <div className="loader-core">
          <span className="loader-icon">🤖</span>
        </div>
      </div>
      <p className="loader-text">{text}</p>
      <div className="loader-dots">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-overlay">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
