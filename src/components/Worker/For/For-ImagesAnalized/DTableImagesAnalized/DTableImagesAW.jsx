import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTableImagesAW.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DTableImagesAW = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredImagesA, setFilteredImagesA] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  //Para ver las imagenes analizadas de una cama
  const location = useLocation();
  const navigate = useNavigate();

  const { nameGreenhouse, nameFarmer, idBed, numberBed } =
    location.state || [];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_analizedImage,
      sortable: true,
      width: "65px",
    },
    {
      name: "Nombre de lo detectado",
      cell: (row) => {
        const detected = [...row.detected.plagues, ...row.detected.diseases]; 
        return detected.join(", "); // Unir todo en un solo string separado por comas
      },
      sortable: true,
      width: "400px",
    },
    {
      name: "Tipo",
      cell: (row) => {
        const isPlague = row.detected.plagues.length > 0; // Verificar si hay plagas detectadas
        const isDisease = row.detected.diseases.length > 0; // Verificar si hay enfermedades detectadas
        if (isPlague && isDisease) {
          return "Plagas y enfermedades"; // Si se detecta tanto una plaga como una enfermedad
        } else if (isPlague) {
          return "Plaga"; // Si solo se detecta una plaga
        } else if (isDisease) {
          return "Enfermedad"; // Si solo se detecta una enfermedad
        } else {
          return "Desconocido"; // Si no se detecta ni plaga ni enfermedad
        }
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "Fecha",
      selector: (row) => row.date,
      sortable: true,
      width: "150px",
    },
    {
      name: "Imagen",
      cell: (row) => (
        <div className="icons-container">
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => handleShowCardImages(row)}
            className="view-icon"
            size="lg"
          />
        </div>
      ),
      width: "90px",
    },
  ];

  const [imagesAnalized, setImagesAnalized] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) {
      getImageAByIdBed();
    }
  }, [isLoaded, idBed]);

  const handleChooseImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      sendImageToBackend(file);
    }
  };

  const sendImageToBackend = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", acceptedFiles[0]);
      //setAcceptedFiles([]);
      console.log(formData);
      setIsAnalyzing(true);
      const response = await fetch(
        `${backendUrl}/analyzeimage/web/${idBed}`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setIsLoaded(false);
        toast.success(`Se ha analizado la imagen`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(`Hubo un error ${error}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImageAByIdBed = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/analizedImage/greenhouse/bed/${idBed}`
      );
      if (response.status === 200) {
        const data = await response.json();
        // console.log("Respuesta del servidor:", data);
        setImagesAnalized(data);
        setFilteredImagesA(data);
        setIsLoaded(true);
      } else if (response.status === 404) {
        setFilteredImagesA([]); // Si no se encuentran imágenes, establecer filteredImagesA como un array vacío
      }
    } catch (error) {
      console.error("Error al obtener las imágenes analizadas de la cama:", error);
      toast.error("Hubo un problema al cargar las imágenes analizadas. Por favor, inténtelo nuevamente más tarde.");
    } finally {
      setIsLoading(false); // Indicar que se han terminado de cargar las imágenes (ya sea con éxito o error)
    }
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    if (value) {
      const filtered = imagesAnalized.filter(
        (imageA) =>
          imageA.detected.plagues.join(", ").toLowerCase().includes(value) || // Busca en las plagas detectadas
          imageA.detected.diseases.join(", ").toLowerCase().includes(value) // Busca en las enfermedades detectadas
      );
      setFilteredImagesA(filtered);
    } else {
      setFilteredImagesA(imagesAnalized);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  const handleShowCardImages = (row) => {
    navigate(`/homeWorker/invernaderos/camas/imagenes-analizadas/ver-imagen`, {
      state: {
        idAnalizedImage: row.id_analizedImage,
        // detected: row.detected,
        // imageUrl: row.image,
        idBed: idBed,
      },
    });
  };


  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="table-imagesA-admin">
      <div className="content-container">
        <div className="table-container">
          <h1 className="h2green-bed-imageA">
            Invernadero{" "}
              <span className="name-bed">
                {nameGreenhouse}
              </span> 
              <span>, </span>
                Cama
                <span> </span>
              <span className="name-bed">
                {numberBed}
              </span>
          </h1>
          <h4 className="h4farmer-bed-imageA">
            Agricultor responsable:{" "}
            <span className="name-farmer">{nameFarmer}</span>
          </h4>
          <div className="only-table-imageA">
            <div className="title-and-search-imageA">
              <div>
                <h3>Imágenes analizadas</h3>
                <label className="description-imagesA">
                  Lista de imágenes analizadas que tiene la cama seleccionada
                </label>
              </div>
              <div className="header-table-imagesA">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="icon-ImageA"
                  size="lg"
                />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={inputValue}
                  onChange={handleFilter}
                  className="search-ImageA"
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={filteredImagesA}
              responsive={true}
              fixedHeader
              pagination
              paginationComponentOptions={paginacionOpciones}
              noDataComponent={
                isLoading ? (
                  <div className="no-beds-message">
                    Espere un momento, las imágenes analizadas se están cargando...
                  </div>
                ) : (
                  <div className="no-beds-message">
                    Aún no se han analizado imágenes en esta cama.
                  </div>
                )
              }
            />
          </div>
        </div>
        <div className="image-uploader-containerw" 
          style={{ textAlign: "center" }}>
          <div
            className="image-uploader-w"
            {...getRootProps({
              onClick: (event) => {
                event.stopPropagation();
                const input = document.getElementById("fileInput");
                if (input) input.click();
              },
              style: {
                cursor: isDragActive ? "grabbing" : "pointer",
                height: "auto",
                width: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "20px",
                margin: "0 auto",
              },
            })}
          >
            <input {...getInputProps()} id="fileInput" style={{ display: "none" }} />
            {isDragActive ? (
              <p>Suelta la imagen aquí...</p>
            ) : (
              <div>
                <h3>Analiza una imagen</h3>
                <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
              </div>
            )}
            {acceptedFiles[0] && (
              <img
                src={URL.createObjectURL(acceptedFiles[0])}
                alt=""
                style={{
                  marginTop: "10px",
                  maxWidth: "60%",
                  maxHeight: "200px",
                  background: "#dd585a2c",
                }}
              />
            )}
            </div>
            {acceptedFiles[0] && (
            <button
              type="button"
              className="buttonImage"
              onClick={sendImageToBackend}
              style={{
                marginTop: "20px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Analizar imagen
            </button>
            )}
          </div>
        </div>
      {isAnalyzing && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Analizando imagen...</p>
        </div>
      )}
    </div>
  );
};

export default DTableImagesAW;