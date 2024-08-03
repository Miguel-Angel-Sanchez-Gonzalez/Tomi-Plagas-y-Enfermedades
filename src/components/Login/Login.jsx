import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import LoginNotification from "../LoginNotifications/LoginNotifications";
import PasswordRecovery from "../LoginRecoveryPassword/PasswordRecovery/PasswordRecovery";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigateBasedOnRole();
    }
  }, []);

  const fetchUserData = () => {
    const data2 = {
      username: localStorage.getItem("username"),
      role: localStorage.getItem("userRole"),
    };

    fetch("http://localhost:3000/login/getDataByUsername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        return response.json();
      })
      .then((result) => {
        console.log("La data del usuario es:");
        console.log("Result ", result);
        if (result.rol === "farmer") {
          localStorage.setItem("idFarmer", result.id_agricultor);
        }
        if (result.rol === "worker") {
          localStorage.setItem("idFarmer", result.id_agricultor);
          localStorage.setItem("idWorker", result.id_trabajador);
        }
        localStorage.setItem("username", result.nombre);
        localStorage.setItem("lastname", result.primer_apellido);
        localStorage.setItem("secondlastname", result.segundo_apellido);
        localStorage.setItem("email", result.correo_electronico);
        navigateBasedOnRole();
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Error al obtener los datos del usuario");
      })
      .finally(() => {
        setLoadingUserData(false);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoadingUserData(true);

    const data = {
      username: username,
      password: password,
    };

    const response = fetch(``);

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.token) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("userRole", result.rol);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          fetchUserData();
        } else {
          setErrorMessage(
            "Las credenciales proporcionadas son inválidas. Por favor, verifica tu nombre de usuario y contraseña"
          );
          setLoadingUserData(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Error al iniciar sesión");
        setLoadingUserData(false);
      });
  };

  const navigateBasedOnRole = () => {
    const role = localStorage.getItem("userRole");
    switch (role) {
      case "admin":
        navigate("/homeAdmin/agricultores");
        break;
      case "farmer":
        navigate("/homeFarmer/notificaciones");
        break;
      case "worker":
        navigate("/homeWorker/notificaciones");
        break;
      default:
        navigate("/login");
        break;
    }
  };

  const handleRecoveryClick = () => {
    setShowRecovery(true);
  };

  // Si el usuario ya está autenticado, redirige a la página correspondiente
  if (localStorage.getItem("token")) {
    navigateBasedOnRole();
    return null; // Renderiza nada para evitar la breve renderización del componente Login
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <img
        src="/images/farmedwithfruit3d.png"
        alt="Fruit farm"
        className="img-fruit"
      />
      <img
        src="/images/womenfarmer.png"
        alt="Woman farmer"
        className="img-women"
      />
      <form className="login-form" onSubmit={handleLogin}>
        <label className="login-label">Bienvenido de nuevo</label>
        <label className="login-label1">Iniciar sesión</label>
        <div className="input-datos">
          <input
            onChange={(event) => setUsername(event.target.value)}
            type="text"
            required
          />
          <label>Ingresa tu nombre de usuario</label>
        </div>
        <div className="input-datos">
          <input
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            required
          />
          <label>Contraseña</label>
          <i
            className={`uil ${showPassword ? "uil-eye" : "uil-eye-slash"} toggle`}
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        <button className="login-button" type="submit">
          Iniciar sesión
        </button>
        <label className="login-abajo" onClick={handleRecoveryClick}>
          Olvidé mi contraseña
        </label>
        {errorMessage && (
          <LoginNotification
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </form>

      {showRecovery && (
        <PasswordRecovery onClose={() => setShowRecovery(false)} />
      )}
      {loadingUserData && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando datos del usuario...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
