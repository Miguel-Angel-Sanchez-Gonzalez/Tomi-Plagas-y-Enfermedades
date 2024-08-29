import React, { useState, useEffect } from 'react';
import './ComboBoxGreenHouse.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ComboBoxGreenHouse = ({ onChange }) => {
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const response = await fetch(`${backendUrl}/greenhouse`);
        if (!response.ok) {
          throw new Error('Aún no hay invernaderos registrados.');
        }
        const data = await response.json();
        if (data.message === "Aún no hay invernaderos registrados.") {
          setError("Aún no hay invernaderos registrados.");
          setGreenhouses([]);
        } else {
          setGreenhouses(data);
          setError(null);
        }
      } catch (error) {
        console.error("Error al cargar los invernaderos:", error);
        setError("Hubo un error al cargar los invernaderos.");
      }
    };

    fetchGreenhouses();
  }, []);

  const handleOptionClick = (greenhouse) => {
    setSelectedGreenhouse(greenhouse.nombre);
    onChange(greenhouse.nombre, greenhouse.id_invernadero);
    setIsActive(false);
  };

  return (
    <div className="dropdown">
      <div
        className="dropdown-btn-greenhouse"
        style={selectedGreenhouse ? { backgroundColor: "#EFF6FF" } : null}
        onClick={() => setIsActive(!isActive)}
      >
        {selectedGreenhouse || (error ? "Sin invernaderos" : "Invernaderos")}
      </div>
      {isActive && (
        <div className="dropdown-content-greenhouse">
          {greenhouses.map((greenhouse) => (
            <div
              key={greenhouse.id_invernadero}
              onClick={() => handleOptionClick(greenhouse)}
              className="dropdown-option-gren"
            >
              {greenhouse.nombre}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBoxGreenHouse;
