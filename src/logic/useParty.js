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
  const [hasParties, setHasParties] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  React.useEffect(() => {
    setUserId(savedUsers?.[partyId]);
    setHasParties(Object.keys(savedUsers).length > 0);
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
    hasParties,
    user: party?.users?.find((u) => u.id === userId),
    isAdmin: party?.admin?.id === userId,
    needsAdmin: !!partyId && !party.admin,
    isParty: !!partyId,
    isLogged: !!userId,
  };
}
