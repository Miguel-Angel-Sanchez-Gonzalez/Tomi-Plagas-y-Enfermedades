import React, { useState } from "react";
import './GreenhouseType.css';

function GreenhouseType({ selected, setSelected, isFormSubmitted }) {
    const [isActive, setIsActive] = useState(false);
    const options = ["Túnel", "Capilla", "Malla sombra"];

    const handleOptionClick = (option) => {
        setSelected(option === "Seleccionar tipo..." ? "" : option);
        setIsActive(false);
    };

    return (
        <div className="dropdown">
            <div
                className={`dropdown-btn ${isFormSubmitted && !selected ? 'red-input' : ''}`}
                style={selected ? { backgroundColor: '#EFF6FF' } : null}
                onClick={() => setIsActive(!isActive)}
            >
                {selected || "Seleccionar tipo..."}
            </div>
            {isActive && (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className={`dropdown-option ${option === "Seleccionar tipo..." ? 'placeholder' : ''}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GreenhouseType;
