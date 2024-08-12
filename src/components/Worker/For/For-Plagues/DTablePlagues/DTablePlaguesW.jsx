import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./DTablePlaguesW.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DTablePlaguesW = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredPlagues, setFilteredPlagues] = useState([]);
  
  const columns = [
    // {
    //   name: "ID",
    //   selector: (row) => row.id_plaga,
    //   sortable: true,
    //   width: "65px",
    // },
    {
      name: "Nombre de la plaga",
      selector: (row) => row.nombre,
      sortable: true,
      width: "170px",
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
      width: "300px",
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
      width: "300px",
    },
  ];

  const [plagues, setPlagues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const getPlagues = async () => {
      try {
        setIsLoading(true); // Indicar que se están cargando las plagas
        const response = await fetch(`${backendUrl}/plague/`);
        if (response.status === 200) {
          const data = await response.json();
          setPlagues(data);
          setFilteredPlagues(data);
        } else if (response.status === 404) { 
          setPlagues([]);
          setFilteredPlagues([]);
        }
      } catch (error) {
        console.error("Error al cargar los datos de las plagas:", error);
        toast.error("Hubo un problema al cargar los datos de las plagas. Por favor, inténtelo nuevamente más tarde.");
      } finally {
          setIsLoading(false);
      }
    };
      getPlagues();
  }, []);

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    if (value) {
      const searchValue = value.split(" ");
      const filtered = plagues.filter((plague) => {
        return searchValue.every(
          (value) =>
            plague.nombre.toLowerCase().includes(value) ||
            plague.nombre_cientifico.toLowerCase().includes(value)
        );
      });
      setFilteredPlagues(filtered);
    } else {
      setFilteredPlagues(plagues);
    }
  };

  const paginacionOpciones = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  
  return (
    <div className="table-plagues-worker">
      <div className="container-work-pla">
          <div className="title-work-search-plagues">
            <div>
              <h3>Plagas</h3>
              <label className="description-plagues">
                Lista de plagas en los invernaderos
              </label>
            </div>
            <div className="header-table-plagues-wor">
              <FontAwesomeIcon
                icon={faSearch}
                className="icon-plagues"
                size="lg"
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={inputValue}
                onChange={handleFilter}
                className="search-plagues"
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredPlagues}
            responsive={true}
            pagination
            paginationPerPage={4}
            paginationRowsPerPageOptions={[4, 12]}
            paginationComponentOptions={paginacionOpciones}
            noDataComponent={
              isLoading ? (
                <div className="no-beds-message">
                  Espere un momento, los datos de las plagas se están cargando...
                </div>
              ) : (
                <div className="no-beds-message">
                  Aún no se han registrado plagas.
                </div>
              )
            }
          />
        </div>
    </div>
  );
};

export default DTablePlaguesW;
