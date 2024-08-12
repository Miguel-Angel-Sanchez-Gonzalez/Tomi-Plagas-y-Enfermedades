import React from "react";
import "./DeleteGreenhouse.css";
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const DeleteGreenhouse = ({ onCancelClick, idGreenhouse }) => {
  const onConfirmClick = () => {
    try {
      fetch(`${backendUrl}/greenhouse/${idGreenhouse}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Se ha eliminado el invernadero", {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
            onCancelClick();
          } else {
            toast.error(`Ha surgido un problema al eliminar el invernadero: `, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          }
        })
    } catch (error) {
      console.error("Error al eliminar el invernadero:", error);
      alert("Error al eliminar el invernadero");
    }
  };

  return (
    <div className="delete-greenhouse-form">
      <div className="container-delete-greenhouse">
        <h4 className="h4-delete-greenhouse">Eliminar invernadero</h4>
        <label>¿Está seguro que desea eliminar esta invernadero?</label>
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

export default DeleteGreenhouse;
