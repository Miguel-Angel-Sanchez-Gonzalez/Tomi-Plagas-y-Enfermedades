import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./OTPInput.css";
import Reset from "../Reset/Reset";
import LoginNotification from "../../LoginNotifications/LoginNotifications";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const OTPInput = ({ onClose, generatedOTP, email, otpGenerationTime }) => {
  const [otpGenerated, setOTPGenerated] = useState(String(generatedOTP).trim());
  const [otpGenerationTimeState, setOtpGenerationTimeState] = useState(otpGenerationTime); // Actualiza el tiempo de generación del OTP
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [otpInput, setOTPInput] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    inputRefs.current[0].focus();
    if (isResendButtonDisabled) {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            clearInterval(timer);
            setIsResendButtonDisabled(false);
            return 120;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isResendButtonDisabled]);

  useEffect(() => {
    if (otpInput.join("").length === 4) {
      handleVerifyOTP();
    }
  }, [otpInput]);

  const handleVerifyOTP = () => {
    const cleanedOtpInput = otpInput.join("").trim();
    const cleanedGeneratedOTP = otpGenerated.trim();

    console.log("Ingresado: ", cleanedOtpInput);
    console.log("Generado:", cleanedGeneratedOTP);

    // Verificar la vigencia del OTP
    const currentTime = Date.now();
    const otpValidityDuration = 2 * 60 * 1000; // 2 minutos en milisegundos

    if (currentTime - otpGenerationTimeState > otpValidityDuration) {
      setErrorMessage("El código OTP ha caducado");
      return;
    }

    if (cleanedOtpInput === cleanedGeneratedOTP) {
      setIsOTPVerified(true);
      setErrorMessage("");

    } else {
      setErrorMessage("El código OTP ingresado es incorrecto");
    }
  };

  const handleChange = (index, event) => {
    const { value } = event.target;
    if (isNaN(value)) return;

    setOTPInput((prevOtpInput) => {
      const newOTPInput = [...prevOtpInput];
      newOTPInput[index] = value;

      if (index > 0 && (value === "" || value === undefined)) {
        inputRefs.current[index - 1].focus();
      } else if (value !== "" && index < 3) {
        inputRefs.current[index + 1].focus();
      }

      return newOTPInput;
    });
  };

  const handleResendOTP = () => {
    setIsLoading(true);

    const OTP = Math.floor(Math.random() * 9000 + 1000);
    setOTPGenerated(String(OTP).trim());
    setOTPInput(["", "", "", ""]);
    setIsResendButtonDisabled(true);
    const generationTime = Date.now();
    setOtpGenerationTimeState(generationTime); // Actualiza el tiempo de generación del OTP
    setTimeLeft(120);

    const data = {
      recipient_email: email,
      OTP: OTP,
    };

    axios
      .post(`${backendUrl}/login/send_recovery_email`, data)
      .then(() => {
        setIsLoading(false);
        setAlertMessage("El código de recuperación se envió correctamente");
      })
      .catch((error) => {
        console.error("Error al enviar el correo de recuperación:", error);
        setIsLoading(false);
        setAlertMessage("Error al enviar el correo de recuperación");
      });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {isOTPVerified ? (
        <Reset onClose={onClose} email={email} />
      ) : (
        <div className="otp-input-container">
          <h2 className="otp-input-title">Verificación OTP</h2>
          <p className="indicaciones">Ingresa el código OTP enviado a tu correo electrónico:</p>
          <div className="otp-input-fields">
            <div className="inputs-otp">
              {otpInput.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
          </div>
          <p className="error-message">{errorMessage}</p>

          <div className="button-container-otp">
            <button className="button-otp" onClick={handleResendOTP} disabled={isResendButtonDisabled}>
              Reenviar OTP {isResendButtonDisabled && `(${timeLeft}s)`}
            </button>

            <button className="button-otp" onClick={handleClose}>Cerrar</button>
          </div>

          {alertMessage && (
            <LoginNotification
              message={alertMessage}
              onClose={() => setAlertMessage("")}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default OTPInput;
