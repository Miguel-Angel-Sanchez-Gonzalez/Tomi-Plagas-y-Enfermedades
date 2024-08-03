import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const parseJwt = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;
  const userRole = user ? user.rolUsuario : null;

  const tokenIsValid = user && user.exp * 1000 > Date.now();
  const isAuthorized = userRole && allowedRoles.includes(userRole);

  if (!tokenIsValid) {
    localStorage.removeItem('token');
    toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.")
    return (
      <>
        <ToastContainer/>
        <Navigate to="/login" replace state={{ from: location }} />
      </>
    );
  }

  if (!isAuthorized) {
    const redirectPath = userRole === 'admin' ? '/homeAdmin/agricultores' :
                         userRole === 'farmer' ? '/homeFarmer/notificaciones' :
                         '/homeWorker/notificaciones'; // Default to worker if something goes wrong
    toast.info("Acceso restringido a esta área.");
    return (
      <>
        <ToastContainer/>
        <Navigate to={redirectPath} replace state={{ from: location }} />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
