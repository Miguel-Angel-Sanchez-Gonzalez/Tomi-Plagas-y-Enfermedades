import React, { useEffect, useState } from "react";
import './ResponsibleFarmer.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ResponsibleFarmer({ selected, setSelected, isFormSubmitted }) {
    const [isActive, setIsActive] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(()=>{
        getFarmers();
    },[])

    /*FUNCIONES*/
    async function getFarmers(){
        const response = await fetch(`${backendUrl}/farmer/getNameFarmers`)
        const data = await response.json()
        setOptions(data.map(farmer => {
            return {label: farmer.nombre, value:farmer.id_agricultor}
        }));   
    } 

    const handleOptionClick = (option) => {
        setSelected(option.value === undefined ? "" : option);
        setIsActive(false);
    };


    return (
        <div className="dropdown">
            <div
                className={`dropdown-btn ${isFormSubmitted && !selected ? 'red-input' : ''}`}
                onClick={() => setIsActive(!isActive)}
            >
                {selected ? selected.label : "Seleccionar agricultor..."}
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

export default ResponsibleFarmer;