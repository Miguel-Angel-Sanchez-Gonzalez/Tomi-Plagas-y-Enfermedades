import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../../UserContext";
import "./ProfileAdmin.css";
import UpdatePasswordA from "../UpdatePasswordA/UpdatePasswordA";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProfileAdmin = ({ onCancelClick }) => {
  const { user, updateUser } = useContext(UserContext);
  const [records, setRecords] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [nameUserExists, setNameUserExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalNameUser, setOriginalNameU] = useState("");
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const [values, setValues] = useState({
    nombre: user.username,
    primerApellido: user.lastname,
    segundoApellido: user.secondLastname,
    telefono: "",
    correo: user.email,
    nombreUsuario: user.username,
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

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setRecords("");
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(
        `${backendUrl}/login/check_email_existence`,
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
      toast.error("Error al verificar la existencia del correo electrónico.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const checkUserExists = async (userName) => {
    try {
      const response = await fetch(
        `${backendUrl}/login/userNameExistence`,
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
    const emailPattern =
      /^[^\s@]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|itoaxaca\.edu.mx)$/;
    return emailPattern.test(email);
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

  useEffect(() => {
    getDataAdmin();
  }, []);

  const getDataAdmin = async () => {
    try {
      const response = await fetch(`${backendUrl}/admin/`);
      if (response.status === 200) {
        const data = await response.json();
        console.log(data[0]);
        setOriginalNameU(data[0].nombre_usuario);
        setOriginalEmail(data[0].correo_electronico);
        setValues({
          nombre: data[0].nombre,
          primerApellido: data[0].primer_apellido,
          segundoApellido: data[0].segundo_apellido,
          telefono: data[0].telefono,
          correo: data[0].correo_electronico,
          nombreUsuario: data[0].nombre_usuario,
          contrasenia: data[0].contrasenia,
        });
      } else {
        toast.error("Error al obtener al administrador.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Error al obtener al administrador.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      console.error("Error al obtener al administrador:", error);
      setIsLoading(false);
    }
  };

  const data = {
    name: values.nombre,
    surname: values.primerApellido,
    secondSurname: values.segundoApellido,
    phone: values.telefono,
    email: values.correo,
    nameUser: values.nombreUsuario,
    password: values.contrasenia,
  };

  const onConfirmClick = async () => {
    setIsFormSubmitted(true);

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

        return;
      } else {
        setEmailExists(false);
      }
    }

    // Validar si el nombre de usuario fue modificado
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

    if (!validatePhone(values.telefono)) {
      setRecords("Teléfono no válido (10 dígitos).");
      return;
    }

    const passwordValidationResult = validatePassword(values.contrasenia);
    if (passwordValidationResult !== true) {
      setPasswordError(passwordValidationResult);
      return;
    }

    updateAdminData();
  };

  const updateAdminData = async () => {
    setIsLoading(true);
    const data = {
      name: values.nombre,
      surname: values.primerApellido,
      secondSurname: values.segundoApellido,
      phone: values.telefono,
      email: values.correo,
      nameUser: values.nombreUsuario,
      password: values.contrasenia,
    };

    try {
      const response = await fetch(`${backendUrl}/admin/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        onCancelClick();
        setIsLoading(false);
        toast.success("El administrador se actualizó correctamente.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          onClose: () => {
            updateUser({
              username: data.name,
              lastname: data.surname,
              secondLastname: data.secondSurname,
              email: data.email,
            });
          },
        });
      } else {
        toast.error("No se pudo actualizar al administrador.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error al actualizar al administrador:", error);
      toast.error("Error al actualizar al administrador.", {
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
        <div className="loading-overlay2">
          <div className="loading-spinner2"></div>
        </div>
      )}

      {showUpdatePassword ? (
        <UpdatePasswordA
          onCancel={() => setShowUpdatePassword(false)}
          onPasswordUpdate={() => {
            setShowUpdatePassword(false);
            getDataAdmin();
          }}
        />
      ) : (
        <>
          <div className="profile-admin-form2">
            <div className="centrar-admin2">
              <h4 className="h4profile2">Editar administrador</h4>
              <h5 className="h5profile2">*Campos requeridos</h5>
              <label className="titles-datos-admin2">
                Edite sus datos personales
              </label>
              <div className="form-section-profile2">
                <div className="column-admin-profile2">
                  <label
                    className={`titles-admin2 ${
                      isFormSubmitted && !values.nombre && "red-label2"
                    }`}
                  >
                    Nombre*
                  </label>
                  <input
                    className={`inputs-profile-admin22 ${
                      isFormSubmitted && !values.nombre && "red-input2"
                    }`}
                    type="text"
                    required
                    name="nombre"
                    placeholder="Ingrese su nombre"
                    value={values.nombre}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={
                      values.nombre ? { backgroundColor: "#EFF6FF" } : null
                    }
                  />
                </div>
                <div className="column-admin-profile2">
                  <label
                    className={`titles-admin2 ${
                      isFormSubmitted && !values.primerApellido && "red-label2"
                    }`}
                  >
                    Primer apellido*
                  </label>
                  <input
                    className={`inputs-profile-admin22 ${
                      isFormSubmitted && !values.primerApellido && "red-input2"
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
                      values.primerApellido
                        ? { backgroundColor: "#EFF6FF" }
                        : null
                    }
                  />
                </div>
                <div className="column-admin-profile2">
                  <label
                    className={`titles-admin2 ${
                      isFormSubmitted && !values.segundoApellido && "red-label2"
                    }`}
                  >
                    Segundo apellido*
                  </label>
                  <input
                    className={`inputs-profile-admin22 ${
                      isFormSubmitted && !values.segundoApellido && "red-input2"
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
                      values.segundoApellido
                        ? { backgroundColor: "#EFF6FF" }
                        : null
                    }
                  />
                </div>
              </div>
              <div className="form-section-profile2">
                <div className="column-admin-profile2">
                  <label
                    className={`titles-admin2 ${
                      isFormSubmitted && !values.correo && "red-label2"
                    }`}
                  >
                    Correo*
                  </label>
                  <input
                    className={`inputs-profile-admin22 ${
                      isFormSubmitted && !values.correo && "red-input2"
                    }`}
                    type="email"
                    required
                    name="correo"
                    placeholder="ejemplo@gmail.com"
                    value={values.correo}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={
                      values.correo ? { backgroundColor: "#EFF6FF" } : null
                    }
                  />
                  {values.correo &&
                    !validateEmail(values.correo) &&
                    isFormSubmitted && (
                      <p className="error-message-admin">
                        Correo electrónico inválido.
                      </p>
                    )}
                  {emailExists && values.correo !== originalEmail && (
                    <p className="email-exists-Fr">El correo ya está en uso.</p>
                  )}
                </div>
                <div className="column-admin-profile2">
                  <label
                    className={`titles-admin2 ${
                      isFormSubmitted && !values.telefono && "red-label2"
                    }`}
                  >
                    Teléfono*
                  </label>
                  <input
                    className={`inputs-profile-admin22 ${
                      isFormSubmitted && !values.telefono && "red-input2"
                    }`}
                    type="text"
                    required
                    name="telefono"
                    placeholder="Ingrese su número telefónico"
                    value={values.telefono}
                    onChange={(e) => {
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
                    style={
                      values.telefono ? { backgroundColor: "#EFF6FF" } : null
                    }
                  />
                </div>
                <div></div>
              </div>
              <div className="espacio">
                <h4 className="titles-datos-admin2">
                  Edite sus datos de inicio de sesión
                </h4>
              </div>
              <div className="form-section-profile2">
                <div className="column-admin-profile2">
                  <label
                    className={`titles-admin2 ${
                      isFormSubmitted && !values.nombreUsuario && "red-label2"
                    }`}
                  >
                    Nombre de usuario*
                  </label>
                  <input
                    className={`inputs-profile-admin22 ${
                      isFormSubmitted && !values.nombreUsuario && "red-input2"
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
                        const nameUserExists = await checkUserExists(
                          values.nombreUsuario
                        );
                        setNameUserExists(nameUserExists);
                      }
                    }}
                    style={
                      values.nombreUsuario
                        ? { backgroundColor: "#EFF6FF" }
                        : null
                    }
                  />
                  {nameUserExists &&
                    values.nombreUsuario !== originalNameUser && (
                      <p className="email-exists-Fr">
                        El nombre de usuario ya está en uso.
                      </p>
                    )}
                </div>
                <div className="column-edit-admin">
                  <label
                    className="label-admin-change-password"
                    onClick={() => setShowUpdatePassword(true)}
                  >
                    Cambiar contraseña
                    <br />
                    <span className="password-invite-text-admin">
                      ¿Desea cambiar la contraseña?
                    </span>
                  </label>
                </div>
              </div>
              <div className="button-container-profile2">
                <button
                  className="button-admin2"
                  type="submit"
                  onClick={onConfirmClick}
                >
                  Guardar
                </button>
                <button className="button-admin2 " onClick={onCancelClick}>
                  Cancelar
                </button>
              </div>
              {records && !isInputFocused && (
                <p className="error-msg-profile-admin2">{records}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileAdmin;
