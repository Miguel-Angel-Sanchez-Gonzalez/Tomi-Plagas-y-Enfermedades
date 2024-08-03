import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./HomeWorker.css";
import NavbarWorker from "../NavSideProfileWorker/NavbarWorker/NavbarWorker";
import SidebarWorker from "../NavSideProfileWorker/SidebarWorker/SidebarWorker";
import DTableNotifications from "../For/For-Notifications/DTableNotifications/DTableNotifications";
import DTableAssgndGreenhouse from "../For/For-Greenhouses/DTableAssgndGreenhouse/DTableAssgndGreenhouse";
import DTableBedsW from "../For/For-Beds/DTableBeds/DTableBedsW";
import ProfileWorker from "../NavSideProfileWorker/ProfileWorker/ProfileWorker";
import DTableImagesAW from "../For/For-ImagesAnalized/DTableImagesAnalized/DTableImagesAW";
import CardImagesAnalizedW from "../For/For-ImagesAnalized/CardImagesAnalizedW";
import DTablePlaguesW from "../For/For-Plagues/DTablePlagues/DTablePlaguesW";
import DTableDiseasesW from "../For/For-Diseases/DTableDiseases/DTableDiseasesW";

const RedirectToNotificaciones = () => {
  return <Navigate to="/homeWorker/notificaciones" replace />;
};


const HomeWorker = () => {
  const idWorker = localStorage.getItem("idWorker");

  const [showProfileWorker, setshowProfileWorker] = useState(false);

  const handleConfigureProfileClick = () => {
    setshowProfileWorker(true);
  };

  const handleProfileFormCancel = () => {
    setshowProfileWorker(false);
  };

  return (
    <div>
      <div className="navbar-container-worker">
        <NavbarWorker onConfigureProfileClick={handleConfigureProfileClick} />
      </div>
      <div className="dashboard-worker">
        <SidebarWorker />
        <div className="table-container-worker">
          <div className="space-worker">
            <Routes>
            <Route index element={<RedirectToNotificaciones />} />
              <Route path="/notificaciones" element={<DTableNotifications />} />
              <Route path="/invernaderos" element={<DTableAssgndGreenhouse />} />
              <Route path="/invernaderos/camas" element={<DTableBedsW />} />
              <Route
                path="/invernaderos/camas/imagenes-analizadas/"
                element={<DTableImagesAW />}
              />
              <Route
                path="/invernaderos/camas/imagenes-analizadas/ver-imagen"
                element={<CardImagesAnalizedW />}
              />
              <Route path="/plagas/" element={<DTablePlaguesW />} />
              <Route path="/enfermedades/" element={<DTableDiseasesW />} />
            </Routes>
          </div>
        </div>
      </div>
      {showProfileWorker && (
        <ProfileWorker onCancelClick={handleProfileFormCancel} idWorker={idWorker}/>
      )}
    </div>
  );
};

export default HomeWorker;