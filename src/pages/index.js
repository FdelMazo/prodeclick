import React from 'react'

import {
  GridItem,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import MainLayout from '../layouts'
import { getN } from '../logic/db'
import Control from '../widgets/Control'
import MiProde from '../widgets/MiProde'
import Results from '../widgets/Results'
import Statistics from '../widgets/Statistics'

/*
TODO: FUTURO
- Agregar prode de participacion electoral
- Permitir que las partidas sean configurables
  - Participacion si/no
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

export default function MainDashboard({ stats }) {
  const router = useRouter()
  const toast = useToast()
  const toastId = 'error'
  React.useEffect(() => {
    if (router.query.error && !toast.isActive(toastId)) {
      toast({
        description: "La partida que buscas no existe, creá una nueva!",
        status: "error",
        isClosable: true,
        position: 'top-end',
        id: toastId
      })
    }
    router.replace('/', undefined, { shallow: true })
  }, [router.query.error])

  return (
    <MainLayout>
      <SimpleGrid
        columns={{ base: 1, lg: 3 }}
        gap='20px'
        mb='20px'
      >
        <Statistics stats={stats} />
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        gap='20px'
        mb='20px'
        mx="auto"
        w="80%"
      >
        <Control />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 4 }} gap='20px' mb='20px'>
        <GridItem colSpan={{ md: 2, "2xl": 3 }}>
          <MiProde />
        </GridItem>
        <GridItem colSpan={{ md: 2, "2xl": 1 }}>
          <Results />
        </GridItem>
      </SimpleGrid>
    </MainLayout>
  )
}

export async function getStaticProps() {
  const stats = {
    parties: await getN('party'),
    users: await getN('user'),
  }

  return {
    props: {
      stats
    }
  }
}
