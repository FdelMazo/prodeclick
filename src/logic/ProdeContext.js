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
  const { isParty, party } = useParty();

  const electionsId = isParty ? party?.electionsId : ELECCIONES_DATA.current;
  const ELECCIONES = {
    ...ELECCIONES_DATA.elecciones[electionsId],
    id: electionsId,
  };

  const daysUntilElections = React.useMemo(() => {
    const elections = new Date(ELECCIONES.date);
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const diffTime = elections - today;
    return Math.ceil(diffTime / msInDay);
  }, [ELECCIONES]);

  // TODO: testear bien los diferentes escenarios, estuve viendo errores
  // de hidration en prod
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

  const lastWeekend = React.useMemo(() => {
    return daysUntilElections <= 2;
  }, [daysUntilElections]);

  const [userId, setUserId] = React.useState(null);
  const [prodeusers, setProdeusers] = useLocalStorage("prodeusers", {});
  const [savedParties, setSavedParties] = React.useState(null);
  React.useEffect(() => {
    setUserId(prodeusers?.[party?.id]);
    const fetchSavedParties = async () => {
      const savedParties = await Promise.all(
        Object.keys(prodeusers).map((u) => getParty(u, true))
      );
      setSavedParties(savedParties);
    };
    fetchSavedParties();
  }, [party, prodeusers]);

  const login = (id, partyId = null) => {
    setProdeusers({ ...prodeusers, [partyId || party.id]: id });
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
    lastWeekend,
    isLogged: !!userId,
    user: party?.users?.find((u) => u.id === userId),
  };
};
