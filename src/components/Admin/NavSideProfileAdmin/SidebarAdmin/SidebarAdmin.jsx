import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHomeUser, faWarehouse, faPersonDigging, faChartBar, faBug, faVirus,} from "@fortawesome/free-solid-svg-icons";
import "./SidebarAdmin.css";

const SidebarAdmin = () => {
  const { pathname } = useLocation();

  return (
    <div className="menu-admin">
      <div className="menu-list-admin">
        <Link
          to="/homeAdmin/agricultores"
          className={`item-admin ${
            pathname.includes("agricultores") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faHomeUser} className="icon" />
          Agricultor
        </Link>
        <Link
          to="/homeAdmin/invernaderos"
          className={`item-admin ${
            pathname.includes("invernaderos") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faWarehouse} className="icon" />
          Invernadero
        </Link>
        <Link
          to="/homeAdmin/trabajadores"
          className={`item-admin ${
            pathname.includes("trabajadores") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faPersonDigging} className="icon" />
          Trabajador
        </Link>
        <Link
          to="/homeAdmin/reportes"
          className={`item-admin ${
            pathname.includes("reportes") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faChartBar} className="icon" />
          Reporte
        </Link>
        <Link
          to="/homeAdmin/plagas"
          className={`item-admin ${
            pathname.includes("plagas") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBug} className="icon" />
          Plaga
        </Link>
        <Link
          to="/homeAdmin/enfermedades"
          className={`item-admin ${
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

export default SidebarAdmin;
