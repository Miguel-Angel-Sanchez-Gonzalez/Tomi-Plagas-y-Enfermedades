import React, { useState, useEffect } from 'react';
import './RegisterDisease.css';
import AddNotification from '../../../../../LoginNotifications/AddNotification';
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RegisterDisease = ({ onCancelClick }) => {
  const [records, setRecords] = useState('');
  const [diseaseExists, setDiseaseExists] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Nuevo estado para controlar el enfoque en los inputs
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Nuevo estado para rastrear si el formulario se ha enviado
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [values, setValues] = useState({
    nombreEnfermedad: "",
    nombreCientifico: "",
    descripcion: "",
    recomendaciones: "",
    acciones: ""
  });


  const handleInputChange = (e) =>{
    const { name, value } = e.target;
    setValues(values => ({
      ...values,
      [name]: value,
    }));
    if (name === 'nombreEnfermedad') {
      setDiseaseExists(false);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true); // Actualiza el estado cuando un input recibe enfoque
    setRecords(''); // Borra el mensaje de error
  };

  const handleInputBlur = () => {
    setIsInputFocused(false); // Actualiza el estado cuando un input pierde el enfoque
  };


  useEffect(()=>{
    checkDiseaseExists();
  }, []);

  /*FUNCIONES*/
  async function checkDiseaseExists(diseaseName){
      const response = await fetch(`${backendUrl}/disease/checkExist/${diseaseName}`)
      const data = await response.json()
      //se están cargando los datos
      return data.exists;
  } 

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsFormSubmitted(true); 

        for (const key in values) {
          if (values[key] === "") {
            setRecords('Por favor complete todos los campos.');
            return;
          }
        }

        
        //Validando que la enfermedad exista
        //const diseaseExists = await checkDiseaseExists(values.nombreEnfermedad);
        if (diseaseExists) {
          setDiseaseExists(true);
          return;
        }

        setIsLoading(true);
        const data = {
          name: values.nombreEnfermedad,
          nameScientific: values.nombreCientifico,
          description: values.descripcion,
          recommendations: values.recomendaciones,
          actions: values.acciones
        };


        //Se esta haciendo la promesa
        //Post para insertar datos de enfermedad
        try{
          const response = await fetch(`${backendUrl}/disease/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }) 
          if (response.status === 201) {
            setIsLoading(false);
            toast.success(`Se ha registrado la enfermedad`, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
            onCancelClick();
          }
        } catch (error) {
          toast.error(`Hubo un error al registrar la enfermedad: ${error}`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
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
        <div className="register-disease-container">
          <div className='centrar-disease'>
            <h4 className='h4register-disease'>Registrar enfermedad</h4>
            <h5 className='h5register-disease'>*Campos requeridos</h5>
            <label className='label-dato-disease'>Registre una nueva enfermedad</label>
          <div className="form-sec-disease-register">
            <div className="column-register-disease">
                <label className={`labels-disease-r ${isFormSubmitted && !values.nombreEnfermedad && 'red-label'}`}>
                  Nombre de la enfermedad*
                </label>
                <input
                className={`inputs-register-disease ${isFormSubmitted && !values.nombreEnfermedad && 'red-input'}`}
                type="text"
                required
                name="nombreEnfermedad"
                placeholder="Ingrese el nombre de la enfermedad"
                value={values.nombreEnfermedad}
                onChange={handleInputChange}
                onFocus={handleInputFocus} // Nuevo evento de enfoque
                onBlur={async () => {
                  handleInputBlur();
                  if (values.nombreEnfermedad) {
                    const diseaseExists = await checkDiseaseExists(values.nombreEnfermedad);
                    setDiseaseExists(diseaseExists);
                  }
                }}
              />
              {diseaseExists && <p className="disease-exists">La enfermedad ya fue registrada.</p>}
            </div>
            <div className="column-register-disease">
                <label className={`labels-disease-r ${isFormSubmitted && !values.nombreCientifico && 'red-label'}`}>
                  Nombre científico*
                </label>
              <input
                className={`inputs-register-disease ${isFormSubmitted && !values.nombreCientifico && 'red-input'}`}
                type="text"
                required
                name="nombreCientifico"
                placeholder="Ingrese el nombre científico"
                value={values.nombreCientifico}
                onChange={handleInputChange}
                onFocus={handleInputFocus} // Nuevo evento de enfoque
                onBlur={handleInputBlur}   // Nuevo evento de desenfoque
              />
            </div>
          </div>
          <div className="form-sec-disease-register">
            <div className="column-register-disease">
                <label className={`labels-disease-r ${isFormSubmitted && !values.descripcion && 'red-label'}`}>
                  Descripción*
                </label>
              <textarea
                className= {`textarea-disease-r ${isFormSubmitted && !values.descripcion && 'red-input'}`}
                type="text"
                required
                name="descripcion"
                placeholder="Escriba una pequeña descripción"
                value={values.descripcion}
                onChange={handleInputChange}
                onFocus={handleInputFocus} // Nuevo evento de enfoque
                onBlur={handleInputBlur}   // Nuevo evento de desenfoque
              />
            </div>
            <div className="column-register-disease">
                <label className={`labels-disease-r ${isFormSubmitted && !values.recomendaciones && 'red-label'}`}>
                  Recomendaciones*
                </label>
              <textarea
                className= {`textarea-disease-r ${isFormSubmitted && !values.recomendaciones && 'red-input'}`}
                type="text"
                required
                name="recomendaciones"
                placeholder="Ingrese las recomendaciones"
                value={values.recomendaciones}
                onChange={handleInputChange}
                onFocus={handleInputFocus} // Nuevo evento de enfoque
                onBlur={handleInputBlur}   // Nuevo evento de desenfoque
              />
            </div>
          </div>
          <div className="form-sec-disease-register">
            <div className="column-register-disease">
                <label className={`labels-disease-r ${isFormSubmitted && !values.acciones && 'red-label'}`}>
                  Acciones*
                </label>
              <textarea
                className= {`textarea-disease-r2 ${isFormSubmitted && !values.acciones && 'red-input'}`}
                type="text"
                required
                name="acciones"
                placeholder="Mencione las acciones a tomar"
                value={values.acciones}
                onChange={handleInputChange}
                onFocus={handleInputFocus} // Nuevo evento de enfoque
                onBlur={handleInputBlur}   // Nuevo evento de desenfoque
              />
            </div>
          </div>
          <div className='btn-cont-admin-dis-r'>
              <button className='button-disease-r' type="submit" onClick={handleSubmit}>Guardar</button>
                 {/* {isLoading ? 'Enviando..' : 'Enviar'} */}
              <button className='button-disease-r ' onClick={onCancelClick}>Cancelar</button>
            </div>
              {records && !isInputFocused && <p className='error-message-disease-r'>{records}</p>}
            </div>
            {loadingMessage && (
            <AddNotification message={loadingMessage} onClose={() => setLoadingMessage('')} className="farmer-notification"/>
          )}
        </div>
      </div>
  );
}

export default RegisterDisease;