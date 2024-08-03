import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import "./SidebarWorker.css";
import {faWarehouse, faBug, faVirus, faBell} from "@fortawesome/free-solid-svg-icons";

const SidebarWorker = () => {
  const { pathname } = useLocation();
  return (
    <div className="menu-worker">
      <div className="menu-list-worker">
        <Link
          to="/homeWorker/notificaciones"
          className={`item-worker ${
            pathname.includes("notificaciones") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBell} className="icon" />
          Notificaciones
        </Link>
        <Link
          to="/homeWorker/invernaderos"
          className={`item-worker ${
            pathname.includes("invernaderos") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faWarehouse} className="icon" />
          Invernadero
        </Link>
        <Link
          to="/homeWorker/plagas"
          className={`item-worker ${
            pathname.includes("plagas") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBug} className="icon" />
          Plaga
        </Link>
        <Link
          to="/homeWorker/enfermedades"
          className={`item-worker ${
            pathname.includes("enfermedades") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faVirus} className="icon" />
          Enfermedad
        </Link>
      </div>
    </div>
  );
};

export default SidebarWorker;
