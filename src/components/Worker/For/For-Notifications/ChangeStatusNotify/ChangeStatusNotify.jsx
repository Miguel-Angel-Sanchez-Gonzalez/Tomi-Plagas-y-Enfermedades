import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "./ChangeStatusNotify.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ChangeStatusNotify = ({ onCancelClick, notification }) => {
  const handleChangeStatus = async () => {
    const newStatus = notification.estado === "Sin ver" ? "Tratada" : "Sin ver";

    try {
      const response = await fetch(
        `${backendUrl}/analizedImage/${notification.id_imagenanalizada}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 200) {
        toast.success("Estado actualizado correctamente", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
      } else {
        throw new Error("Error al actualizar el estado");
      }
    } catch (error) {
      toast.error("Error al actualizar el estado, inténtelo más tarde.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      console.error("Error al actualizar el estado:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleChangeStatus();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="change-status-notify-form">
      <div className="container-change-status">
        <h4 className="h4-change-status">Cambiar estado de notificación</h4>
        <label>¿Está seguro que desea cambiar el estado de esta notificación?</label>
      </div>
      <div className="button-container-notify">
        <button
          className="button-change-status"
          type="submit"
          onClick={handleChangeStatus}
        >
          Cambiar Estado
        </button>
        <button className="btn-cancel-notify" onClick={onCancelClick}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ChangeStatusNotify;
