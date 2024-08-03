import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./EditFarmer.css";
import AddNotification from "../../../../../LoginNotifications/AddNotification";


const EditFarmer = ({ onCancelClick, idFarmer }) => {
  const [records, setRecords] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [nameUserExists, setNameUserExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Nuevo estado para controlar el enfoque en los inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para rastrear si el formulario se ha enviado
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalNameUser, setOriginalNameU] = useState("");


  const [values, setValues] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    telefono: "",
    correo: "",
    nombreUsuario: "",
    contrasenia: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
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

  //ENFOQUES
  const handleInputFocus = () => {
    setIsInputFocused(true); // Actualiza el estado cuando un input recibe enfoque
    setRecords(""); // Borra el mensaje de error
  };

  const handleInputBlur = () => {
    setIsInputFocused(false); // Actualiza el estado cuando un input pierde el enfoque
  };

  //VALIDACIONES
  const checkEmailExists = async (email) => {
    try {
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
    } catch (error) {
      console.error(
        "Error al verificar la existencia del correo electrónico:",
        error
      );
      throw error;
    }
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

  //VALIDACIONES
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

  //Para el fetch de recuperacion de data del farmer, mostrar los datos del agricultor
  useEffect(() => {
    getFarmerById();
  }, [idFarmer]);

  const getFarmerById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/farmer/${idFarmer}`);
      if (response.status === 200) {
        const data = await response.json();
        console.log("Data del agricultor", data);
        setOriginalNameU(data.nombre_usuario);
        setOriginalEmail(data.correo_electronico);
        // Actualizar el estado con los datos del agricultor
        setValues({
          nombre: data.nombre,
          primerApellido: data.primer_apellido,
          segundoApellido: data.segundo_apellido,
          telefono: data.telefono,
          correo: data.correo_electronico,
          nombreUsuario: data.nombre_usuario,
          contrasenia: data.contrasenia,
        });
      } else {
        throw new Error("Error al obtener los datos del agricultor");
      }
    } catch (error) {
      console.error(
        "Hubo un error al obtener los datos del agricultor:",
        error
      );
      setRecords("Hubo un error al obtener los datos del agricultor.");
    }
  };

  //Data para el fetch de actualizacion
  const data = {
    name: values.nombre,
    surname: values.primerApellido,
    secondSurname: values.segundoApellido,
    phone: values.telefono,
    email: values.correo,
    nameUser: values.nombreUsuario,
    password: values.contrasenia
  };

  const onConfirmClick = async () => {
    setIsFormSubmitted(true);

    try {
      // Validación 1: Campos no vacíos
      for (const key in values) {
        if (values[key] === "") {
          setRecords("Por favor complete todos los campos.");
          return;
        }
      }

      // Validación 2: Correo con formato válido
      if (!validateEmail(values.correo)) {
        setRecords("El correo electrónico no es válido.");
        return;
      }

      // Validar si el correo electrónico fue modificado
      if (values.correo !== originalEmail) {
        // Realizar la verificación de existencia del nuevo correo electrónico
        const emailExists = await checkEmailExists(values.correo);
        if (emailExists) {
          setEmailExists(true);
        
          return;
        } else {
          setEmailExists(false);
        }
      }

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
      updateFarmerData();
    } catch (error) {
      console.error("Error en la validación de los datos:", error);
      setRecords("Hubo un error al validar los datos.");
    }
  };

  const updateFarmerData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/admin/updateFarmer/${idFarmer}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        toast.success(`El agricultor se actualizó correctamente`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(`Error al editar al agricultor, inténtelo más tarde: ${error}`, {
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
      <div className="edit-farmer-container">
        <div className="centrar-farmer">
          <h4 className="h4edit-farmer">Editar agricultor</h4>
          <h5 className="h5edit-farmer">*Campos requeridos</h5>
          <label className="label-dato-farmer">
            Edite sus datos personales
          </label>
          <div className="form-sec-farmer-edit">
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.nombre && "red-label"
                }`}
              >
                Nombre*
              </label>
              <input
                className={`inputs-edit-farmer ${
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
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.primerApellido && "red-label"
                }`}
              >
                Primer apellido*
              </label>
              <input
                className={`inputs-edit-farmer ${
                  isFormSubmitted && !values.primerApellido && "red-input"
                }`}
                type="text"
                required
                name="primerApellido"
                placeholder="Ingrese su primer apellido"
                value={values.primerApellido}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={
                  values.primerApellido ? { backgroundColor: "#EFF6FF" } : null
                }
              />
            </div>
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.segundoApellido && "red-label"
                }`}
              >
                Segundo apellido*
              </label>
              <input
                className={`inputs-edit-farmer ${
                  isFormSubmitted && !values.segundoApellido && "red-input"
                }`}
                type="text"
                required
                name="segundoApellido"
                placeholder="Ingrese su segundo apellido"
                value={values.segundoApellido}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={
                  values.segundoApellido ? { backgroundColor: "#EFF6FF" } : null
                }
              />
            </div>
          </div>
          <div className="form-sec-farmer-edit">
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.correo && "red-label"
                }`}
              >
                Correo*
              </label>
              <input
                className={`inputs-edit-farmer ${
                  isFormSubmitted && !values.correo && "red-input"
                }`}
                type="email"
                required
                name="correo"
                placeholder="ejemplo@gmail.com"
                value={values.correo}
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
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.telefono && "red-label"
                }`}
              >
                Teléfono*
              </label>
              <input
                className={`inputs-edit-farmer ${
                  isFormSubmitted && !values.telefono && "red-input"
                }`}
                type="text"
                required
                name="telefono"
                placeholder="Ingrese su número telefónico"
                value={values.telefono}
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

          <label className="label-dato-farmer">
            Edite sus datos de inicio de sesión
          </label>
          <div className="form-sec-farmer-edit">
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.nombreUsuario && "red-label"
                }`}
              >
                Nombre de usuario*
              </label>
              <input
                className={`inputs-edit-farmer2 ${
                  isFormSubmitted && !values.nombreUsuario && "red-input"
                }`}
                type="text"
                required
                name="nombreUsuario"
                placeholder="Ingrese su nombre de usuario"
                value={values.nombreUsuario}
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
            <div className="column-edit-farmer">
              <label
                className={`label-farmer-e ${
                  isFormSubmitted && !values.contrasenia && "red-label"
                }`}
              >
                Contraseña*
              </label>
              <input
                className={`inputs-edit-farmer2 ${
                  isFormSubmitted && !values.contrasenia && "red-input"
                }`}
                type="password"
                required
                name="contrasenia"
                placeholder="Contraseña"
                value={values.contrasenia}
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
          <div className="password-rules-farmer-e">
            <label>*La contraseña debe ser mínimo de 8 caracteres.</label>
            <br />
            <label>
              *Debe incluir al menos: una mayúscula, número y un símbolo (Todos
              son válidos).
            </label>
          </div>
          <div className="button-container-admin">
            <button
              className="button-farmer"
              type="submit"
              onClick={onConfirmClick}
            >
              Guardar
            </button>
            <button className="button-farmer " onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
          {records && !isInputFocused && (
            <p className="error-message-farmer-e">{records}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFarmer;
