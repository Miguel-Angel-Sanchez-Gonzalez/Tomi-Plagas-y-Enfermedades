import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTableBeds.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPencilAlt,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import RegisterBed from "../CRUD/Register/RegisterBed";
import EditBed from "../CRUD/Edit/EditBed";
import DeleteBed from "../CRUD/Delete/DeleteBed";
//FARMER
const DTableBeds = ({ isLoading, noBedsMessage }) => {
  const location = useLocation();
  const [inputValue, setInputValue] = useState("");
  const [filteredBeds, setFilteredBeds] = useState([]);
  const [idBed, setIdBed] = useState("");
  const navigate = useNavigate();
  const { idGreenhouse, nameGreenhouse } = location.state;
  console.log("lo que recibimos en params es ", idGreenhouse, nameGreenhouse);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_cama,
      sortable: true,
      width: "65px",
    },
    {
      name: "Número de cama",
      selector: (row) => row.numero_cama,
      sortable: true,
      width: "260px",
    },
    {
      name: "Tipo de cultivo",
      selector: (row) => row.tipo_cultivo,
      sortable: true,
      width: "350px",
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
            onClick={() => handleShowImageAnalized(row)}
            className="view-icon"
            size="lg"
          />
        </div>
      ),
      width: "auto",
    },
  ];

  const [showRegisterBed, setShowRegisterBed] = useState(false);
  const [showEditBed, setShowEditBed] = useState(false);
  const [showDeleteBed, setShowDeleteBed] = useState(false);

  const [beds, setBeds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!isLoaded) {
      getBedByIdGreenhouse();
    }
  }, [isLoaded]);

  const getBedByIdGreenhouse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/bed/greenhouse/${idGreenhouse}`
      );
      console.log(`http://localhost:3000/bed/greenhouse/${idGreenhouse}`);
      if (response.status === 200) {
        const data = await response.json();
        setBeds(data);
        setFilteredBeds(data);
        setIsLoaded(true);
      }
      if (response.status === 404) {
        setBeds([]);
        setFilteredBeds([]);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error al obtener las camas:", error);
    }
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    if (value) {
      const searchValue = value.split(" ");
      const filtered = beds.filter((bed) =>
        searchValue.every((val) => bed.tipo_cultivo.toLowerCase().includes(val))
      );
      setFilteredBeds(filtered);
    } else {
      setFilteredBeds(beds);
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterBed(true);
  };

  const handleCancelClick = () => {
    setShowRegisterBed(false);
    setShowEditBed(false);
    setShowDeleteBed(false);
    setIsLoaded(false);
  };

  const handleEditClick = (row) => {
    setIdBed(row.id_cama);
    setShowEditBed(true);
  };

  const handleDeleteClick = (row) => {
    setIdBed(row.id_cama);
    setShowDeleteBed(true);
  };

  const handleShowImageAnalized = (row) => {
    navigate(`/homeFarmer/invernaderos/camas/imagenes-analizadas`, {
      state: {
        idGreenhouse,
        idBed: row.id_cama,
        numberBed: row.numero_cama,
        nameGreenhouse: nameGreenhouse,
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
    <div className="table-bed-admin">
      <div className="right-content-bed">
        <h1 className="h2green-bed">
          Invernadero <span className="name-bed">{nameGreenhouse}</span>
        </h1>

        <div className="only-table-bed">
          <div className="title-and-search-bed">
            <div>
              <h3>Camas</h3>
              <label className="description-bed">
                Lista de camas que tiene el invernadero seleccionado
              </label>
            </div>
            <div className="header-table-bed">
              <FontAwesomeIcon icon={faSearch} className="icon-bed" size="lg" />
              <input
                type="text"
                placeholder="Buscar..."
                value={inputValue}
                onChange={handleFilter}
                className="search-bed"
              />
              <button
                type="button"
                className="buttonBed"
                onClick={handleRegisterClick}
              >
                Registrar cama
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="loading-message">
              Espere un momento, se están cargando las camas...
            </div>
          ) : filteredBeds.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredBeds}
              responsive={true}
              fixedHeader
              pagination
              paginationComponentOptions={paginacionOpciones}
            />
          ) : (
            <div className="no-beds-message">
              {noBedsMessage ||
                "Aún no se han registrado camas para este invernadero."}
            </div>
          )}
        </div>
      </div>
      {showRegisterBed && (
        <RegisterBed
          onCancelClick={handleCancelClick}
          idGreenhouse={idGreenhouse}
        />
      )}
      {showEditBed && (
        <EditBed
          onCancelClick={handleCancelClick}
          idGreenhouse={idGreenhouse}
          idBed={idBed}
        />
      )}
      {showDeleteBed && (
        <DeleteBed onCancelClick={handleCancelClick} idBed={idBed} />
      )}
      {/* Aquí puedes agregar el componente para la eliminación de camas */}
    </div>
  );
};

export default DTableBeds;
