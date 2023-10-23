import { useRouter } from "next/router";
import useSWR from "swr";
import { GET } from "./api";

export default function useParty() {
  const router = useRouter();
  const { id: partyId } = router.query;
  const {
    data: party,
    isLoading,
    mutate,
  } = useSWR(partyId ? `/api/party/${partyId}` : null, GET);

  return {
    party,
    isLoading,
    mutate,
    isParty: !!partyId,
  };
}
