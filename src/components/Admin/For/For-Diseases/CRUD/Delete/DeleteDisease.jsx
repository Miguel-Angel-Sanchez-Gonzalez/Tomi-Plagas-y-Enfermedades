import React from "react";
import { toast } from "react-toastify";
import './DeleteDisease.css';

const DeleteDisease = ({ onCancelClick, idDisease }) => {
  
  const onConfirmClick = async () => {
    try{
      const response = await fetch(`http://localhost:3000/disease/${idDisease}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.status === 200) {
        toast.success(`Se ha eliminado la enfermedad`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
      }
    } catch (error) {
      toast.error(`Hubo un problema al eliminar la enfermedad: ${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="delete-disease-form">
      <div className='container-delete-disease'>
      <h4 className='h4-delete'>Eliminar enfermedad</h4>
        <label>¿Está seguro que desea eliminar esta enfermedad?</label>
      </div>
      <div className='button-container-disease'>
        <button className='button-delete-disease ' type="submit" onClick={onConfirmClick}>Eliminar</button>
        <button className='btn-delete-disease-cancel ' onClick={onCancelClick}>Cancelar</button>
      </div>
    </div>
  );
};

export default DeleteDisease;
