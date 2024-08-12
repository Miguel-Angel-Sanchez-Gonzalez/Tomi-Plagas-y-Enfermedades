import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import './CardImagesAnalizedW.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function CardImagesAnalizedW () {
  const location = useLocation();
  const { idAnalizedImage, idBed } = location.state || {};
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [statusImage, setStatusImage] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(prevChecked =>!prevChecked);
    if (isChecked) {
      updateStatus('Sin ver');
    } else {
      updateStatus('Tratada');
    }
  };

  useEffect(() => {
    const getRAndAByIdAnalizedImage = async () => {
      try {
        const response = await fetch(`${backendUrl}/analizedImage/solutions/${idAnalizedImage}`);

        if (response.status === 200) {
          const data = await response.json();
          setData(data);

          const responseImage = await fetch(`${backendUrl}/analizedImage/greenhouse/bed/${idBed}`);
          if (responseImage.status === 200) {
            const fImage = await responseImage.json();
            const image = fImage.find(img => img.id_analizedImage === idAnalizedImage)?.image;
            const status = fImage.find(state => state.id_analizedImage === idAnalizedImage)?.status;

            setImageUrl(image);
            setStatusImage(status)
            
            // Actualizar isChecked según el estado de la imagen
            if (status === 'Tratada') {
              setIsChecked(true);
            } else {
              setIsChecked(false);
            }

          } else if (responseImage.status === 404) {
            console.log('No se encontraron las imágenes analizadas.');
          } else {
            console.error(`Error al obtener la imagen con id ${idBed}:`, responseImage.statusText);
          }

          setIsLoaded(true);
        } else if (response.status === 404) {
          console.log('No se encontraron las recomendaciones y/o acciones para la imagen.');
        } else {
          console.error("Error al obtener las recomendaciones y acciones de la plaga o enfermedad:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener las recomendaciones y acciones de la plaga o enfermedad:", error);
        setIsLoaded(true); // Asegurando que setIsLoaded se actualice incluso en caso de error.
      }
    };

    if (idAnalizedImage) {
      getRAndAByIdAnalizedImage();
    }

  }, [idAnalizedImage, idBed]);

  const updateStatus = (newStatus) => {
    fetch(`${backendUrl}/analizedImage/${idAnalizedImage}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
   .then((response) => {
        if (response.status === 200) {
          toast.success(`El estado de la imagen se actualizó correctamente.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          setStatusImage(newStatus);
        }
      })
   .catch((error) => {
        toast.error(`${error}`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      });
  };


  return (
    <div>
      <h1 className='title'>Imágenes detectadas</h1>
        <div className="checkbox-container">
          <input type="checkbox" 
            className='checkbox-images'
            id="myCheckbox"
            name="myCheckbox" 
            value="checkboxStatus"
            checked={isChecked}
            onChange={handleOnChange}
            />
          <label htmlFor="myCheckbox">{isChecked ? "Desmarcar como tratada" : "Marcar como tratada"}</label>
        </div>
      <div className="projcard-container">
        {isLoaded? (
          <div className="image-detail-container">
            <div className="image-container">
              <img src={imageUrl} alt="Imagen detectada" />
            </div>
            <div className="details-container">
              {data.map((item, index) => (
                <div key={index}>
                  <h3 className='nameDetected'>{item.nombre}</h3>
                  <p><strong>Estado:</strong> {statusImage}</p>
                  <p><strong>Tipo:</strong> {item.tipo}</p>
                  <p><strong>Nombre Científico:</strong> {item.nombre_cientifico}</p>
                  <p><strong>Descripción:</strong> {item.descripcion}</p>
                  <div className="recommendations-container">
                    <h4>Recomendaciones:</h4>
                    <p>{item.recomendaciones}</p>
                  </div>
                  <div className="actions-container">
                    <h4>Acciones:</h4>
                    <p>{item.acciones}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="loading">Cargando imágen...</div>
        )}
      </div>
    </div>
  );
}

export default CardImagesAnalizedW;