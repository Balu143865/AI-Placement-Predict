import React, { useState, useRef, useCallback } from 'react';

/**
 * ResumeUpload Component
 * Drag-and-drop file upload for resumes (PDF/DOCX)
 * Features: file validation, progress indicator, preview, remove/replace
 */
function ResumeUpload({ onFileSelect, uploadedFile, setUploadedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // Validate file
  const validateFile = (file) => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return 'Invalid file type. Please upload a PDF or DOCX file.';
    }

    // Check file size
    if (file.size > maxFileSize) {
      return 'File size exceeds 5MB limit. Please upload a smaller file.';
    }

    return null;
  };

  // Handle file selection
  const handleFile = useCallback(async (file) => {
    setError('');
    
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate file processing delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });

      // Notify parent component
      if (onFileSelect) {
        onFileSelect(file);
      }

      setIsUploading(false);
    }, 1000);
  }, [onFileSelect, setUploadedFile]);

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle file input change
  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Open file browser
  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const removeFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setUploadProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return '📄';
    if (extension === 'doc' || extension === 'docx') return '📝';
    return '📁';
  };

  return (
    <div className="resume-upload-section">
      <div className="section-label">
        <span className="label-icon">📎</span>
        <span>Upload Resume (Optional)</span>
      </div>
      
      {!uploadedFile ? (
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileBrowser}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />
          
          <div className="drop-zone-content">
            {isUploading ? (
              <>
                <div className="upload-progress-circle">
                  <svg viewBox="0 0 36 36" className="progress-ring">
                    <path
                      className="progress-ring-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="progress-ring-fill"
                      strokeDasharray={`${uploadProgress}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
                <p className="upload-status">Uploading...</p>
              </>
            ) : (
              <>
                <div className="upload-icon">
                  <span>📤</span>
                </div>
                <p className="drop-text">
                  <strong>Drag & drop</strong> your resume here
                </p>
                <p className="drop-subtext">or click to browse</p>
                <div className="file-types">
                  <span className="file-type-badge">PDF</span>
                  <span className="file-type-badge">DOC</span>
                  <span className="file-type-badge">DOCX</span>
                </div>
                <p className="file-size-limit">Max file size: 5MB</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="uploaded-file-preview">
          <div className="file-info">
            <span className="file-icon">{getFileIcon(uploadedFile.name)}</span>
            <div className="file-details">
              <span className="file-name">{uploadedFile.name}</span>
              <span className="file-size">{formatFileSize(uploadedFile.size)}</span>
            </div>
          </div>
          <div className="file-actions">
            <button
              type="button"
              className="replace-file-btn"
              onClick={openFileBrowser}
            >
              Replace
            </button>
            <button
              type="button"
              className="remove-file-btn"
              onClick={removeFile}
            >
              <span>✕</span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />
        </div>
      )}

      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
