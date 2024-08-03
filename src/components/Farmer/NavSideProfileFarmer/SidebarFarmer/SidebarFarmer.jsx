import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import "./SidebarFarmer.css";
import {faWarehouse, faPersonDigging, faChartBar, faBug, faVirus, faBell,} from "@fortawesome/free-solid-svg-icons";

const SidebarFarmer = () => {
  const { pathname } = useLocation();

  return (
    <div className="menu-farmer">
      <div className="menu-list-farmer">
        <Link
          to="/homeFarmer/notificaciones"
          className={`item-farmer ${
            pathname.includes("notificaciones") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBell} className="icon" />
          Notificaciones
        </Link>
        <Link
          to="/homeFarmer/invernaderos"
          className={`item-farmer ${
            pathname.includes("invernaderos") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faWarehouse} className="icon" />
          Invernadero
        </Link>
        <Link
          to="/homeFarmer/trabajadores"
          className={`item-farmer ${
            pathname.includes("trabajadores") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faPersonDigging} className="icon" />
          Trabajador
        </Link>
        <Link
          to="/homeFarmer/reportes"
          className={`item-farmer ${
            pathname.includes("reportes") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faChartBar} className="icon" />
          Reporte
        </Link>
        <Link
          to="/homeFarmer/plagas"
          className={`item-farmer ${
            pathname.includes("plagas") ? "active" : ""
          }`}
        >
          <FontAwesomeIcon icon={faBug} className="icon" />
          Plaga
        </Link>
        <Link
          to="/homeFarmer/enfermedades"
          className={`item-farmer ${
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

export default SidebarFarmer;
