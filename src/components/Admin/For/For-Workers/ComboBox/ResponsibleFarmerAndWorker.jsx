import React, { useEffect, useState } from "react";
import './ResponsibleFarmerAndWorker.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ResponsibleFarmerAndWorker({ idFarmer, setIdFarmer, isFormSubmitted, value, onFarmerSelected, isEditing }) {
    const [isActive, setIsActive] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getFarmers();
    }, []);

    async function getFarmers() {
        const response = await fetch(`${backendUrl}/farmer/getNameFarmers`);
        const data = await response.json();
        setOptions(data.map(farmer => ({
            label: farmer.nombre,
            value: farmer.id_agricultor
        })));   
    } 

    const handleOptionClick = (option) => {
        setIdFarmer(option.value);
        setIsActive(false);
        console.log("seleccionado el farmer con ID ", option.value);
        // Envía el ID del agricultor al componente padre EditWorker
        if (typeof onFarmerSelected === 'function') {
            onFarmerSelected(option.value);
        }
    };
    
    

    return (
        <div className="dropdown">
            <div
            className={`dropdown-btn ${isFormSubmitted && !idFarmer && !isEditing && !onFarmerSelected  ? 'red-input' : ''}`}
            style={onFarmerSelected ? { backgroundColor: '#EFF6FF' } : null}
            onClick={() => setIsActive(!isActive)}
        >
    
    {idFarmer ? options.find(option => option.value === idFarmer).label : value}
    {/* Usar el valor pasado como prop si idFarmer está vacío */}
</div>

            {isActive && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleOptionClick(option)}
                            className="dropdown-option" 
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ResponsibleFarmerAndWorker;
