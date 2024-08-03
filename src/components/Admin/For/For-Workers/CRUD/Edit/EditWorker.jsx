import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./EditWorker.css";
import AddNotification from "../../../../../LoginNotifications/AddNotification";
import ResponsibleFarmerAndWorker from "../../ComboBox/ResponsibleFarmerAndWorker";

const EditWorker = ({ onCancelClick, idWorker }) => {
  const [records, setRecords] = useState("");
  const [idFarmer, setIdFarmer] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [nameUserExists, setNameUserExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Nuevo estado para controlar el enfoque en los inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para rastrear si el formulario se ha enviado
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalNameUser, setOriginalNameU] = useState("");
  const [idAgricultorResponsable, setidAgricultorResponsable] = useState("");

  const [values, setValues] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    telefono: "",
    correo: "",
    nombreUsuario: "",
    contrasenia: "",
  });

  const [valuesFarmer, setValuesFarmer] = useState({
    nombreAgricultorResponsable: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (name === "correo") {
      setEmailExists(false);
    }
    if (name === "nombreUsuario") {
      setNameUserExists(false);
    }
    if (name === "contrasenia") {
      setPasswordError("");
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true); // Actualiza el estado cuando un input recibe enfoque
    setRecords(""); // Borra el mensaje de error
  };

  const handleInputBlur = () => {
    setIsInputFocused(false); // Actualiza el estado cuando un input pierde el enfoque
  };

  //VALIDACIONES
  const checkEmailExists = async (email) => {
    const response = await fetch(
      `http://localhost:3000/login/check_email_existence`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      }
    );
    const data = await response.json();
    return data.exists;
  };

  const checkUserExists = async (userName) => {
    try {
      const response = await fetch(
        `http://localhost:3000/login/userNameExistence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName: userName }),
        }
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error(
        "Error al verificar la existencia del nombre de usuario:",
        error
      );
      alert("Error al verificar la existencia del nombre de usuario");
    }
  };

  const validateEmail = (email) => {
    // Que el correo sea Gmail, Hotmail, Yahoo o Outlook
    const emailPattern =
      /^[^\s@]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|itoaxaca\.edu.mx)$/;
    return emailPattern.test(email); //true si es valido
  };

  const validatePhone = (phoneNumber) => {
    const phonePattern = /^\(?([0-9]{3})\)?[-.]?([0-9]{3})?[-.]?([0-9]{4})$/;
    return phonePattern.test(phoneNumber) && phoneNumber.length === 10;
  };

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

  //Para obtener la data del Worker y setearla en los INPUT
  useEffect(() => {
    getWorkerById();
  }, [idWorker]);

  const getWorkerById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/worker/${idWorker}`);
      if (response.status === 200) {
        const data = await response.json();
        console.log("Data del trabajador ", data);
        setOriginalNameU(data.nombre_usuario);
        setOriginalEmail(data.correo_electronico);
        setValues({
          primerApellido: data.primer_apellido,
          nombre: data.nombre,
          segundoApellido: data.segundo_apellido,
          telefono: data.telefono,
          correo: data.correo_electronico,
          nombreUsuario: data.nombre_usuario,
          contrasenia: data.contrasenia,
        });
        setIdFarmer(data.id_agricultor);
        const responseAgricultorResponsable = await fetch(
          `http://localhost:3000/farmer/${data.id_agricultor}`
        );
        if (responseAgricultorResponsable.status === 200) {
          const dataResponseAgricultorResponsable =
            await responseAgricultorResponsable.json();
          setValuesFarmer({
            nombreAgricultorResponsable:
              dataResponseAgricultorResponsable.nombre +
              " " +
              dataResponseAgricultorResponsable.primer_apellido +
              " " +
              dataResponseAgricultorResponsable.segundo_apellido,
          });
        }
      }
    } catch (error) {}
  };

  //Data para el fetch de actualizacion
  const data = {
    idFarmer: idFarmer,
    name: values.nombre,
    surname: values.primerApellido,
    secondSurname: values.segundoApellido,
    phone: values.telefono,
    email: values.correo,
    nameUser: values.nombreUsuario,
    password: values.contrasenia,
    role: "worker",
  };

  const onConfirmClick = async () => {
    setIsFormSubmitted(true);

    try {
    // ESPACIO DE VALIDACIONES
    // Validación 1: Campos no vacíos
    for (const key in values) {
      if (values[key] === "") {
        setRecords("Por favor complete todos los campos.");
        return;
      }
    }

    // Validación 2: Correo con formato válido
    if (!validateEmail(values.correo)) {
      //setRecords('El correo electrónico no es válido.');
      return;
    }

    // Validar si el correo electrónico fue modificado
    if (values.correo !== originalEmail) {
      // Realizar la verificación de existencia del nuevo correo electrónico
      const emailExists = await checkEmailExists(values.correo);
      if (emailExists) {
        setEmailExists(true);
        // setRecords('El correo electrónico ya está en uso.');
        return;
      } else {
        setEmailExists(false);
      }
    }

    //Validar si el nombre de usuario fue modificado
    if (values.nombreUsuario !== originalNameUser) {
      // Realizar la verificación de existencia del nuevo correo electrónico
      const nameUserExists = await checkUserExists(values.nombreUsuario);
      if (nameUserExists) {
        setNameUserExists(true);
        return;
      } else {
        setNameUserExists(false);
      }
    }

    // Validación 4: Teléfono válido
    if (!validatePhone(values.telefono)) {
      setRecords("Teléfono no válido (10 dígitos).");
      return;
    }

    // Validación 5: Contraseña válida
    const passwordValidationResult = validatePassword(values.contrasenia);
    if (passwordValidationResult !== true) {
      setPasswordError(passwordValidationResult);
      return;
    }
    // Si todas las validaciones son correctas, proceder a actualizar

    updateWorkerData();
  } catch (error) {
    console.error("Error en la validación de los datos:", error);
    setRecords("Hubo un error al validar los datos.");
  }
};

  const updateWorkerData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/admin/updateWorker/${idWorker}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success(`El trabajador se actualizó correctamente.`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
        setIsLoading(false);
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error al editar al trabajador: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`Error al editar al trabajador, inténtelo más tarde: ${error}`, {
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
      <div className="edit-worker-container">
        <div className="centrar-worker">
          <h4 className="h4edit-worker">Editar trabajador</h4>
          <h5 className="h5edit-worker">*Campos requeridos</h5>
          <label className="label-dato-worker">
            Edite sus datos personales
          </label>
          <div className="form-sec-worker-edit">
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.nombre && "red-label"
                }`}
              >
                Nombre*
              </label>
              <input
                className={`inputs-edit-worker ${
                  isFormSubmitted && !values.nombre && "red-input"
                }`}
                type="text"
                required
                name="nombre"
                placeholder="Ingrese su nombre"
                value={values.nombre}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={values.nombre ? { backgroundColor: "#EFF6FF" } : null}
              />
            </div>
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.primerApellido && "red-label"
                }`}
              >
                Primer apellido*
              </label>
              <input
                className={`inputs-edit-worker ${
                  isFormSubmitted && !values.primerApellido && "red-input"
                }`}
                type="text"
                required
                name="primerApellido"
                value={values.primerApellido}
                placeholder="Ingrese su primer apellido"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={
                  values.primerApellido ? { backgroundColor: "#EFF6FF" } : null
                }
              />
            </div>
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.segundoApellido && "red-label"
                }`}
              >
                Segundo apellido*
              </label>
              <input
                className={`inputs-edit-worker ${
                  isFormSubmitted && !values.segundoApellido && "red-input"
                }`}
                type="text"
                required
                name="segundoApellido"
                value={values.segundoApellido}
                placeholder="Ingrese su segundo apellido"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={
                  values.segundoApellido ? { backgroundColor: "#EFF6FF" } : null
                }
              />
            </div>
          </div>
          <div className="form-sec-worker-edit">
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.correo && "red-label"
                }`}
              >
                Correo*
              </label>
              <input
                className={`inputs-edit-worker ${
                  isFormSubmitted && !values.correo && "red-input"
                }`}
                type="text"
                required
                name="correo"
                value={values.correo}
                placeholder="ejemplo@gmail.com"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={values.correo ? { backgroundColor: "#EFF6FF" } : null}
              />
              {values.correo &&
                !validateEmail(values.correo) &&
                isFormSubmitted && (
                  <p className="error-message-farmer">
                    Correo electrónico inválido.
                  </p>
                )}
              {emailExists && values.correo !== originalEmail && (
                <p className="email-exists-Fr">El correo ya está en uso.</p>
              )}
            </div>
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.telefono && "red-label"
                }`}
              >
                Teléfono*
              </label>
              <input
                className={`inputs-edit-worker ${
                  isFormSubmitted && !values.telefono && "red-input"
                }`}
                type="text"
                required
                name="telefono"
                value={values.telefono}
                placeholder="Ingrese su número telefónico"
                onChange={(e) => {
                  // Filtra solo dígitos y limita a 10 caracteres
                  const phoneNumber = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setValues((prevState) => ({
                    ...prevState,
                    telefono: phoneNumber,
                  }));
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={values.telefono ? { backgroundColor: "#EFF6FF" } : null}
              />
            </div>
            <div></div>
          </div>
          <div className="espacio">
            <label className="label-dato-worker">
              Edite sus datos de inicio de sesión
            </label>
          </div>
          <div className="form-sec-worker-edit">
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.nombreUsuario && "red-label"
                }`}
              >
                Nombre de usuario*
              </label>
              <input
                className={`inputs-edit-worker2 ${
                  isFormSubmitted && !values.nombreUsuario && "red-input"
                }`}
                type="text"
                required
                name="nombreUsuario"
                value={values.nombreUsuario}
                placeholder="Ingrese su nombre de usuario"
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={async () => {
                  handleInputBlur();
                  if (values.nombreUsuario) {
                      const nameUserExists = await checkUserExists(values.nombreUsuario);
                      setNameUserExists(nameUserExists);
                      
                    }
                  }
                }
                style={
                  values.nombreUsuario ? { backgroundColor: "#EFF6FF" } : null
                }
              />
              {nameUserExists && values.nombreUsuario !== originalNameUser && (
                <p className="email-exists-Fr">El nombre de usuario ya está en uso.</p>
              )}
            </div>
            <div className="column-edit-worker">
              <label
                className={`label-worker-e ${
                  isFormSubmitted && !values.contrasenia && "red-label"
                }`}
              >
                Contraseña*
              </label>
              <input
                className={`inputs-edit-worker2 ${
                  isFormSubmitted && !values.contrasenia && "red-input"
                }`}
                type="password"
                required
                name="contrasenia"
                value={values.contrasenia}
                placeholder="Contraseña"
                onChange={(e) => handleInputChange(e)}
                onFocus={handleInputFocus}
                onBlur={async () => {
                  if (values.contrasenia) {
                    const validationMessage = validatePassword(
                      values.contrasenia
                    );
                    if (validationMessage !== true) {
                      setPasswordError(validationMessage);
                    }
                  }
                }}
                style={
                  values.contrasenia ? { backgroundColor: "#EFF6FF" } : null
                }
              />
              {isFormSubmitted && !values.contrasenia && (
                <p className="error-password">
                  Por favor ingrese una contraseña.
                </p>
              )}
              {passwordError && (
                <p className="error-password">{passwordError}</p>
              )}
            </div>
          </div>
          <div className="password-rules-worker-e">
            <label>*La contraseña debe ser mínimo de 8 caracteres.</label>
            <br />
            <label>
              *Debe incluir al menos: una mayúscula, número y un símbolo (Todos
              son válidos).
            </label>
          </div>
          <label className="label-dato-worker">Asigne su agricultor</label>
          <div className="form-sec-worker-edit">
            <div className="column-edit-worker">
              <label className="label-worker-e">Agricultor responsable*</label>
              <ResponsibleFarmerAndWorker
                idFarmer={idFarmer}
                setIdFarmer={setIdFarmer}
                isFormSubmitted={isFormSubmitted}
                value={valuesFarmer.nombreAgricultorResponsable}
                //ModoEdicion
                isEditing={true}
                onFarmerSelected={(farmerId) => {
                  setidAgricultorResponsable(farmerId);
                }}
              />
            </div>
          </div>
          <div className="btn-cont-admin-worker-e">
            <button
              className="button-worker"
              type="submit"
              onClick={onConfirmClick}
            >
              Guardar
            </button>
            <button className="button-worker " onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
          {records && !isInputFocused && (
            <p className="error-message-worker-e">{records}</p>
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

export default EditWorker;