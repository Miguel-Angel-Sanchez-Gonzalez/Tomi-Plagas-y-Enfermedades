import React, { useState, useEffect } from "react";
import "./RegisterBed.css";
import AddNotification from "../../../../../LoginNotifications/AddNotification";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RegisterBed = ({ onCancelClick, idGreenhouse }) => {
  const [records, setRecords] = useState("");
  //const [idGreenhouse, setIdGreenhouse] = useState('');
  const [bedExists, setBedExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Nuevo estado para controlar el enfoque en los inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para rastrear si el formulario se ha enviado
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [values, setValues] = useState({
    numeroCama: "",
    tipoCultivo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
    // if (name === 'numeroCama') {
    //   setBedExists(false);
    // }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true); // Actualiza el estado cuando un input recibe enfoque
    setRecords(""); // Borra el mensaje de error
  };

  const handleInputBlur = () => {
    setIsInputFocused(false); // Actualiza el estado cuando un input pierde el enfoque
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    // Validación específica para cada campo
    if (values.numeroCama === "" || values.tipoCultivo === "") {
      setRecords("Por favor complete todos los campos.");
      return;
    }

    setIsLoading(true);
    const data = {
      numberBed: values.numeroCama,
      typeCrop: values.tipoCultivo,
      idGreenhouse: idGreenhouse,
    };

    //Se esta haciendo la promesa
    //Post para insertar los datos de un invernadero
    const response = await fetch(`${backendUrl}/bed/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response) {
      const responseData = await response.json();
      const { id } = responseData; // Obtiene el ID del agricultor del backend
      setIsLoading(false);
      setLoadingMessage("Se ha agregado correctamente la cama.");
      setTimeout(() => {
        setLoadingMessage(""); // Oculta el mensaje después de unos segundos
        onCancelClick();
      }, 1500); // Mostrar el mensaje durante 3 segundos
    } else {
      alert("Por favor, inténtelo de nuevo más tarde.");
      setIsLoading(false); // Agregar para detener la pantalla de carga
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="register-bed-container">
        <div className="centrar-bed">
          <h4 className="h4register-bed">Registrar cama</h4>
          <h5 className="h5register-bed">*Campos requeridos</h5>
          <label className="label-dato-bed">Registre una nueva cama</label>
          <div className="form-sec-bed-register">
            <div className="column-register-bed">
              <label
                className={`label-bed-r ${
                  isFormSubmitted && !values.numeroCama && "red-label"
                }`}
              >
                Número de la cama*
              </label>
              <input
                className={`inputs-register-bed ${
                  isFormSubmitted && !values.numeroCama && "red-input"
                }`}
                type="text"
                required
                name="numeroCama"
                placeholder="Ingrese el número de cama"
                value={values.numeroCama}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                // onBlur={async () => {
                //   handleInputBlur();
                //   if (values.nombreInvernadero) {
                //     const bedExists = await checkBedExists(values.nombreInvernadero);
                //     setBedExists(bedExists);
                //   }
                // }}
              />
              {bedExists && (
                <p className="bed-exists-r">Nombre ya registrado.</p>
              )}
            </div>
            <div className="column-register-bed">
              <label
                className={`label-bed-r ${
                  isFormSubmitted && !values.tipoCultivo && "red-label"
                }`}
              >
                Tipo de cultivo*
              </label>
              <input
                className={`inputs-register-bed ${
                  isFormSubmitted && !values.tipoCultivo && "red-input"
                }`}
                type="text"
                required
                name="tipoCultivo"
                placeholder="Ingrese el tipo de cultivo"
                value={values.tipoCultivo}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div className="button-container-bed ">
            <button className="button-bed" type="submit" onClick={handleSubmit}>
              Guardar
            </button>
            {/* {isLoading ? 'Enviando..' : 'Enviar'} */}
            <button className="button-bed " onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
          {records && !isInputFocused && (
            <p className="error-message-bed-r">{records}</p>
          )}
        </div>
        {loadingMessage && (
          <AddNotification
            message={loadingMessage}
            onClose={() => setLoadingMessage("")}
            className="farmer-notification"
          />
        )}
      </div>
    </div>
  );
};

export default RegisterBed;
