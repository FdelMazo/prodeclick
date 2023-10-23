import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";
import { GET } from "./api";

export default function useParty() {
  const router = useRouter();
  const { id: partyId } = router.query;
  const {
    data: party,
    isLoading,
    mutate,
  } = useSWR(partyId ? `/api/party/${partyId}` : null, GET);

  const [savedUsers, setSavedUsers] = useLocalStorage("prodeusers", {});
  const [userId, setUserId] = React.useState(null);

  // TODO: esto se deberia setear solo una vez y mandar por context
  // (hay una race condition que a veces salta)
  React.useEffect(() => {
    setUserId(savedUsers?.[partyId]);
  }, [partyId, savedUsers]);

  const login = (id) => {
    setSavedUsers({ ...savedUsers, [party.id]: id });
  };

  const logout = () => {
    setSavedUsers({ ...savedUsers, [party.id]: null });
  };

  return {
    party,
    isLoading,
    mutate,
    login,
    logout,
    savedUsers,
    user: party?.users?.find((u) => u.id === userId),
    isAdmin: party?.admin?.id === userId,
    needsAdmin: !!partyId && !party.admin,
    isParty: !!partyId,
    isLogged: !!userId,
  };
}
