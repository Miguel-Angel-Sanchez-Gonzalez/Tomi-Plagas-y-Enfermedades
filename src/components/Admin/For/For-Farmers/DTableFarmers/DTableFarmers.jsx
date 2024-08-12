import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTableFarmers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faPencilAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import RegisterFarmer from "../CRUD/Register/RegisterFarmer";
import EditFarmer from "../CRUD/Edit/EditFarmer";
import DeleteFarmer from "../CRUD/Delete/DeleteFarmer";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
/*Agricultores*/

const DTableFarmers = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [idFarmer, setIDFarmer] = useState("");
  const [isDataLoaded, setDataLoaded] = useState(false);
  
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_agricultor,
      sortable: true,
      width: "65px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      width: "200px",
    },
    {
      name: "Primer apellido",
      selector: (row) => row.primer_apellido,
      sortable: true,
      width: "160px",
    },
    {
      name: "Segundo apellido",
      selector: (row) => row.segundo_apellido,
      sortable: true,
      width: "160px",
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono,
      width: "140px",
    },
    {
      name: "Correo electrónico",
      selector: (row) => row.correo_electronico,
      width: "230px",
    },
    {
      name: "Usuario",
      selector: (row) => row.nombre_usuario,
      sortable: true,
      width: "150px",
    },
    // {
    //   name: "Contraseña",
    //   selector: (row) => "********",
    //   width: "110px",
    // },
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

  const [showRegisterFarmer, setShowRegisterFarmer] = useState(false); //Form de register
  const [showEditFarmer, setShowEditFarmer] = useState(false); //Form de edicion
  const [showDeleteFarmer, setshowDeleteFarmer] = useState(false); //Form de eliminacion
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isDataLoaded) {
      getFarmers();
    }
  }, [isDataLoaded]);

  const getFarmers = async () => {
    try {
      setIsLoading(true); // Indicar que se están cargando los agricultores
      const response = await fetch(`${backendUrl}/farmer/`);
      if (response.status === 200) {
        const data = await response.json();
        setFarmers(data);
        setFilteredFarmers(data);
      } else if (response.status === 404) {
        setFarmers([]);
        setFilteredFarmers([]);
      }
      setDataLoaded(true);
    } catch (error) {
      console.error("Error al cargar los datos de los agricultores:", error);
      toast.error(
        "Hubo un problema al cargar los datos de los agricultores. Por favor, inténtelo nuevamente más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    if (value) {
      //dividir el texto para separar los valores de búsqueda
      const searchValue = value.split(" ");
      const filtered = farmers.filter((farmer) => {
        return searchValue.every(
          (value) =>
            farmer.nombre.toLowerCase().includes(value) ||
            farmer.primer_apellido.toLowerCase().includes(value) ||
            farmer.segundo_apellido.toLowerCase().includes(value)
        );
      });
      //muestra los agricultores filtrados
      setFilteredFarmers(filtered);
    } else {
      setFilteredFarmers(farmers);
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterFarmer(true);
  };

  const handleCancelClick = () => {
    setShowRegisterFarmer(false);
    setShowEditFarmer(false);
    setshowDeleteFarmer(false);
    setDataLoaded(false);
  };

  const handleEditClick = (row) => {
    setShowEditFarmer(true);
    setIDFarmer(row.id_agricultor);
  };

  const handleDeleteClick = (row) => {
    setshowDeleteFarmer(true);
    setIDFarmer(row.id_agricultor);
  };

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="table-farmer-admin">
      <h2 className="h2admin">
          Bienvenido <span className="rol-admin">administrador</span>
      </h2>
      <div className="container-adm-far">
        <div className="title-adm-search-farmer">
          <div>
            <h3>Agricultores</h3>
            <label className="description-farmer">
            Lista de todos los agricultores que existen en el sistema.
            </label>
            </div>
          <div className="header-table-farmer-ad">
          <FontAwesomeIcon
              icon={faSearch}
              className="icon-farmer"
              size="lg"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={inputValue}
              onChange={handleFilter}
              className="search-farmer"
            />
             <button
                type="button"
                className="button-farmer-adm"
                onClick={handleRegisterClick}>
                Registrar agricultor
             </button>
          </div>
        </div>
          <DataTable
            columns={columns}
            data={filteredFarmers}
            responsive={true}
            pagination
            paginationComponentOptions={paginacionOpciones}
            noDataComponent={
              isLoading ? (
                <div className="no-workgreen-message">
                  Espere un momento, las datos de los agricultores se están
                  cargando...
                </div>
              ) : (
                <div className="no-workgreen-message">
                  Aún no se han registrado agricultores.
                </div>
              )
            }
          />
        {showRegisterFarmer && (
          <RegisterFarmer onCancelClick={handleCancelClick} />
        )}
        {showEditFarmer && (
          <EditFarmer onCancelClick={handleCancelClick} idFarmer={idFarmer} />
        )}
        {showDeleteFarmer && (
          <DeleteFarmer onCancelClick={handleCancelClick} idFarmer={idFarmer} />
        )}
      </div>
    </div>
  );
};

export default DTableFarmers;
