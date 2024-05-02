import React from 'react';
import '../css/ConfirmationDialog.css';

const DeleteDialog = ({ message, onOk }) => {
  
  return (
    <div className="confirmation-dialog-background">
      <div className="confirmation-dialog  success-animation">
        <p className="confirmation-message">{message}</p>
         <p>Deleted successfully</p>
        <div className="confirmation-buttons">
         
          <button className="cancel-button" onClick={onOk}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
