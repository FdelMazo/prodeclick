import {
    useDisclosure
} from "@chakra-ui/react";
import React from 'react';

import {
    GridItem,
    SimpleGrid,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import MainLayout from '../layouts';
import { getAll, getParty } from '../logic/db';
import LoginModal from '../widgets/LoginModal';
import PartyStatistics from '../widgets/PartyStatistics';
import MiProde from '../widgets/MiProde';
import useSWR from 'swr';
import { GET } from "../logic/api";
/*
TODO: FUTURO
- Agregar prode de participacion electoral
- Permitir que las partidas sean configurables
  - Participacion si/no
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

export default function MainDashboard() {
    const router = useRouter()
    const { id: partyId } = router.query
    const { data: party, isLoading, mutate } = useSWR(`/api/party/${partyId}`, GET)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [userId, setUserId] = React.useState(null)

    const user = React.useMemo(() => {
        return party?.users?.find(u => u.id === userId)
    }, [party, userId])

    const onLogin = (id) => {
        window.localStorage.userId = id
        window.localStorage.partyId = partyId
        setUserId(id)
        onClose()
        mutate()
    }

    React.useEffect(() => {
        if (!window.localStorage.userId || window.localStorage.partyId !== partyId) {
            onOpen()
        } else {
            setUserId(window.localStorage.userId)
        }
    }, [])

    return (
        <MainLayout>
            <LoginModal isOpen={isOpen} partyId={partyId} onLogin={onLogin} />
            <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                gap='20px'
                mb='20px'
            >
                <PartyStatistics party={party} isLoading={isLoading} />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 4 }} gap='20px' mb='20px'>
                <GridItem colSpan={{ md: 2, "2xl": 3 }}>
                    <MiProde prode={user?.prode} isLoading={isLoading} key={isLoading} userId={userId} mutate={mutate} />
                </GridItem>
                <GridItem colSpan={{ md: 2, "2xl": 1 }}>
                    {/* <Results prode={miProde} title="Mi Prode" /> */}
                </GridItem>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1 }} gap='20px' mb='20px'>
                {/* <Participants /> */}
            </SimpleGrid>
        </MainLayout>
    )
}

export async function getStaticProps() {
    return {
        props: {}
    }
}

export async function getStaticPaths() {
    const parties = await getAll('party')
    return {
        paths: parties.map(p => ({ params: { id: p.split(':')[1] } })),
        fallback: false
    }
}
