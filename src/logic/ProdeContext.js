import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { getParty } from "./api";
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

  const [userId, setUserId] = React.useState(null);
  const [prodeusers, setProdeusers] = useLocalStorage("prodeusers", {});
  const [savedParties, setSavedParties] = React.useState({});
  React.useEffect(() => {
    setUserId(prodeusers?.[party?.id]);
    const fetchSavedParties = async () => {
      if (isParty) return;
      const savedParties = Object.fromEntries(
        (
          await Promise.all(
            Object.keys(prodeusers).map((u) => getParty(u, true))
          )
        ).map((p) => [p.id, p.name])
      );
      setSavedParties(savedParties);
    };
    fetchSavedParties();
  }, [isParty, party, prodeusers]);

  const login = (id) => {
    setProdeusers({ ...prodeusers, [party.id]: id });
  };

  const logout = () => {
    setProdeusers({ ...prodeusers, [party.id]: null });
  };

  return {
    ELECCIONES,
    daysUntilElections,
    electionStatus,
    savedParties,
    login,
    logout,
    isLogged: !!userId,
    user: party?.users?.find((u) => u.id === userId),
  };
};
