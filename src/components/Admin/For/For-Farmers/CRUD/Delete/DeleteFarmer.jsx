import React from "react";
import { toast } from "react-toastify";
import "./DeleteFarmer.css";

const DeleteFarmer = ({ onCancelClick, idFarmer }) => {
  const onConfirmClick = async () => {
    try {
      const response = await fetch(`http://localhost:3000/farmer/${idFarmer}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(`Se ha eliminado el agricultor`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
      }
    } catch (error) {
      toast.error(`Hubo un problema al eliminar al agricultor: ${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="delete-farmer-form">
      <div className="container-delete-farmer">
        <h4 className="h4-delete">Eliminar agricultor</h4>
        <label>¿Está seguro que desea eliminar este agricultor?</label>
      </div>
      <div className="button-container-farmer">
        <button
          className="button-delete-farmer"
          type="submit"
          onClick={onConfirmClick}
        >
          Eliminar
        </button>
        <button className="btn-delete-farmer-cancel" onClick={onCancelClick}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteFarmer;
