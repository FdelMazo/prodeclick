import React from 'react'

import {
    Box,
    Flex,
    GridItem,
    Heading,
    Icon,
    Image,
    Link,
    SimpleGrid,
} from '@chakra-ui/react'
import MiProde from '../../views/main/components/MiProde'
import Participants from '../../views/main/components/Participants'
import PartyStatistics from '../../views/main/components/PartyStatistics'
import Results from '../../views/main/components/Results'
import MainLayout from '../../layouts/main'
import { fetchParticipants } from '../../logic/db'
import { BsGithub } from 'react-icons/bs'

/*
TODO: FUTURO
- Agregar prode de participacion electoral
- Permitir que las partidas sean configurables
  - Participacion si/no
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

// TODO: agregar admin panel, o info panel del programa en si?
export default function MainDashboard() {
    const [participants, setParticipants] = React.useState([]);
    React.useEffect(() => {
        fetchParticipants(setParticipants);
    }, []);

    const miProde = React.useMemo(() => {
        return participants.find(p => p.uuid === 'me')?.prode
    }, [participants])
    return (
        <MainLayout>
            <Heading>prode.ar - aaa</Heading>
            <Heading color="gray.600" fontSize="xl">Elecciones Generales 2023 🇦🇷</Heading>

            <Box pt={6}>
                {/* TODO: modificar cantidad de columnas en base a cuantas stats terminan siendo */}
                <SimpleGrid
                    columns={{ base: 1, md: 2, '2xl': 6 }}
                    gap='20px'
                    mb='20px'
                >
                    <PartyStatistics participants={participants} />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, "md": 4 }} gap='20px' mb='20px'>
                    <GridItem colSpan={{ md: 2, "2xl": 3 }}>
                        <MiProde prode={miProde} />
                    </GridItem>
                    <GridItem colSpan={{ md: 2, "2xl": 1 }}>
                        <Results prode={miProde} title="Mi Prode" />
                    </GridItem>
                </SimpleGrid>
                <SimpleGrid columns={{ base: 1 }} gap='20px' mb='20px'>
                    <Participants />
                </SimpleGrid>
            </Box>

            <Flex position="absolute" bottom={0} gap={4} alignItems="center">
                <Link href='https://fede.dm' isExternal _hover={{ textDecoration: 'underline' }}>
                    <Flex alignItems="center">
                        <Box boxSize={7}>
                            <Image src="img/deadmona.png" display={"inline"} />
                        </Box>
                        <Heading color="gray.600" fontSize="md" ml={2}>fede.dm</Heading>
                    </Flex>
                </Link>
                •
                <Link href='https://github.com/fdelmazo/prode' isExternal _hover={{ textDecoration: 'underline' }}>
                    <Flex alignItems="center">
                        <Icon boxSize={6} as={BsGithub} />
                        <Heading color="gray.600" fontSize="md" ml={2}>fdelmazo</Heading>
                    </Flex>
                </Link>
            </Flex>
        </MainLayout>
    )
}
