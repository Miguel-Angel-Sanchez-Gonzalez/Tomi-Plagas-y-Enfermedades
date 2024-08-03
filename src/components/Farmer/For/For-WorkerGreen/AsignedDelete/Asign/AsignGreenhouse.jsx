import React, { useState } from 'react';
import { toast } from "react-toastify";
import './AsignGreenhouse.css';
import AddNotification from '../../../../../LoginNotifications/AddNotification';
import ComboBoxGreenHouse from '../../../../../Dashboard/ComboBoxGreenHouse/ComboBoxGreenHouse';

const AsignGreenhouse = ({ onCancelClick, idWorker, idFarmer, onUpdateGreenhouses }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [idGreenhouse, setIdGreenhouse] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSelectionChange = (selectedGreenhouseName, selectedGreenhouseId) => {
    setIdGreenhouse(selectedGreenhouseId);
  };

  const checkGreenhouseAssignment = async (idWorker, idGreenhouse) => {
    try {
      const response = await fetch(`http://localhost:3000/worker/existsAsignGreenhouse/${idWorker}/${idGreenhouse}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error al comprobar la asignación del invernadero:", error);
      toast.success('Error al comprobar la asignación del invernadero.', {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (!idGreenhouse) {
      toast.info('Por favor, seleccione un invernadero antes de guardar.', {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      const alreadyAssigned = await checkGreenhouseAssignment(idWorker, idGreenhouse);
      if (alreadyAssigned) {
        toast.warning('No se puede asignar este invernadero porque ya está asignado a este trabajador.', {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/worker/asigngreenhouse/${idWorker}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idGreenhouse })
      });

      if (response.ok) {
        toast.success('Se ha asignado correctamente el invernadero.', {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        onCancelClick();
        onUpdateGreenhouses();  // Actualizar la lista de invernaderos
      } else {
        toast.error('Error al asignar el invernadero.', {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(`Hubo un error: ${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="register-bed-container">
        <div className="centrar-bed">
          <h4 className="h4register-bed">Asignar invernadero al trabajador</h4>
          <h5 className="h5register-bed">*Campo requerido</h5>
          <label className="label-dato-bed">Por favor, seleccione un invernadero</label>
          <ComboBoxGreenHouse onChange={handleSelectionChange} />
          <div className="button-container-bed">
            <button className="button-bed" type="submit" onClick={handleSubmit}>Guardar</button>
            <button className="button-bed" onClick={onCancelClick}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignGreenhouse;
