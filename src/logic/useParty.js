import { useRouter } from "next/router"
import useSWR from 'swr'
import { GET } from "./api"
import React from "react"
import { useLocalStorage } from "usehooks-ts"

export default function useParty() {
    const router = useRouter()
    const { id: partyId } = router.query
    const { data: party, isLoading, mutate } = useSWR(`/api/party/${partyId}`, GET)
    const isParty = !!partyId
    const needsAdmin = isParty && !party.admin

    const [userId, setUserId] = useLocalStorage('userId', null)
    const login = (id) => {
        setUserId(id)
        window.localStorage.setItem('partyId', party.id)
    }

    const user = React.useMemo(() => {
        return party?.users?.find(u => u.id === userId)
    }, [party, userId])

    const isAdmin = React.useMemo(() => {
        return party?.admin?.id === userId
    }, [party, userId])

    const isLogged = React.useMemo(() => {
        return userId && window.localStorage.partyId === partyId
    }, [party, userId])


    return {
        user,
        party,
        mutate,
        login,
        isLoading,
        isParty,
        needsAdmin,
        isAdmin,
        isLogged
    }
}
