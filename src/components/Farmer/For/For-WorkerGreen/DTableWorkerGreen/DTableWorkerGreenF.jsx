import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTableWorkerGreenF.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useParams } from "react-router-dom";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import AsignGreenhouse from "../AsignedDelete/Asign/AsignGreenhouse";
import DeleteWorkerGreen from "../AsignedDelete/Delete/DeleteWorkerGreen";
//FARMER
const DTableWorkerGreenF = ({ isLoading, noGreenworkerMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredGreenWorker, setFilteredGreenWorker] = useState([]);
  const [modalState, setModalState] = useState({ idWorker: "", idFarmer: "" });
  const [nameWorker, setNameWorker] = useState("");
  const [idWorkerGreenhouse, setIDWorkerGreenhouse] = useState("");
  const [options, setOptions] = useState([]);

  const location = useLocation();
  const { idWorker: paramIdWorker, idFarmer: paramIdFarmer } = useParams();

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_trabajadorinvernadero,
      sortable: true,
      width: "65px",
    },
    {
      name: "Nombre del invernadero",
      selector: (row) => row.nombre,
      sortable: true,
      width: "300px",
    },
    {
      name: "Tipo de invernadero",
      selector: (row) => row.tipo_invernadero,
      sortable: true,
      width: "300px",
    },
    {
      name: "Agricultor responsable",
      selector: (row) => row.nombre_agricultor,
      sortable: true,
      width: "300px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => handleDeleteGreenhouse(row)}
          className="delete-icon"
          size="lg"
        />
      ),
      width: "100px",
    },
  ];

  const [showAssignGreenhouse, setShowSelectGreenhouse] = useState(false);
  const [showDeleteWorkerGreen, setShowDeleteWorkerGreen] = useState(false);
  const [greenWorkers, setGreenWorker] = useState([]);

  useEffect(() => {
    const workerId = location.state?.idWorker || paramIdWorker;
    const workerName = location.state?.nameWorker;
    const farmerId = location.state?.idFarmer || paramIdFarmer;
    if (workerId) {
      setModalState((prevState) => ({
        ...prevState,
        idWorker: workerId,
        idFarmer: farmerId || prevState.idFarmer,
      }));
      setNameWorker(workerName);
      getGreenhouseByIdWorker(workerId);
    }
  }, [location.state, paramIdWorker, paramIdFarmer]);

  const getGreenhouseByIdWorker = async (idWorker) => {
    try {
      const response = await fetch(
        `http://localhost:3000/worker/getgreenhouses/${idWorker}`
      );
      if (response.status === 200) {
        const data = await response.json();
        setGreenWorker(data);
        setFilteredGreenWorker(data);
      } else if (response.status === 404) {
        setGreenWorker([]);
        setFilteredGreenWorker([]);
      }
    } catch (error) {
      console.error(
        "Error al obtener los invernaderos asignados a este trabajador:",
        error
      );
      toast.error(
        "Hubo un problema al cargar los invernaderos asignados a este trabajador. Por favor, inténtelo más tarde."
      );
    }
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    if (value) {
      const searchValue = value.split(" ");
      const filtered = greenWorkers.filter((green) =>
        searchValue.every((val) => green.nombre.toLowerCase().includes(val))
      );
      setFilteredGreenWorker(filtered);
    } else {
      setFilteredGreenWorker(greenWorkers);
    }
  };

  const handleAsignGreenhouse = async () => {
    const greenAssgnExist = await getGreenhouses();
    if (greenAssgnExist) {
      setShowSelectGreenhouse(true);
    }
  };

  const handleDeleteGreenhouse = (row) => {
    setIDWorkerGreenhouse(row.id_trabajadorinvernadero);
    setShowDeleteWorkerGreen(true);
  };

  const handleCancelClick = () => {
    setShowDeleteWorkerGreen(false);
  };

  async function getGreenhouses() {
    try {
        const response = await fetch('http://localhost:3000/greenhouse');
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
      toast.warn(" Para poder asignar invernaderos necesitas registrar uno.", {
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

  const handleUpdateGreenhouses = () => {
    getGreenhouseByIdWorker(modalState.idWorker);
  };

  return (
    <div className="table-workgreen-admin">
      <div className="right-content-workgreen">
        <h1 className="h2green-workgreen">
          Trabajador <span className="name-greenworker"> {nameWorker}</span>
        </h1>
        <div className="only-table-workgreen-f">
          <div className="title-and-search-workgreen">
            <div>
              <h3>Invernaderos asignados</h3>
              <label className="description-workgreen">
                Lista de los invernaderos que tiene asignado el trabajador
              </label>
            </div>
            <div className="header-table-workgreen">
              <FontAwesomeIcon
                icon={faSearch}
                className="icon-workgreen"
                size="lg"
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={inputValue}
                onChange={handleFilter}
                className="search-workgreen"
              />
              <button
                type="button"
                className="buttonWorkgreen"
                onClick={handleAsignGreenhouse}
              >
                Asignar invernadero
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="loading-message">
              Espere un momento, se están cargando los invernaderos...
            </div>
          ) : filteredGreenWorker.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredGreenWorker}
              responsive={true}
              fixedHeader
              pagination
              paginationComponentOptions={paginacionOpciones}
            />
          ) : (
            <div className="no-workgreen-message">
              {noGreenworkerMessage ||
                "Aún no se han asignado invernaderos para este trabajador."}
            </div>
          )}
        </div>
      </div>
      {showAssignGreenhouse && (
        <AsignGreenhouse
          onCancelClick={() => setShowSelectGreenhouse(false)}
          idWorker={modalState.idWorker}
          idFarmer={modalState.idFarmer}
          onUpdateGreenhouses={handleUpdateGreenhouses}
        />
      )}
      {showDeleteWorkerGreen && (
        <DeleteWorkerGreen
          onCancelClick={handleCancelClick}
          idWorkerGreenhouse={idWorkerGreenhouse}
          onUpdateGreenhouses={handleUpdateGreenhouses}
        />
      )}
    </div>
  );
};

export default DTableWorkerGreenF;
