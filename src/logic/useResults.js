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
    results["UxP"] = parseFloat(parties["134"]);
    results["LLA"] = parseFloat(parties["135"]);
    results["JxC"] = parseFloat(parties["132"]);
    results["HNP"] = parseFloat(parties["133"]);
    results["FIT-U"] = parseFloat(parties["136"]);

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
