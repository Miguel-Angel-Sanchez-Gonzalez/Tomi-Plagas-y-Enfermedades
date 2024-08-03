import React from 'react';
import './AddNotification.css';

const AddNotification = ({ message, onClose }) => {
  return (
    <div className="addnotification">
      <p>{message}</p>
      <button onClick={onClose}>Entendido</button>
    </div>
  );
};

export default AddNotification;
