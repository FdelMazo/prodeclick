import {
    useDisclosure
} from "@chakra-ui/react";
import React from 'react';

import {
    GridItem,
    SimpleGrid,
} from '@chakra-ui/react';
import Head from "next/head";
import MainLayout from '../layouts';
import { getAll } from '../logic/db';
import useParty from '../logic/useParty';
import LoginModal from '../widgets/LoginModal';
import MiProde from '../widgets/MiProde';
import PartyInfo from "../widgets/PartyInfo";
import PartyStatistics from '../widgets/PartyStatistics';
import Results from '../widgets/Results';
/*
TODO: FUTURO
- Agregar prode de participacion electoral
- Permitir que las partidas sean configurables
  - Participacion si/no
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

export default function MainDashboard() {
    const { partyId, party, user, isLoading, isAdmin, mutate, login, isLogged } = useParty()
    const { isOpen, onOpen, onClose } = useDisclosure()
    React.useEffect(() => {
        if (isLoading) return
        if (!window.localStorage.userId || window.localStorage.partyId !== partyId) {
            onOpen()
        }
    }, [isLoading])


    return (
        <MainLayout>
            {!isLoading && (
                <Head>
                    <title>prode.ar - {party.name}</title>
                </Head>
            )}

            <LoginModal isOpen={isOpen} onClose={onClose} />
            <SimpleGrid
                columns={{ base: 1, lg: 3 }}
                gap='20px'
                mb='20px'
            >
                <PartyStatistics />
                {party?.admin && (
                    <GridItem
                        colSpan={3}
                        mx="auto"
                        w="80%"
                    >
                        <PartyInfo />
                    </GridItem>
                )}
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
