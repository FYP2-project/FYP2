import React from "react";

const SuccessMessage = ({ message, onClose }) => {
  return (

 <div className="confirmation-dialog-background">
      <div className="confirmation-dialog success-animation">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
          <button className="SuccessBTN" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
