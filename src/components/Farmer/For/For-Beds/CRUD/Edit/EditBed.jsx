import React, { useState, useEffect } from "react";
import "./EditBed.css";
import AddNotification from "../../../../../LoginNotifications/AddNotification";
import { toast } from "react-toastify";

const EditBed = ({ onCancelClick, idGreenhouse, idBed }) => {
  const [records, setRecords] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  console.log("Los valores son " + idBed + idGreenhouse);
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
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setRecords("");
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  useEffect(() => {
    const getGreenhouseById = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bed/${idBed}`);
        if (!response.ok) {
          throw new Error("Error al obtener la cama seleccionada");
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data.length > 0) {
          const bedData = data[0];
          setValues({
            numeroCama: bedData.numero_cama || "",
            tipoCultivo: bedData.tipo_cultivo || "",
          });
        } else {
          console.error("No se encontraron datos para la cama seleccionada");
        }
      } catch (error) {
        console.error("Error al obtener la cama:", error);
        setIsLoading(false);
      }
    };
    getGreenhouseById();
  }, [idBed]);

  const data = {
    idGreenhouse: idGreenhouse,
    numberBed: values.numeroCama,
    typeCrop: values.tipoCultivo,
  };

  const onConfirmClick = async () => {
    setIsFormSubmitted(true);
    if (values.numeroCama === "" || values.tipoCultivo === "") {
      setRecords("Por favor complete todos los campos.");
      return;
    }
    updateBedData();
  };

  const updateBedData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/bed/${idBed}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        toast.success(`La cama se actualizó correctamente`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(`Error al editar la cama, inténtelo más tarde: ${error}`, {
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
      <div className="edit-bed-container">
        <div className="centrar-bed">
          <h4 className="h4edit-bed">Edite cama</h4>
          <h5 className="h5edit-bed">*Campos requeridos</h5>
          <label className="label-dato-bed">Edite una nueva cama</label>
          <div className="form-sec-bed-edit">
            <div className="column-edit-bed">
              <label
                className={`label-bed-e ${
                  isFormSubmitted && !values.numeroCama && "red-label"
                }`}
              >
                Número de la cama*
              </label>
              <input
                className={`inputs-edit-bed ${
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
                style={
                  values.numeroCama ? { backgroundColor: "#EFF6FF" } : null
                }
              />
            </div>
            <div className="column-edit-bed">
              <label
                className={`label-bed-e ${
                  isFormSubmitted && !values.tipoCultivo && "red-label"
                }`}
              >
                Tipo de cultivo*
              </label>
              <input
                className={`inputs-edit-bed ${
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
                style={
                  values.tipoCultivo ? { backgroundColor: "#EFF6FF" } : null
                }
              />
            </div>
          </div>

          <div className="button-container-bed ">
            <button
              className="button-bed"
              type="submit"
              onClick={onConfirmClick}
            >
              Guardar
            </button>
            <button className="button-bed " onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
          {records && !isInputFocused && (
            <p className="error-message-bed-e">{records}</p>
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

export default EditBed;
