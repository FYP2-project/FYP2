import React from 'react';
import '../css/ConfirmationDialog.css';

const ErrorDialog = ({ message, onClose }) => {
  
  return (
    <div className="confirmation-dialog-background">
      <div className="confirmation-dialog  success-animation">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
         
          <button className="cancel-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
