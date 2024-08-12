import React, { useState } from 'react';
import "./Reset.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Reset = ({ onClose, email }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleClose = () => {
    onClose();
  };

  const handleChangePassword = () => {
    if (password === confirmPassword) {

      const data = {
        email: String(email).trim(),
        newPassword: password
      };

      fetch(`${backendUrl}/login/changePassword`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result) {
            console.log('Actualización de la contraseña del user correcta');
            toast.success('Se ha cambiado la contraseña correctamente.', {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
              onClose: () => handleClose()
            });
          } else {
            console.log('Error al actualizar la contraseña del user');
            toast.error('Error al cambiar la contraseña.', {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          }
        })
        .catch(error => {
          console.log(error);
          toast.error('Error al cambiar la contraseña.', {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
        });

    } else {
      toast.error('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.', {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (!value.match(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/)) {
      setPasswordError('La contraseña debe contener al menos 8 caracteres, incluyendo al menos un número y una letra mayúscula.');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">Cambiar contraseña</h2>
      <h4 className='indicaciones-reset'> Por favor introduzca una contraseña segura para su cuenta</h4>
      <div>
        <div className='inputs-contraseñas'>
          <input
            type="password"
            placeholder="•••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          <label>Contraseña nueva</label>
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
        <div className='inputs-contraseñas'>
          <input
            type="password"
            placeholder="•••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label>Confirma la contraseña</label>
        </div>
        <div className="password-reset">
          <label>Elige una contraseña segura.</label>
        </div>
      </div>
      <div className='button-container-reset'>
        <button onClick={handleChangePassword} className="reset-button ">Cambiar contraseña</button>
        <button onClick={handleClose} className="reset-button ">Cancelar</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Reset;
