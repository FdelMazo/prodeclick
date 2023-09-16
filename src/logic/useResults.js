import useSWR from "swr";
import { GET } from "./api";

const TRANSFORM = (url, options) => {
  return GET(url, options).then((data) => {
    const parties = Object.fromEntries(
      data.parties.map((p) => [p.party_id, p.votes_percent.toFixed(1)])
    );
    let results = {};
    results["UxP"] = parties["134"];
    results["LLA"] = parties["135"];
    results["JxC"] = parties["132"];
    results["HNP"] = parties["133"];
    results["FIT-U"] = parties["136"];

    return {
      results,
      lastUpdate: new Date(data.last_update),
      tablesPercent: data.tables_percent,
    };
  });
};

export default function useResults() {
  // TODO: UPDATE THIS LINK!!!
  const { data, isLoading: isLoadingResults } = useSWR(
    "https://data-ecp.clarin.com/clarin.com/2023/argentina/paso/AR_president.json",
    TRANSFORM
  );

  const { results, lastUpdate, tablesPercent } = data || {};

  return {
    results,
    lastUpdate,
    tablesPercent,
    isLoadingResults,
  };
}
