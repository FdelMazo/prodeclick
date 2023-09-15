import useSWR from "swr";
import { GET } from "./api";

const TRANSFORM = (url, options) => {
  return GET(url, options).then((data) => {
    return {
      results: data.parties,
      lastUpdate: new Date(data.last_update),
      tablesPercent: data.tables_percent,
    };
  });
};

export default function useResults() {
  // TODO: UPDATE THIS LINK!!!
  const { data, isLoading: isLoadingResults } = useSWR(
    "https://data-ecp.clarin.com/clarin.com/2023/argentina/???/AR_president.json",
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
