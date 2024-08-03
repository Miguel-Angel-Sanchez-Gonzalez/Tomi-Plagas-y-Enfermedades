import React, { useState, useEffect } from "react";
import "./EditGreenhouse.css";
import AddNotification from "../../../../../LoginNotifications/AddNotification";
import GreenhouseType from "../../ComboBox/GreenhouseType";
import { toast } from "react-toastify";

const EditGreenhouse = ({ onCancelClick, idGreenhouse }) => {
  const [records, setRecords] = useState("");
  const [greenhouseExists, setGreenhouseExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Nuevo estado para controlar el enfoque en los inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para rastrear si el formulario se ha enviado
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [originalName, setOriginalName] = useState("");

  const [values, setValues] = useState({
    nombreInvernadero: "",
    tipoInvernadero: "",
    humedad: "",
    tamanio: "",
  });

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

  const handleInputFocus = () => {
    setIsInputFocused(true); // Actualiza el estado cuando un input recibe enfoque
    setRecords(""); // Borra el mensaje de error
  };

  const handleInputBlur = () => {
    setIsInputFocused(false); // Actualiza el estado cuando un input pierde el enfoque
  };

  //Para obtener la data del Greenhouse y setearla en los INPUT
  useEffect(() => {
    const getGreenhouseById = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/greenhouse/${idGreenhouse}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener el invernadero");
        }
        const data = await response.json();
        setOriginalName(data[0].nombre);
        setValues({
          nombreInvernadero: data[0].nombre,
          tipoInvernadero: data[0].tipo_invernadero,
          humedad: data[0].humedad,
          tamanio: data[0].tamanio,
        });
      } catch (error) {
        console.error("Error en la obtención de datos del invernadero:", error);
      }
    };
    getGreenhouseById();
  }, [idGreenhouse]);

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

  //Data para el fetch de actualizacion
  const data = {
    idFarmer: localStorage.getItem("idFarmer"),
    name: values.nombreInvernadero,
    typeGreenhouse: values.tipoInvernadero,
    humidity: values.humedad,
    size: values.tamanio,
  };

  const onConfirmClick = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    for (const key in values) {
      if (values[key] === "" || !values[key]) {
        setRecords("Por favor complete todos los campos.");
        return;
      }
    }

    try {
      if (values.nombreInvernadero !== originalName) {
        const greenhouseExists = await checkGreenhouseExists(
          values.nombreInvernadero
        );
        if (greenhouseExists) {
          setGreenhouseExists(true);
          return;
        }
      } else {
        setGreenhouseExists(false);
      }

      setIsLoading(true);
      updateGreenhouseData();
    } catch (error) {
      console.error("Error en la confirmación de edición:", error);
      setRecords(
        "Error en la confirmación de edición. Por favor, inténtelo de nuevo más tarde."
      );
    }
  };

  const updateGreenhouseData = () => {
    fetch(`http://localhost:3000/greenhouse/${idGreenhouse}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          toast.success(`El invernadero se actualizó correctamente.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          onCancelClick();
          setIsLoading(false);
        }
      })
      .catch((error) => {
        toast.error(
          `Error al editar al agricultor, inténtelo más tarde: ${error}`,
          {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          }
        );
        setIsLoading(false);
      });
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="edit-greenhouse-container">
        <div className="centrar-greenhouse">
          <h4 className="h4edit-greenhouse">Editar invernadero</h4>
          <h5 className="h5edit-greenhouse">*Campos requeridos</h5>
          <label className="label-dato-greenhouse">
            Edite los datos del invernadero
          </label>
          <div className="form-sec-greenhouse-edit">
            <div className="column-edit-greenhouse">
              <label
                className={`label-greenhouse-e ${
                  isFormSubmitted && !values.nombreInvernadero && "red-label"
                }`}
              >
                Nombre del invernadero*
              </label>
              <input
                className={`inputs-edit-greenhouse ${
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
                }}
                style={
                  values.nombreInvernadero
                    ? { backgroundColor: "#EFF6FF" }
                    : null
                }
              />
              {greenhouseExists && (
                <p className="greenhouse-exists">Nombre ya registrado.</p>
              )}
            </div>
            <div className="column-edit-greenhouse">
              <label
                className={`label-greenhouse-e ${
                  isFormSubmitted && !values.tipoInvernadero && "red-label"
                }`}
              >
                Tipo de invernadero*
              </label>
              <GreenhouseType
                selected={values.tipoInvernadero}
                setSelected={handleTypeGreenhouseSelect}
              />
            </div>
          </div>
          <div className="form-sec-greenhouse-edit">
            <div className="column-edit-greenhouse">
              <label
                className={`label-greenhouse-e ${
                  isFormSubmitted && !values.humedad && "red-label"
                }`}
              >
                Humedad (C°)*
              </label>
              <input
                className={`inputs-edit-greenhouse2 ${
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
                style={values.humedad ? { backgroundColor: "#EFF6FF" } : null}
              />
            </div>
            <div className="column-edit-greenhouse">
              <label
                className={`label-greenhouse-e ${
                  isFormSubmitted && !values.tamanio && "red-label"
                }`}
              >
                Tamaño (mts)*
              </label>
              <input
                className={`inputs-edit-greenhouse2 ${
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
                style={values.tamanio ? { backgroundColor: "#EFF6FF" } : null}
              />
            </div>
          </div>
          <br />
          <div className="button-container-greenhouse ">
            <button
              className="button-greenhouse"
              type="submit"
              onClick={onConfirmClick}
            >
              Guardar
            </button>
            {/* {isLoading ? 'Enviando..' : 'Enviar'} */}
            <button className="button-greenhouse " onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
          {records && !isInputFocused && (
            <p className="error-message-greenhouse">{records}</p>
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

export default EditGreenhouse;
