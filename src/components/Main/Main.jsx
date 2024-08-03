import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../Login/Login.jsx";
import HomeAdmin from "../Admin/HomeAdmin/HomeAdmin.jsx";
import HomeFarmer from "../Farmer/HomeFarmer/HomeFarmer.jsx";
import HomeWorker from "../Worker/HomeWorker/HomeWorker.jsx";
import ProtectedRoute from "../../ProtectedRoute.jsx";

function parseJwt(token) {
  if (!token || token === "") return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const Main = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? parseJwt(token) : null;
  const userRole = decodedToken ? decodedToken.rolUsuario : null;
  const tokenIsValid = decodedToken && decodedToken.exp * 1000 > Date.now();

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/homeAdmin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HomeAdmin/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeFarmer/*"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <HomeFarmer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeWorker/*"
          element={
            <ProtectedRoute allowedRoles={['worker']}>
              <HomeWorker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            tokenIsValid ? (
              userRole === "admin" ? (
                <Navigate to="/homeAdmin/agricultores" replace />
              ) : userRole === "farmer" ? (
                <Navigate to="/homeFarmer/notificaciones" replace />
              ) : userRole === "worker" ? (
                <Navigate to="/homeWorker/notificaciones" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
  );
};

export default Main;
