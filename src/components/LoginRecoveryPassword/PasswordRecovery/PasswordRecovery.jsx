import React, { useState } from 'react';
import './PasswordRecovery.css';
import OTPInput from '../OTPInput/OTPInput';
import LoginNotification from '../../LoginNotifications/LoginNotifications';
import { toast } from "react-toastify";

const PasswordRecovery = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpGenerationTime, setOtpGenerationTime] = useState(null);
  const [isPasswordRecoveryOpen, setIsPasswordRecoveryOpen] = useState(true);
  const [isOTPInputOpen, setIsOTPInputOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const sendRecoveryEmail = () => {
    if (validateEmail(email)) {
      setIsLoading(true);

      const data = {
        email: email 
      };

      fetch('http://localhost:3000/login/check_email_existence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.exists) {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            const generationTime = Date.now();
            setGeneratedOTP(OTP);
            setOtpGenerationTime(generationTime);

            const data2 = {
              recipient_email: email,
              OTP: OTP
            };

            fetch('http://localhost:3000/login/send_recovery_email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data2)
            })
              .then(() => {
                setIsPasswordRecoveryOpen(false);
                setIsOTPInputOpen(true);
                setIsLoading(false);
                toast.success(`El código de recuperación se envió correctamente`, {
                  position: "top-center",
                  autoClose: 2000,
                  theme: "colored",
                });
              })
              .catch((error) => {
                console.error("Error al enviar el correo de recuperación:", error);
                setIsLoading(false);
                toast.error(`Error al enviar el correo de recuperación ${error}`, {
                  position: "top-center",
                  autoClose: 2000,
                  theme: "colored",
                });
              });
          } else {
            toast.warning(`El correo electrónico ingresado no corresponde a ningún usuario registrado.`, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error al verificar el correo electrónico en la BD:", error);
          toast.error(`Error al verificar el correo electrónico en la BD: ${error}`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          setIsLoading(false);
        });
    } else {
      toast.error(`Por favor, ingresa un correo electrónico válido.`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {isPasswordRecoveryOpen && (
        <div className="password-recovery-container">
          <h2 className="password-recovery-title">Recuperación de Contraseña</h2>
          <h4 className='label-correo-asociado'>Ingrese el correo asociado a su cuenta, para recuperar su contraseña.</h4>
          <div className='contenedor-correo'>
            <input
              placeholder={!isInputFocused ? 'ejemplo@gmail.com' : ''}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
          </div>
          <div className='button-container-recovery'>
            <button className="password-recovery-button" onClick={sendRecoveryEmail}>
              {isLoading ? 'Enviando..' : 'Enviar'}
            </button>
            <button className="password-recovery-button" onClick={onClose}>Cerrar</button>
          </div>
          <p className='errorMessage'>{errorMessage}</p>
        </div>
      )}
      {isOTPInputOpen && (
        <OTPInput onClose={onClose} generatedOTP={generatedOTP} email={email} otpGenerationTime={otpGenerationTime} />
      )}
      {alertMessage && <LoginNotification message={alertMessage} onClose={() => setAlertMessage('')} />}
    </div>
  );
};

export default PasswordRecovery;
