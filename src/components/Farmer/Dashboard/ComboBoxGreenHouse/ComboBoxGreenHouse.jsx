import React, { useState, useEffect } from "react";
import "./ComboBoxGreenHouse.css";

const ComboBoxGreenHouse = ({ onChange }) => {
  const [greenhouses, setGreenhouses] = useState([]);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState("");
  const [isActive, setIsActive] = useState(false);
  const idFarmer = localStorage.getItem("idFarmer");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/greenhouse/farmer/${idFarmer}`);
        if (!response.ok) {
          throw new Error('El agricultor aún no tiene invernaderos.');
        }
        const data = await response.json();
        if (data.message === "El agricultor no tiene invernaderos") {
          setError("El agricultor aún no tiene invernaderos.");
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
  }, [idFarmer]);

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
          {greenhouses.length > 0 ? (
            greenhouses.map((greenhouse) => (
              <div
                key={greenhouse.id_invernadero}
                onClick={() => handleOptionClick(greenhouse)}
                className="dropdown-option-gren"
              >
                {greenhouse.nombre}
              </div>
            ))
          ) : (
            <div className="dropdown-option-gren">
              Sin invernaderos
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComboBoxGreenHouse;
