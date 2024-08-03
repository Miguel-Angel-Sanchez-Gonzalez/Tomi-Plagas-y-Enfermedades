import React from 'react';
import { toast } from "react-toastify";
import './DeleteWorker.css';

const DeleteWorker = ({ onCancelClick, idWorker }) => {

  const onConfirmClick = async () => {
    try{
    const response = await fetch(`http://localhost:3000/worker/${idWorker}`, {
      method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success(`Se ha eliminado al trabajor`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
      }
    } catch (error) {
      toast.error(`Hubo un problema al eliminar al trabajador:${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  
  return (
    <div className="delete-farmer-form ">
      <div className='container-delete-farmer'>
      <h4  className='h4-delete'>Eliminar trabajador</h4>
        <label>¿Está seguro que desea eliminar este trabajador?</label>
      </div>
      <div className='button-container-farmer'>
        <button className='button-delete-farmer' type="submit" onClick={onConfirmClick}>Eliminar</button>
        <button className='btn-delete-farmer-cancel' onClick={onCancelClick}>Cancelar</button>
      </div>
    </div>
  );
};

export default DeleteWorker;
