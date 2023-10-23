import useSWR from "swr";
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
      lastUpdate: new Date(data.last_update),
      tablesPercent: data.tables_percent,
    };
  });
};

export default function useResults() {
  // TODO: poner fallback el lunes post elecciones
  const { data, isLoading: isLoadingResults } = useSWR(
    "https://data-ecp.clarin.com/clarin.com/2023/argentina/general/AR_president.json",
    TRANSFORM
  );

  const { realResults, lastUpdate, tablesPercent } = data || {};

  return {
    realResults,
    lastUpdate,
    tablesPercent,
    isLoadingResults,
  };
}
