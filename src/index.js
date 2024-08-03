import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Main from "./components/Main/Main";
import "./index.css";
import { UserProvider } from './UserContext'; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <Main />
        <ToastContainer />
      </UserProvider>
    </Router>
  </React.StrictMode>
);
