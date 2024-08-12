import React, { useState } from "react";
import "./DeleteBed.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DeleteGreenhouse = ({ onCancelClick, idBed }) => {
  const onConfirmClick = () => {
    fetch(`${backendUrl}/bed/${idBed}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          onCancelClick();
        } else {
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la cama:", error);
      });
  };

  return (
    <div className="delete-bed-form">
      <div className="container-delete-bed">
        <h4 className="h4-delete-bed">Eliminar cama</h4>
        <label>¿Está seguro que desea eliminar esta cama?</label>
      </div>
      <div className="button-container-bed">
        <button
          className="button-delete-bed"
          type="submit"
          onClick={onConfirmClick}
        >
          Eliminar
        </button>
        <button className="btn-delete-bed-cancel " onClick={onCancelClick}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteGreenhouse;
