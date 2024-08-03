import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./HomeAdmin.css";
import NavbarAdmin from "../NavSideProfileAdmin/NavbarAdmin/NavbarAdmin";
import SidebarAdmin from "../NavSideProfileAdmin/SidebarAdmin/SidebarAdmin";
import DTableDiseases from "../For/For-Diseases/DTableDiseases/DTableDiseases";
import DTableFarmers from "../For/For-Farmers/DTableFarmers/DTableFarmers";
import ProfileAdmin from "../NavSideProfileAdmin/ProfileAdmin/ProfileAdmin";
import DTableGreenhouses from "../For/For-Greenhouses/DTableGreenhouses/DTableGreenhouses";
import DTablePlagues from "../For/For-Plagues/DTablePlagues/DTablePlagues";
import DTableWorkers from "../For/For-Workers/DTableWorkers/DTableWorkers";
import Dashboard from "../../Dashboard/Dashboard";
import DTableBeds from "../For/For-Beds/DTableBeds/DTableBeds";
import DTableImagesA from "../For/For-ImagesAnalized/DTableImagesAnalized/DTableImagesA";
import DTableWorkerGreen from "../For/For-WorkerGreen/DTableWorkerGreen/DTableWorkerGreen";
import CardImagesAnalized from "../For/For-ImagesAnalized/CardImagesAnalized";

const RedirectToAgricultores = () => {
  return <Navigate to="/homeAdmin/agricultores" replace />;
};

const HomeAdmin = () => {
  const [showProfileAdmin, setShowProfileAdmin] = useState(false);

  const handleConfigureProfileClick = () => {
    setShowProfileAdmin(true);
  };

  const handleProfileFormCancel = () => {
    setShowProfileAdmin(false);
  };

  return (
    <div>
      <div className="navbar-container-admin">
        <NavbarAdmin onConfigureProfileClick={handleConfigureProfileClick} />
      </div>
      <div className="dashboard-admin">
        <SidebarAdmin />
        <div className="table-container-admin">
          <div className="space-admin">
          <Routes>
            <Route index element={<RedirectToAgricultores />} />
              <Route path="/agricultores" element={<DTableFarmers />} />
              <Route path="/invernaderos" element={<DTableGreenhouses />} />
              <Route path="/invernaderos/camas" element={<DTableBeds />} />
              <Route
                path="/invernaderos/camas/imagenes-analizadas/"
                element={<DTableImagesA />}
              />
              <Route
                path="/invernaderos/camas/imagenes-analizadas/ver-imagen"
                element={<CardImagesAnalized />}
              />
              <Route path="/trabajadores" element={<DTableWorkers />} />
              <Route
                path="/trabajadores/:nameWorker"
                element={<DTableWorkerGreen />}
              />
              <Route path="/reportes" element={<Dashboard />} />
              <Route path="/plagas" element={<DTablePlagues />} />
              <Route path="/enfermedades" element={<DTableDiseases />} />
          </Routes>
          </div>
        </div>
      </div>
      {showProfileAdmin && (
        <ProfileAdmin onCancelClick={handleProfileFormCancel} />
      )}
    </div>
  );
};

export default HomeAdmin;
