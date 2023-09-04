import { useRouter } from "next/router"
import useSWR from 'swr'
import { GET } from "./api"
import React from "react"
import { useLocalStorage } from "usehooks-ts"

export default function useParty() {
    const router = useRouter()
    const { id: partyId } = router.query
    const { data: party, isLoading, mutate } = useSWR(partyId ? `/api/party/${partyId}` : null, GET)

    const [userId, setUserId] = useLocalStorage('userId', null)
    const login = (id) => {
        setUserId(id)
        window.localStorage.setItem('partyId', partyId)
    }

    const user = React.useMemo(() => {
        return party?.users?.find(u => u.id === userId)
    }, [party, userId])

    const needsAdmin = React.useMemo(() => {
        return !party?.admin
    }, [party])

    const isAdmin = React.useMemo(() => {
        return party?.admin?.id === userId
    }, [party, userId])

    return {
        user,
        party,
        isLoading,
        mutate,
        login,
        partyId,
        isParty: !!partyId,
        needsAdmin,
        isAdmin
    }
}
