import React, { useState, useEffect } from 'react';
import './ComboBoxGreenHouse.css';

const ComboBoxGreenHouse = ({ onChange }) => {
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Fetch data from the endpoint
    fetch('http://localhost:3000/greenhouse')
      .then(response => response.json())
      .then(data => {
        setGreenhouses(data);
      })
      .catch(error => console.error('Error al cargar los invernaderos:', error));
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
        style={selectedGreenhouse ? { backgroundColor: '#EFF6FF' } : null}
        onClick={() => setIsActive(!isActive)}
      >
        {selectedGreenhouse || "Invernaderos"}
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
