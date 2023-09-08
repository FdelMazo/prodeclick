import React from 'react'

import {
  Kbd,
  Text
} from '@chakra-ui/react'
import MiniStatistics from '../components/MiniStatistics'
import useParty from '../logic/useParty'


export default function PartyInfo() {
  const { party, isAdmin } = useParty()

  const miniStatisticsProps = {
    bg: 'brand.100',
    borderColor: 'brand.400',
    borderWidth: 1
  }

  return (<>
    <MiniStatistics
      textAlign="center"
      value={`Estás en la partida ${party.name || 'de prode.click'}`}
      description={
        <>
          <Text fontSize="sm" fontWeight={500}>
            Podes invitar a más gente pasándoles el código de partida <Kbd>{party.id}</Kbd> o directamente un link a esta página
          </Text>
        </>}
      height="fit-content"
      {...miniStatisticsProps}
    />
  </>)
}
