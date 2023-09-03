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
import { getAll } from '../logic/db';
import useParty from '../logic/useParty';
import LoginModal from '../widgets/LoginModal';
import MiProde from '../widgets/MiProde';
import Results from '../widgets/Results';
import PartyStatistics from '../widgets/PartyStatistics';
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
    const { party, user, isLoading, mutate, login, isLogged } = useParty()
    const { isOpen, onOpen, onClose } = useDisclosure()
    React.useEffect(() => {
        if (!window.localStorage.userId || window.localStorage.partyId !== partyId) {
            onOpen()
        }
    }, [])

    return (
        <MainLayout>
            <LoginModal isOpen={isOpen} onClose={onClose} />
            <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                gap='20px'
                mb='20px'
            >
                <PartyStatistics />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 4 }} gap='20px' mb='20px'>
                <GridItem colSpan={{ md: 2, "2xl": 3 }}>
                    <MiProde key={isLoading} />
                </GridItem>
                <GridItem colSpan={{ md: 2, "2xl": 1 }}>
                    <Results />
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
