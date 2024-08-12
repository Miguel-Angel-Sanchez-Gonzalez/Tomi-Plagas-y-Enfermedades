import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./UpdatePassword.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UpdatePassword = ({ onCancel, onPasswordUpdate, idWorker }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
      return "Debe tener al menos 8 caracteres.";
    }
    if (!hasUpperCase) {
      return "Debe tener al menos una letra mayúscula.";
    }
    if (!hasNumber) {
      return "Debe tener al menos un número.";
    }
    if (!hasSpecialChar) {
      return "Debe tener al menos un caracter especial.";
    }
    return true;
  };

  const handlePasswordUpdate = async () => {
    const passwordValidationResult = validatePassword(newPassword);
    if (passwordValidationResult !== true) {
      setPasswordError(passwordValidationResult);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/worker/changepassword/${idWorker}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      if (response.ok) {
        toast.success("Contraseña actualizada correctamente.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onPasswordUpdate();
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error(
        `Error al actualizar la contraseña: La contraseña actual no es correcta `,
        {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-password-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="centrar-worker">
        <h4 className="h4profile">Actualizar contraseña</h4>
        <div className="password-rules-worker-e">
          <label className="label-worker-rules-password">La contraseña debe tener los siguientes aspectos:</label>
          <br />
          <label className="label-worker-rules-password">*La contraseña debe ser mínimo de 8 caracteres.</label>
          <br />
          <label className="label-worker-rules-password">
            *Debe incluir al menos: una mayúscula, número y un símbolo (Todos son válidos).
          </label>
          <br />
          <br />
          <h5 className="h5edit-worker">*Campos requeridos</h5>
        </div>
        <div className="form-section-profile">
          <div className="column-worker-profile">
            <label className="titles-datos-worker">Contraseña actual*</label>
            <div className="password-input-container">
              <input
                className="inputs-profile-worker"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Ingrese su contraseña actual"
                required
              />
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="form-section-profile">
          <div className="column-worker-profile">
            <label className="titles-datos-worker">Nueva contraseña*</label>
            <div className="password-input-container">
              <input
                className="inputs-profile-worker"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                required
              />
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="form-section-profile">
          <div className="column-worker-profile">
            <label className="titles-datos-worker">Confirmar nueva contraseña*</label>
            <div className="password-input-container">
              <input
                className="inputs-profile-worker"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Vuelva a ingresar su nueva contraseña"
                required
              />
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        {passwordError && (
          <p className="error-msg-profile-worker">{passwordError}</p>
        )}
        <div className="button-container-profile">
          <button className="button-worker" onClick={handlePasswordUpdate}>
            Guardar
          </button>
          <button className="button-worker" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
