import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTableGreenhousesF.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPencilAlt, faTrash, faEye} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RegisterGreenhouse from "../CRUD/Register/RegisterGreenhouse";
import EditGreenhouse from "../CRUD/Edit/EditGreenhouse";
import DeleteGreenhouse from "../CRUD/Delete/DeleteGreenhouse";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
//FARMER
const DTableGreenhousesF = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredGreenhouses, setFilteredGreenhouses] = useState([]);
  const [idGreenhouse, setIDGreenhouse] = useState("");
  const navigate = useNavigate();
  const idFarmer = localStorage.getItem("idFarmer");
  const [isLoaded, setIsLoaded] = useState(false);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_invernadero,
      sortable: true,
      width: "65px",
    },
    {
      name: "Nombre del invernadero",
      selector: (row) => row.nombre,
      sortable: true,
      width: "auto",
    },
    {
      name: "Tipo de invernadero",
      selector: (row) => row.tipo_invernadero,
      sortable: true,
      width: "200px",
    },
    {
      name: "Humedad",
      selector: (row) => row.humedad,
      sortable: true,
      width: "130px",
    },
    {
      name: "Tamaño",
      selector: (row) => row.tamanio,
      sortable: true,
      width: "130px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="icons-container">
          <FontAwesomeIcon
            icon={faPencilAlt}
            onClick={() => handleEditClick(row)}
            className="edit-icon"
            size="lg"
          />
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => handleDeleteClick(row)}
            className="delete-icon"
            size="lg"
          />
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => handleShowBeds(row)}
            className="view-icon"
            size="lg"
          />
        </div>
      ),
      width: "110px",
    },
  ];

  const [showRegisterGreenh, setshowRegisterGreenh] = useState(false); //Form de register
  const [showEditGreenh, setshowEditGreenh] = useState(false); //Form de edicion
  const [showDeleteGreenh, setshowDeleteGreenh] = useState(false); //Form de eliminacion
  const [greenhouses, setGreenhouses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      getGreenhouses();
    }
  }, [isLoaded]);

  /*FUNCIONES*/
  async function getGreenhouses() {
    try {
      setIsLoading(true); // Indicar que se están cargando los invernaderos
      const response = await fetch(
        `${backendUrl}/greenhouse/farmer/${idFarmer}`
      );
      if (response.status === 200) {
        const data = await response.json();
        //se están cargando los datos
        setGreenhouses(data);
        setFilteredGreenhouses(data);
        setIsLoaded(true);
      }
      if (response.status === 404) {
        setGreenhouses([]);
        setFilteredGreenhouses([]);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error al cargar los datos de los invernaderos:", error);
      toast.error("Hubo un problema al cargar los datos de los invernaderos. Por favor, inténtelo nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFilter = (event) => {
    try {
      const value = event.target.value.toLowerCase();
      setInputValue(value);
      if (value) {
        const searchValue = value.split(" ");
        const filtered = greenhouses.filter((greenhouse) => {
          return searchValue.every((value) =>
            greenhouse.nombre.toLowerCase().includes(value)
          );
        });
        setFilteredGreenhouses(filtered);
      } else {
        setFilteredGreenhouses(greenhouses);
      }
    } catch (error) {
      console.error("Error durante el filtrado:", error);
      alert("Error durante el filtrado de invernaderos " + error);
    }
  };

  const handleRegisterClick = () => {
    setshowRegisterGreenh(true);
  };

  const handleCancelClick = () => {
    setshowRegisterGreenh(false);
    setshowEditGreenh(false);
    setshowDeleteGreenh(false);
    setIsLoaded(false);
  };

  const handleEditClick = (row) => {
    setIDGreenhouse(row.id_invernadero);
    setshowEditGreenh(true);
  };

  const handleDeleteClick = (row) => {
    setIDGreenhouse(row.id_invernadero);
    setshowDeleteGreenh(true);
  };

  const handleShowBeds = (row) => {
    try {
      console.log(row.id_invernadero);
      navigate(`/homeFarmer/invernaderos/camas`, {
        state: {
          idGreenhouse: row.id_invernadero,
          nameGreenhouse: row.nombre,
        },
      });
    } catch (error) {
      console.error("Error al navegar a la sección de camas:", error);
    }
  };

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

   return (
     <div className="table-green-admin">
      <div className="container-green-adm">
       <div className="title-adm-search-green">
         <div>
           <h3>Invernaderos</h3>
           <label className="description-green">
           Lista de todos los invernaderos registrados en el sistema.
           </label>
          </div>
         <div className="header-table-green-ad">
         <FontAwesomeIcon
             icon={faSearch}
             className="icon-green"
             size="lg"
           />
           <input
             type="text"
             placeholder="Buscar..."
             value={inputValue}
             onChange={handleFilter}
             className="search-green"
           />
            <button
               type="button"
               className="button-green-adm"
               onClick={handleRegisterClick}>
               Registrar invernadero
            </button>
         </div>
       </div>
         <DataTable
           columns={columns}
           data={filteredGreenhouses}
           responsive={true}
           pagination
           paginationComponentOptions={paginacionOpciones}
           noDataComponent={
             isLoading ? (
               <div className="no-workgreen-message">
                 Espere un momento, los datos de los invernaderos se están cargando...
               </div>
             ) : (
               <div className="no-workgreen-message">
                  Aún no se han registrado invernaderos.
               </div>
             )
           }
         />
        {showRegisterGreenh && (
          <RegisterGreenhouse onCancelClick={handleCancelClick} />
        )}
        {showEditGreenh && (
          <EditGreenhouse
            onCancelClick={handleCancelClick}
            idGreenhouse={idGreenhouse}
          />
        )}
        {showDeleteGreenh && (
          <DeleteGreenhouse
            onCancelClick={handleCancelClick}
            idGreenhouse={idGreenhouse}
          />
        )}
      </div>
    </div>
  );
};

export default DTableGreenhousesF;