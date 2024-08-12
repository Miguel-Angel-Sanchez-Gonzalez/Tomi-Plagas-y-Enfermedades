import React from 'react';
import { toast } from "react-toastify";
import './DeleteWorkerGreen.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DeleteWorkerGreen = ({ onCancelClick, idWorkerGreenhouse, onUpdateGreenhouses }) => {

  const onConfirmClick = async () => {
    try{
    const response = await fetch(`${backendUrl}/worker/deleteAsignGreenhouse/${idWorkerGreenhouse}`, {
      method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(`El invernadero se ha desasignado con éxito.`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
        onUpdateGreenhouses();  // Actualizar la lista de invernaderos
      }
    } catch (error) {
      toast.error(`Hubo un problema al desasignar el invernadero:${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  
  return (
    <div className="delete-farmer-form ">
      <div className='container-delete-farmer'>
      <h4  className='h4-delete'>Desasignar Invernadero</h4>
        <label>¿Está seguro que desea desasignar este invernadero?</label>
      </div>
      <div className='button-container-farmer'>
        <button className='button-delete-farmer' type="submit" onClick={onConfirmClick}>Desasignar</button>
        <button className='btn-delete-farmer-cancel' onClick={onCancelClick}>Cancelar</button>
      </div>
    </div>
  );
};

export default DeleteWorkerGreen;
