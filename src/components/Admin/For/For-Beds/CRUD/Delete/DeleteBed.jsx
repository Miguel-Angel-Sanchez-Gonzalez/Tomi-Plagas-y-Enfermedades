import React from "react";
import { toast } from "react-toastify";
import "./DeleteBed.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DeleteBed = ({ onCancelClick, idBed }) => {
  const onConfirmClick = async () => {
    try {
      const response = await fetch(`${backendUrl}/bed/${idBed}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        onCancelClick();
        toast.success(`Se ha eliminado la cama`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(`Hubo un error al eliminar la cama: ${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="delete-greenhouse-form">
      <div className="container-delete-greenhouse">
        <h4 className="h4-delete-greenhouse">Eliminar cama</h4>
        <label>¿Está seguro que desea eliminar esta cama?</label>
      </div>
      <div className="button-container-greenhouse">
        <button
          className="button-delete-greenhouse"
          type="submit"
          onClick={onConfirmClick}
        >
          Eliminar
        </button>
        <button
          className="btn-delete-greenhouse-cancel "
          onClick={onCancelClick}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteBed;
