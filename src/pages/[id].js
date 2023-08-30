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
import { getAll, getFullParty } from '../logic/db';
import LoginModal from '../widgets/LoginModal';
import PartyStatistics from '../widgets/PartyStatistics';

/*
TODO: FUTURO
- Agregar prode de participacion electoral
- Permitir que las partidas sean configurables
  - Participacion si/no
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

export default function MainDashboard({ party }) {
    const router = useRouter()
    const { id } = router.query
    const { isOpen, onOpen, onClose } = useDisclosure()
    React.useEffect(() => {
        if (party.users.length == 0) {
            onOpen()
        }
    }, [])

    return (
        <MainLayout>
            <LoginModal isOpen={isOpen} onClose={onClose} partyId={id} />
            <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                gap='20px'
                mb='20px'
            >
                <PartyStatistics party={party} />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 4 }} gap='20px' mb='20px'>
                <GridItem colSpan={{ md: 2, "2xl": 3 }}>
                    {/* <MiProde prode={miProde} /> */}
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

export async function getStaticProps({ params }) {
    const partyId = params.id
    const party = await getFullParty(partyId)
    return {
        props: {
            party,
        }
    }
}

export async function getStaticPaths() {
    const parties = await getAll('party')
    return {
        paths: parties.map(p => ({ params: { id: p.split(':')[1] } })),
        fallback: false
    }
}
