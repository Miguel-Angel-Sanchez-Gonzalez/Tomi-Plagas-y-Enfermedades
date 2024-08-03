import React from "react";
import { toast } from "react-toastify";
import "./DeletePlague.css";

const DeletePlague = ({ onCancelClick, idPlague }) => {

  const onConfirmClick  = async () => {
    try {
      const response = await fetch(`http://localhost:3000/plague/${idPlague}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(`Se ha eliminado la plaga`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
      }
    } catch (error) {
      toast.error(`Hubo un problema al eliminar la plaga: ${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="delete-plague-form">
      <div className="container-delete-plague">
        <h4 className="h4-delete">Eliminar plaga</h4>
        <label>¿Está seguro que desea eliminar esta plaga?</label>
      </div>
      <div className="button-container-plague">
        <button
          className="button-delete-plague "
          type="submit"
          onClick={onConfirmClick}
        >
          Eliminar
        </button>
        <button className="btn-delete-plague-cancel " onClick={onCancelClick}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeletePlague;
