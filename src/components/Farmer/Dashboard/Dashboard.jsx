import React, { useEffect } from "react";
import {
  Card,
  Metric,
  Text,
  Title,
  DonutChart,
  LineChart,
  DatePicker,
  Button,
  Dialog,
  DialogPanel,
  ProgressBar,
  Legend,
  BarChart,
} from "@tremor/react";
import { useState } from "react";
import "./Dashboard.css";
import ComboBoxGreenHouse from "./ComboBoxGreenHouse/ComboBoxGreenHouse";
import { RiQuestionnaireFill } from "@remixicon/react";
import GraphicSwitch from "../Dashboard/GraphicSwitch/GraphicSwitch";
//FARMER
const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState(null);
  const [selectedGreenhouseName, setSelectedGreenhouseName] = useState("");
  const [numPlagas, setNumPlagas] = useState("0");
  const [numEnfermedades, setNumEnfermedades] = useState("0");
  const [numTratadas, setNumTratadas] = useState("0");
  const [numSinVer, setNumSinVer] = useState("0");
  const [plagasData, setPlagasData] = useState([]);
  const [enfermedadesData, setEnfermedadesData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState("LineChart");
  const [typeGraphic, setTypeGraphic] = useState("Líneas");
  const [error, setError] = useState(null);
  const idFarmer = localStorage.getItem("idFarmer");

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/greenhouse/farmer/${idFarmer}`
        );
        if (!response.ok) {
          throw new Error("El agricultor aún no tiene invernaderos.");
        }
        const data = await response.json();
        if (data.message === "El agricultor no tiene invernaderos") {
          setError("El agricultor aún no tiene invernaderos.");
        } else {
          setError(null);
        }
      } catch (error) {
        setError("El agricultor aún no tiene invernaderos.");
      }
    };

    fetchGreenhouses();
  }, [idFarmer]);

  const addCommasToNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);

    if (newStatus === "LineChart") {
      setTypeGraphic("Líneas");
    } else {
      setTypeGraphic("Barras");
    }
  };

  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  const handleSelectionChange = (
    selectedGreenhouseName,
    selectedGreenhouseId
  ) => {
    setSelectedGreenhouseId(selectedGreenhouseId);
    setSelectedGreenhouseName(selectedGreenhouseName);
    setSelectedDate(null);

    // Fetch Obtiene numero de plagas
    fetch(
      `http://localhost:3000/dashboard/getTotalPlaguesByIdGreenhouse/${selectedGreenhouseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNumPlagas(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });

    // Fetch Obtiene numero de enfermedades
    fetch(
      `http://localhost:3000/dashboard/getTotalDiseasesByIdGreenhouse/${selectedGreenhouseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNumEnfermedades(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });

    // Fetch Obtiene el estado de las imágenes
    fetch(
      `http://localhost:3000/dashboard/getTotalImagesAnalizedByStatus/${selectedGreenhouseId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          setNumTratadas("0");
          setNumSinVer("0");
        } else {
          const tratada = data.find((item) => item.Estado === "Tratada");
          const sinVer = data.find((item) => item.Estado === "Sin ver");

          setNumTratadas(tratada ? tratada.Cantidad : "0");
          setNumSinVer(sinVer ? sinVer.Cantidad : "0");
        }
      })
      .catch((error) => {
        setNumTratadas("0");
        setNumSinVer("0");
      });

    // Fetch Obtiene el conteo de plagas
    fetch(
      `http://localhost:3000/dashboard/getCountPlagues/${selectedGreenhouseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log("Invernadero sin datos de plagas");
          setPlagasData([]);
        } else {
          setPlagasData(
            data.map((plaga) => ({
              name: plaga.Nombre,
              sales: plaga.Cantidad,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });

    // Fetch Obtiene el conteo de enfermedades
    fetch(
      `http://localhost:3000/dashboard/getCountDiseases/${selectedGreenhouseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log("Invernadero sin datos de enfermedades");
          setEnfermedadesData([]);
        } else {
          setEnfermedadesData(
            data.map((enfermedad) => ({
              name: enfermedad.Nombre,
              sales: enfermedad.Cantidad,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });

    // Función para convertir fechas de "DD-MM-YYYY" a objetos Date
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("-");
      return new Date(year, month - 1, day);
    };

    fetch(
      `http://localhost:3000/dashboard/totalPlaguesDiseases/${selectedGreenhouseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setChartData([]);
          setNoDataMessage(
            "Sin datos periódicos de detecciones en este invernadero"
          ); // Establecer mensaje de "sin datos"
        } else {
          const transformedData = data.map((item) => ({
            date: item.fecha,
            Plagas: parseInt(item.Cantidad_Plagas),
            Enfermedades: parseInt(item.Cantidad_Enfermedades),
          }));

          // Ordenar los datos por fecha
          transformedData.sort((a, b) => parseDate(a.date) - parseDate(b.date));
          setChartData(transformedData);
          setNoDataMessage(""); // Limpiar mensaje de "sin datos" si hay datos
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("-");
      return new Date(year, month - 1, day);
    };

    if (!date) {
      // Si la fecha es null, cargar el historial completo de detecciones
      fetch(
        `http://localhost:3000/dashboard/totalPlaguesDiseases/${selectedGreenhouseId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setChartData([]);
            setNoDataMessage(
              "Sin datos periódicos de detecciones en este invernadero"
            );
          } else {
            const transformedData = data.map((item) => ({
              date: item.fecha,
              Plagas: parseInt(item.Cantidad_Plagas),
              Enfermedades: parseInt(item.Cantidad_Enfermedades),
            }));

            // Ordenar los datos por fecha
            transformedData.sort(
              (a, b) => parseDate(a.date) - parseDate(b.date)
            );
            setChartData(transformedData);
            setNoDataMessage(""); // Limpiar mensaje de "sin datos" si hay datos
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos:", error);
        });
      return;
    }

    if (selectedGreenhouseId && date) {
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      console.log("Fecha formateada:", formattedDate);

      fetch(
        `http://localhost:3000/dashboard/getTotalPlaguesDiseasesDetectedByDate/${selectedGreenhouseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: formattedDate }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.message || data.length === 0) {
            setChartData([]);
            setNoDataMessage(
              "Sin datos de detección para la fecha seleccionada"
            );
          } else {
            const transformedData = data.map((item) => ({
              date: item.fecha,
              Plagas: parseInt(item.Cantidad_Plagas),
              Enfermedades: parseInt(item.Cantidad_Enfermedades),
            }));

            setChartData(transformedData);
            setNoDataMessage(""); // Limpiar mensaje de "sin datos" si hay datos
          }
        })
        .catch((error) => {
          console.error("Error al obtener datos:", error);
        });
    }
  };

  // Calcula el porcentaje de amenazas tratadas
  const totalAmenazas = parseInt(numTratadas) + parseInt(numSinVer);
  const porcentajeTratadas =
    totalAmenazas > 0 ? (parseInt(numTratadas) / totalAmenazas) * 100 : 0;
  const porcentajeSinVer =
    totalAmenazas > 0 ? (parseInt(numSinVer) / totalAmenazas) * 100 : 0;

  return (
    <div className="main-div bg-gray-100">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-3">
            <Text className="text-lg-medium md:mt-0">
              Seleccione invernadero
            </Text>
            <ComboBoxGreenHouse onChange={handleSelectionChange} />
            <Text className="text-lg-medium md:mt-4">Seleccione una fecha</Text>
            <DatePicker
              className="md:mt-4"
              maxDate={new Date()}
              onValueChange={handleDateChange}
            />
            <span className="switch-label2">Cambiar gráfico</span>
            <GraphicSwitch onChange={handleStatusChange} />
            <Button
              variant="secondary"
              icon={RiQuestionnaireFill}
              onClick={() => setIsOpen(true)}
            >
              Ayuda
            </Button>
            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              static={true}
            >
              <DialogPanel>
                <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Ayuda para el Usuario
                </h3>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  <strong>Seleccione Invernadero:</strong> Use la lista
                  desplegable para elegir el invernadero que desea analizar. Al
                  seleccionar un invernadero, los gráficos y datos se
                  actualizarán para mostrar la información correspondiente a ese
                  invernadero.
                </p>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  <strong>Seleccione una Fecha:</strong> Utilice el calendario
                  para elegir una fecha. Puede seleccionar una fecha en el
                  pasado para ver las plagas y enfermedades detectadas desde esa
                  fecha hasta el día actual. Las fechas futuras no están
                  disponibles para la selección.
                </p>
                <p className="mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  <strong>Cambiar Tipo de Gráfico:</strong> Use el interruptor
                  para cambiar el tipo de gráfico del historial de detecciones.
                  Por defecto, se muestra un gráfico de líneas, pero puede
                  cambiarlo a un gráfico de barras según su preferencia. Esta
                  opción le permite ver el dashboard de la manera que más le
                  agrade.
                </p>
                <Button
                  className="mt-8 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  ¡Entendido!
                </Button>
              </DialogPanel>
            </Dialog>
          </div>

          {selectedGreenhouseId ? (
            <>
              {/* Fila 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                <Section>
                  <CardMetric title="Total de Plagas" value={numPlagas} />
                </Section>

                <Section>
                  <CardMetric
                    title="Total de Enfermedades"
                    value={numEnfermedades}
                  />
                </Section>

                <Card className="mx-auto max-w-sm">
                  <h5 className="mb-2">Estado de las Amenazas</h5>
                  <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                    <span> {porcentajeTratadas.toFixed(1)}% Tratado</span>
                    <span>{porcentajeSinVer.toFixed(1)}% Sin ver</span>
                  </p>
                  <ProgressBar
                    value={porcentajeTratadas}
                    color="teal"
                    className="mt-3"
                  />
                </Card>
              </div>

              {/* Fila 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                <Section>
                  <CardDonut
                    title={`Plagas en el ${selectedGreenhouseName}`}
                    data={plagasData}
                    valueFormatter={addCommasToNumber}
                    variant="pie"
                  />
                </Section>

                <Section>
                  <CardDonut
                    title={`Enfermedades en el ${selectedGreenhouseName}`}
                    data={enfermedadesData}
                    valueFormatter={addCommasToNumber}
                  />
                </Section>
              </div>

              {/* Fila 3 */}
              <Card>
                <Title>Historial de Detecciones</Title>
                {noDataMessage ? (
                  <Text>{noDataMessage}</Text>
                ) : (
                  <>
                    {status === "LineChart" && (
                      <LineChart
                        data={chartData}
                        index="date"
                        categories={["Plagas", "Enfermedades"]}
                        colors={["violet", "cyan"]}
                        valueFormatter={dataFormatter}
                        yAxisWidth={40}
                        className="custom-linechart"
                      />
                    )}
                    {status === "BarChart" && (
                      <BarChart
                        data={chartData}
                        index="date"
                        categories={["Plagas", "Enfermedades"]}
                        colors={["violet", "cyan"]}
                        valueFormatter={dataFormatter}
                        yAxisWidth={40}
                        className="custom-barchart"
                      />
                    )}
                  </>
                )}
              </Card>
            </>
          ) : (
            <Text className="text-lg-medium text-center mt-8">
              Seleccione un invernadero de la lista o cree uno nuevo para
              comenzar.
            </Text>
          )}
        </>
      )}
    </div>
  );
};

const Section = ({ children }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-1">{children}</div>
);

const CardMetric = ({ title, value }) => (
  <Card className="max-w-full">
    <Text className="text-medium">{title}</Text>
    <Metric>{value}</Metric>
  </Card>
);

const CardDonut = ({ title, data, valueFormatter }) => (
  <Card className="max-w-full">
    <Title className="text-medium">{title}</Title>
    <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
      <DonutChart
        data={data}
        category="sales"
        index="name"
        valueFormatter={valueFormatter}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
        className="w-full md:w-2/5"
      />
      <Legend
        categories={data.map((item) => item.name)}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
        className="max-w-xs"
      />
    </div>
  </Card>
);

export default Dashboard;
