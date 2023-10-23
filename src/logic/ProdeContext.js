import React from "react";
import ELECCIONES_DATA from "./elecciones";

const ELECCIONES = ELECCIONES_DATA.elecciones[ELECCIONES_DATA.current];
const PARTIDOS = ELECCIONES.partidos;

export const ProdeContext = React.createContext();

export const ProdeProvider = ({ children }) => {
  const prode = Prode();
  return (
    <ProdeContext.Provider value={prode}>{children}</ProdeContext.Provider>
  );
};

const Prode = () => {
  // TODO: poner aca las elecciones elegidas y usar eso toda la app
  // TODO: calcular aca la lista de ganadores y usar aca el criterio de que terminan las elecciones (>95% mesas)
  const [simulatedResults, setSimulatedResults] = React.useState(
    Object.fromEntries(PARTIDOS.map((p) => [p.id, p.defaultPercentage]))
  );
  return {
    simulatedResults,
    setSimulatedResults,
  };
};
