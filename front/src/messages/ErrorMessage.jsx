import React from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';
import './styles/errorMessage.css';

const ErrorMessage = ({ message, onDismiss, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <FaExclamationCircle />
      </div>
      
      <div className="error-content">
        <h4 className="error-title">Error</h4>
        <p className="error-message">{message}</p>
        
        {(onRetry || onDismiss) && (
          <div className="error-actions">
            {onRetry && (
              <button 
                onClick={onRetry}
                className="retry-button"
              >
                Reintentar
              </button>
            )}
            {onDismiss && (
              <button 
                onClick={onDismiss}
                className="dismiss-button"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
