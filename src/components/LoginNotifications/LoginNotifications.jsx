import React from 'react';
import './LoginNotification.css';

const LoginNotification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default LoginNotification;
