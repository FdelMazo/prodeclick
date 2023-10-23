import React from "react";
import ELECCIONES_DATA from "./elecciones";
import useParty from "./useParty";

export const ProdeContext = React.createContext();

export const ProdeProvider = ({ children }) => {
  const prode = Prode();
  return (
    <ProdeContext.Provider value={prode}>{children}</ProdeContext.Provider>
  );
};

const Prode = () => {
  // TODO: calcular aca la lista de ganadores y usar aca el criterio de que terminan las elecciones (>95% mesas)
  const { isParty, party } = useParty();

  const ELECCIONES =
    ELECCIONES_DATA.elecciones[
      isParty ? party?.electionsId : ELECCIONES_DATA.current
    ];

  const daysUntilElections = React.useMemo(() => {
    const elections = new Date(ELECCIONES.date);
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const diffTime = elections - today;
    return Math.ceil(diffTime / msInDay);
  }, [ELECCIONES]);

  const electionStatus = React.useMemo(() => {
    const days = daysUntilElections;
    if (days < 0) {
      return "POST";
    } else if (days == 0) {
      return "DAY";
    } else {
      return "PRE";
    }
  }, [daysUntilElections]);

  return {
    ELECCIONES,
    daysUntilElections,
    electionStatus,
  };
};
