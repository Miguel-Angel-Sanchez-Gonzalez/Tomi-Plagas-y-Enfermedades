import React, { useState, useEffect } from "react";
import "./RegisterGreenhouse.css";
import AddNotification from "../../../../../LoginNotifications/AddNotification";
import GreenhouseType from "../../ComboBox/GreenhouseType";

import { useNavigate } from "react-router-dom";

const RegisterGreenhouse = ({ onCancelClick }) => {
  const [records, setRecords] = useState("");
  const [greenhouseExists, setGreenhouseExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Nuevo estado para controlar el enfoque en los inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para rastrear si el formulario se ha enviado
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [values, setValues] = useState({
    nombreInvernadero: "",
    tipoInvernadero: "",
    humedad: "",
    tamanio: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cargue el componente");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
    if (name === "nombreInvernadero") {
      setGreenhouseExists(false);
    }
  };

  //PARA LOS COMBOBOX
  const handleTypeGreenhouseSelect = (selectedOption) => {
    setValues({ ...values, tipoInvernadero: selectedOption }); // Actualiza el tipo de invernadero seleccionado
  };

  const handleRespFarmerSelect = (selectedOption) => {
    setValues({ ...values, agricultorResponsable: selectedOption }); // Actualiza el tipo de invernadero seleccionado
  };
  //

  const handleInputFocus = () => {
    setIsInputFocused(true); // Actualiza el estado cuando un input recibe enfoque
    setRecords(""); // Borra el mensaje de error
  };

  const handleInputBlur = () => {
    setIsInputFocused(false); // Actualiza el estado cuando un input pierde el enfoque
  };

  useEffect(() => {
    checkGreenhouseExists();
  }, []);

  /*FUNCIONES*/
  async function checkGreenhouseExists(greenhouseName) {
    try {
      const response = await fetch(
        `http://localhost:3000/greenhouse/checkExist/${greenhouseName}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error al verificar la existencia del invernadero:", error);
      alert(
        "Error al verificar la existencia del invernadero, inténtelo más tarde"
      );
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    for (const key in values) {
      if (values[key] === "" || !values[key]) {
        setRecords("Por favor complete todos los campos.");
        return;
      }
    }

    try {
      const greenhouseExists = await checkGreenhouseExists(
        values.nombreInvernadero
      );
      if (greenhouseExists) {
        setGreenhouseExists(true);
        return;
      }

      setIsLoading(true);
      const data = {
        idFarmer: localStorage.getItem("idFarmer"),
        name: values.nombreInvernadero,
        typeGreenhouse: values.tipoInvernadero,
        humidity: values.humedad,
        size: values.tamanio,
      };

      const response = await fetch("http://localhost:3000/greenhouse/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el invernadero");
      }

      setIsLoading(false);
      setLoadingMessage("Se ha agregado correctamente el invernadero.");
      setTimeout(() => {
        setLoadingMessage("");
        onCancelClick();
      }, 1500);
    } catch (error) {
      console.error("Error al agregar el invernadero:", error);
      setRecords("Por favor, inténtelo de nuevo más tarde.");
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
      <div className="register-greenhouse-container">
        <div className="centrar-greenhouse">
          <h4 className="h4register-greenhouse">Registrar invernadero</h4>
          <h5 className="h5register-greenhouse">*Campos requeridos</h5>
          <label className="label-dato-greenhouse">
            Registre los datos del invernadero
          </label>
          <div className="form-sec-greenhouse-register">
            <div className="column-register-greenhouse">
              <label
                className={`label-greenhouse-r ${
                  isFormSubmitted && !values.nombreInvernadero && "red-label"
                }`}
              >
                Nombre del invernadero*
              </label>
              <input
                className={`inputs-register-greenhouse ${
                  isFormSubmitted && !values.nombreInvernadero && "red-input"
                }`}
                type="text"
                required
                name="nombreInvernadero"
                placeholder="Ingrese el nombre del invernadero"
                value={values.nombreInvernadero}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={async () => {
                  handleInputBlur();
                  if (values.nombreInvernadero) {
                    const greenhouseExists = await checkGreenhouseExists(
                      values.nombreInvernadero
                    );
                    setGreenhouseExists(greenhouseExists);
                  }
                }}
              />
              {greenhouseExists && (
                <p className="greenhouse-exists-r">Nombre ya registrado.</p>
              )}
            </div>
            <div className="column-register-greenhouse">
              <label
                className={`label-greenhouse-r ${
                  isFormSubmitted && !values.tipoInvernadero && "red-label"
                }`}
              >
                Tipo de invernadero*
              </label>
              <GreenhouseType
                selected={values.tipoInvernadero}
                setSelected={handleTypeGreenhouseSelect}
                isFormSubmitted={isFormSubmitted}
              />
            </div>
          </div>
          <div className="form-sec-greenhouse-register">
            <div className="column-register-greenhouse">
              <label
                className={`label-greenhouse-r ${
                  isFormSubmitted && !values.humedad && "red-label"
                }`}
              >
                Humedad (C°)*
              </label>
              <input
                className={`inputs-register-greenhouse2 ${
                  isFormSubmitted && !values.humedad && "red-input"
                }`}
                type="text"
                required
                name="humedad"
                placeholder="Humedad en °C"
                value={values.humedad}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            <div className="column-register-greenhouse">
              <label
                className={`label-greenhouse-r ${
                  isFormSubmitted && !values.tamanio && "red-label"
                }`}
              >
                Tamaño (mts)*
              </label>
              <input
                className={`inputs-register-greenhouse2 ${
                  isFormSubmitted && !values.tamanio && "red-input"
                }`}
                type="text"
                required
                name="tamanio"
                placeholder="Ingrese el tamaño en mts."
                value={values.tamanio}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
          <br />

          <div className="button-container-greenhouse ">
            <button
              className="button-greenhouse"
              type="submit"
              onClick={handleSubmit}
            >
              Guardar
            </button>
            {/* {isLoading ? 'Enviando..' : 'Enviar'} */}
            <button className="button-greenhouse " onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
          {records && !isInputFocused && (
            <p className="error-message-greenhouse-r">{records}</p>
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

export default RegisterGreenhouse;
