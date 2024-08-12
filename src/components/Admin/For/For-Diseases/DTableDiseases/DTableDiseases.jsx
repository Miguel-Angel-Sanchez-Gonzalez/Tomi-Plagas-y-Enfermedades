import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTableDiseases.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPencilAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import RegisterDisease from "../CRUD/Register/RegisterDisease";
import EditDisease from "../CRUD/Edit/EditDisease";
import DeleteDisease from "../CRUD/Delete/DeleteDisease";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
/*Enfermedad*/

const DTableDiseases = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [idDisease, setIDDisease] = useState("");
  const [isDataLoaded, setDataLoaded] = useState(false);
  

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_enfermedad,
      sortable: true,
      width: "65px",
    },
    {
      name: "Nombre de la enfermedad",
      selector: (row) => row.nombre,
      sortable: true,
      width: "200px",
    },
    {
      name: "Nombre científico",
      selector: (row) => row.nombre_cientifico,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
      width: "350px",
    },
    {
      name: "Recomendaciones",
      selector: (row) => row.recomendaciones,
      sortable: true,
      width: "300px",
    },
    {
      name: "Acciones a tomar",
      selector: (row) => row.acciones,
      width: "250px",
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
        </div>
      ),
      width: "90px",
    },
  ];

  const [showRegisterDisease, setShowRegisterDisease] = useState(false); //Form de register
  const [showEditDisease, setShowEditDisease] = useState(false); //Form de edicion
  const [showDeleteDisease, setShowDeleteDisease] = useState(false); //Form de eliminacion
  const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDiseases = async () => {
      try {
        setIsLoading(true); // Indicar que se están cargando las enfermedades
        const response = await fetch(`${backendUrl}/disease`);
        if (response.status === 200) {
          const data = await response.json();
          setDiseases(data);
          setFilteredDiseases(data);
        } else if (response.status === 404) {
          setDiseases([]);
          setFilteredDiseases([]);
        }
        setDataLoaded(true);
      } catch (error) {
        console.error("Error al obtener las enfermades:", error);
        toast.error("Hubo un problema al cargar los datos de las enfermedades. Por favor, inténtelo nuevamente más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    if (!isDataLoaded) {
      getDiseases();
    }
  }, [isDataLoaded]);

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    if (value) {
      //dividir el texto para separar los valores de búsqueda
      const searchValue = value.split(" ");
      const filtered = diseases.filter((disease) => {
        return searchValue.every(
          (value) =>
            disease.nombre.toLowerCase().includes(value) ||
            disease.nombre_cientifico.toLowerCase().includes(value)
        );
      });
      //muestrlas enfermedades filtrados
      setFilteredDiseases(filtered);
    } else {
      setFilteredDiseases(diseases);
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterDisease(true);
  };

  const handleCancelClick = () => {
    setShowRegisterDisease(false);
    setShowEditDisease(false);
    setShowDeleteDisease(false);
    setDataLoaded(false);
  };

  const handleEditClick = (row) => {
    setShowEditDisease(true);
    setIDDisease(row.id_enfermedad);
  };

  const handleDeleteClick = (row) => {
    setShowDeleteDisease(true);
    setIDDisease(row.id_enfermedad);
  };

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="table-diseases-admin">
      <div className="container-adm-pla">
        <div className="title-adm-search-diseases">
          <div>
            <h3>Enfermedades</h3>
            <label className="description-diseases">
              Lista de enfermedades en los invernaderos
            </label>
          </div>
          <div className="header-table-diseases-ad">
            <FontAwesomeIcon
              icon={faSearch}
              className="icon-diseases"
              size="lg"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={inputValue}
              onChange={handleFilter}
              className="search-diseases-adm"
            />
            <button
              type="button"
              className="buttonEnfermedad"
              onClick={handleRegisterClick}>
              Registrar enfermedad
            </button>
          </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredDiseases}
            responsive={true}
            pagination
            paginationPerPage={4}
            paginationRowsPerPageOptions={[4, 12]}
            paginationComponentOptions={paginacionOpciones}
            noDataComponent={
              isLoading ? (
                <div className="no-beds-message">
                  Espere un momento, los datos de las enfermedades se están cargando...
                </div>
              ) : (
                <div className="no-beds-message">
                  Aún no se han registrado enfermedades.
                </div>
              )
            }
          />
          {showRegisterDisease && (
            <RegisterDisease onCancelClick={handleCancelClick} />
          )}
          {showEditDisease && (
            <EditDisease onCancelClick={handleCancelClick} idDisease={idDisease} />
          )}
          {showDeleteDisease && (
            <DeleteDisease onCancelClick={handleCancelClick} idDisease={idDisease} />
          )}
      </div>
    </div>
  );
};

export default DTableDiseases;
