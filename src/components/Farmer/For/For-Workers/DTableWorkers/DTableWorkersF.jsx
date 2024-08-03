import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPencilAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./DTableWorkersF.css";
import RegisterWorker from "../CRUD/Register/RegisterWorker";
import EditWorker from "../CRUD/Edit/EditWorker";
import DeleteWorker from "../CRUD/Delete/DeleteWorker";

/*Trabajadores*/
//FARMER
const DTableWorkersF = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [idWorker, setIDWorker] = useState("");
  const [isDataLoaded, setDataLoaded] = useState(false);

  const navigate = useNavigate();

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_trabajador,
      sortable: true,
      width: "65px",
    },
    {
      name: "Nombre(s)",
      selector: (row) => row.nombre,
      sortable: true,
      width: "150px",
    },
    {
      name: "Primer apellido",
      selector: (row) => row.primer_apellido,
      sortable: true,
      width: "150px",
    },
    {
      name: "Segundo apellido",
      selector: (row) => row.segundo_apellido,
      sortable: true,
      width: "150px",
    },
    {
      name: "Ver invernaderos",
      cell: (row) => (
        <div>
          <button
            className="verInvernaderos-button"
            onClick={() => handleShowGWorkers(row)}
          >
            Listar
          </button>
        </div>
      ),
      width: "135px",
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono,
      width: "120px",
    },
    {
      name: "Correo electrónico",
      selector: (row) => row.correo_electronico,
      width: "220px",
    },
    {
      name: "Usuario",
      selector: (row) => row.nombre_usuario,
      sortable: true,
      width: "110px",
    },
    // {
    //   name: "Contraseña",
    //   selector: (row) => "********",
    //   width: "100px",
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
  const [showRegisterWorker, setShowRegisterWorker] = useState(false); //Form de register
  const [showEditWorker, setShowEditWorker] = useState(false); //Form de edicion
  const [showDeleteWorker, setShowDeleteWorker] = useState(false); //Form de eliminacion
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const idFarmer = localStorage.getItem("idFarmer");

  useEffect(() => {
    if (!isDataLoaded) {
      getWorkers();
    }
  }, [isDataLoaded]);

  const getWorkers = async () => {
    try {
      setIsLoading(true); // Indicar que se están cargando los trabajadores
      const response = await fetch(
        `http://localhost:3000/farmer/getworkers/${idFarmer}`);
      if (response.status === 200) {
        const data = await response.json();
        setWorkers(data);
        setFilteredWorkers(data);
      } else if (response.status === 404) {
        setWorkers([]);
        setFilteredWorkers([]);
      }
      setDataLoaded(true);
    } catch (error) {
      console.error("Error al obtener los trabajadores:", error);
      toast.error(
        "Hubo un problema al cargar los datos de los trabajadores. Por favor, inténtelo nuevamente más tarde."
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
      const filtered = workers.filter((worker) => {
        return searchValue.every(
          (value) =>
            worker.nombre.toLowerCase().includes(value) ||
            worker.primer_apellido.toLowerCase().includes(value) ||
            worker.segundo_apellido.toLowerCase().includes(value)
        );
      });

      //muestra los agricultores filtrados
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workers);
    }
  };

  const handleRegisterClick = () => {
    setShowRegisterWorker(true);
  };

  const handleCancelClick = () => {
    setShowRegisterWorker(false);
    setShowEditWorker(false);
    setShowDeleteWorker(false);
    setDataLoaded(false);
  };

  const handleEditClick = (row) => {
    //console.log("ID del registro a actualizar:", row.id_trabajador);
    setShowEditWorker(true);
    setIDWorker(row.id_trabajador);
  };

  const handleDeleteClick = (row) => {
    //console.log("ID del registro a eliminar:", row.id_trabajador);
    setShowDeleteWorker(true);
    setIDWorker(row.id_trabajador);
  };

  //Para ver la tabla de invernaderos
  const handleShowGWorkers = (row) => {
    try {
      navigate(`/homeFarmer/trabajadores/${row.nombre}`, {
        state: {
          idWorker: row.id_trabajador,
          nameWorker: row.nombre,
        },
      });
    } catch (error) {
      console.error(
        "Error al navegar a la sección de lo invernaderos asignados a un trabajador:",
        error
      );
      alert(
        "Error al intentar mostrar los invernaderos asignados a un trabajador"
      );
    }
  };

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="table-worker-farmer">
      <div className="container-farm-far">
        <div className="title-farm-search-worker">
          <div>
            <h3>Trabajadores</h3>
            <label className="description-worker-farm">
            Lista de todos los trabajadores que existen en el sistema.
            </label>
            </div>
          <div className="header-table-worker-ad-farm">
          <FontAwesomeIcon
              icon={faSearch}
              className="icon-worker-f"
              size="lg"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={inputValue}
              onChange={handleFilter}
              className="search-worker-f"
            />
             <button
                type="button"
                className="button-worker-farm"
                onClick={handleRegisterClick}>
                Registrar trabajador
             </button>
          </div>
        </div>
          <DataTable
            columns={columns}
            data={filteredWorkers}
            responsive={true}
            pagination
            paginationComponentOptions={paginacionOpciones}
            noDataComponent={
              isLoading ? (
                <div className="no-workgreen-message">
                  Espere un momento, los datos de los trabajadores se están cargando...
                </div>
              ) : (
                <div className="no-workgreen-message">
                  Aún no se han registrado trabajadores.
                </div>
              )
            }
          />
        {showRegisterWorker && (
          <RegisterWorker onCancelClick={handleCancelClick} />
        )}{" "}
        {}
        {showEditWorker && (
          <EditWorker onCancelClick={handleCancelClick} idWorker={idWorker} />
        )}
        {showDeleteWorker && (
          <DeleteWorker onCancelClick={handleCancelClick} idWorker={idWorker} />
        )}
      </div>
    </div>
  );
};

export default DTableWorkersF;