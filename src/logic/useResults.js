import React from "react";
import useSWR from "swr";
import { ProdeContext } from "./ProdeContext";
import { GET } from "./api";

const TRANSFORM = async (url, options) => {
  return GET(url, options).then((data) => {
    const parties = Object.fromEntries(
      data.parties.map((p) => [p.party_id, p.votes_percent.toFixed(1)])
    );

    let results = {};
    const partiesNumber = {
      132: "JxC",
      133: "HNP",
      134: "UxP",
      135: "LLA",
      136: "FIT-U",
    };

    Object.entries(partiesNumber).forEach(([number, id]) => {
      if (parties[number]) {
        results[id] = parseFloat(parties[number]);
      }
    });

    if (data.tables_percent <= 5) {
      return {};
    }

    return {
      realResults: results,
      lastUpdate: new Date(data.last_update).toLocaleTimeString("en-US"),
      tablesPercent: data.tables_percent,
    };
  });
};

export default function useResults() {
  const { ELECCIONES, electionStatus } = React.useContext(ProdeContext);
  const { data, isLoading: isLoadingResults } = useSWR(
    electionStatus !== "PRE" ? ELECCIONES.url : null,
    TRANSFORM,
    {
      refreshInterval: 10000,
      fallback: {
        [ELECCIONES.url]: ELECCIONES.fallback,
      },
    }
  );

  const { realResults, lastUpdate, tablesPercent } = data || {};

  return {
    realResults,
    lastUpdate,
    tablesPercent,
    isLoadingResults,
    declareWinners: tablesPercent >= 95,
  };
}
