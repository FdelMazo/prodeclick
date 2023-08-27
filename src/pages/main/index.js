import React from 'react'

import {
  Box,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/react'
import MiProde from '../../views/main/components/MiProde'
import Participants from '../../views/main/components/Participants'
import Statistics from '../../views/main/components/Statistics'
import Results from '../../views/main/components/Results'
import MainLayout from '../../layouts/main'

// TODO: agregar admin panel, o info panel del programa en si?
// TODO: agregar link a github
export default function UserReports() {
  return (
    <MainLayout>
      <Box pt={{ base: '130px', md: '80px' }}>
        {/* TODO: Agregar titulo */}
        {/* TODO: modificar cantidad de columnas en base a cuantas stats terminan siendo */}
        <SimpleGrid
          columns={{ base: 1, md: 2, '2xl': 6 }}
          gap='20px'
          mb='20px'
        >
          <Statistics />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, "md": 4 }} gap='20px' mb='20px'>
          <GridItem colSpan={{ md: 2, "2xl": 3 }}>
            <MiProde />
          </GridItem>
          <GridItem colSpan={{ md: 2, "2xl": 1 }}>
            <Results />
          </GridItem>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1 }} gap='20px' mb='20px'>
          <Participants />
        </SimpleGrid>
      </Box>
    </MainLayout>
  )
}
