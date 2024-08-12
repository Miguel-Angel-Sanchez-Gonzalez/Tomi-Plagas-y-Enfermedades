import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPencilAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./DTableWorkers.css";
import RegisterWorker from "../CRUD/Register/RegisterWorker";
import EditWorker from "../CRUD/Edit/EditWorker";
import DeleteWorker from "../CRUD/Delete/DeleteWorker";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
/*Trabajadores*/

const DTableWorkers = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [idWorker, setIDWorker] = useState("");
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [options, setOptions] = useState([]);

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

  useEffect(() => {
    const getWorkers = async () => {
      try {
        setIsLoading(true); // Indicar que se están cargando los trabajadores
        const response = await fetch(`${backendUrl}/worker/`);
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
        toast.error("Hubo un problema al cargar los datos de los trabajadores. Por favor, inténtelo nuevamente más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    if (!isDataLoaded) {
      getWorkers();
    }
  }, [isDataLoaded]);

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

  const handleRegisterClick = async () => {
    const farmersExist = await getFarmers();
    if (farmersExist) {
      setShowRegisterWorker(true);
    }
    
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
      navigate(`/homeAdmin/trabajadores/${row.nombre}`, {
        state: {
          idWorker: row.id_trabajador,
          nameWorker: row.nombre,
        },
      });
    } catch (error) {
      console.error("Error al navegar a la sección de camas:", error);
      alert("Error al intentar mostrar las camas del invernadero");
    }
  };

  async function getFarmers() {
    try {
        const response = await fetch(`${backendUrl}/farmer/getNameFarmers`);
        const data = await response.json();
        if (data.length === 0) {
          return false;
        } else {
          setOptions(data.map(farmer => ({
            label: farmer.nombre,
            value: farmer.id_agricultor
          })));
          return true;
        }
    } catch (error) {
        toast.warn("No se pueden registrar trabajadores porque aún no se han registrado agricultores", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
      });
      return false;
    }
  }

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="table-worker-admin">
      <div className="container-adm-far">
        <div className="title-adm-search-worker">
          <div>
            <h3>Trabajadores</h3>
            <label className="description-worker">
            Lista de todos los trabajadores que existen en el sistema.
            </label>
            </div>
          <div className="header-table-worker-ad">
          <FontAwesomeIcon
              icon={faSearch}
              className="icon-worker"
              size="lg"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={inputValue}
              onChange={handleFilter}
              className="search-worker"
            />
             <button
                type="button"
                className="button-worker-adm"
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

export default DTableWorkers;
