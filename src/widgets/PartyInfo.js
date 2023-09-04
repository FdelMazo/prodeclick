import React from 'react'

import {
  Kbd,
  Text
} from '@chakra-ui/react'
import MiniStatistics from '../components/card/MiniStatistics'
import { daysUntilElections } from '../logic'
import useParty from '../logic/useParty'


export default function PartyInfo() {
  const { party, user, partyId, isAdmin, isLoading, mutate, login, isLogged } = useParty()

  const miniStatisticsProps = {
    bg: 'brand.100',
    borderColor: 'brand.400',
    borderWidth: 1
  }

  return (<>
    <MiniStatistics
      textAlign="center"
      value={`Estás en la partida ${party.name}`}
      description={
        <>
          <Text fontSize="md" fontWeight={500}>
            La partida esta administrada por <b>{isAdmin ? "vos" : party.admin.name}</b>. {isAdmin ? "Pedile al resto de los participantes que te den la plata antes de las elecciones!" : "Si todavía no le diste la plata, hacelo ya!"}
          </Text>
          <Text fontSize="sm" fontWeight={500}>
            Podes invitar a más gente pasándoles el código de partida <Kbd>{partyId}</Kbd> o directamente un link a esta página
          </Text>
        </>}
      height="fit-content"
      {...miniStatisticsProps}
    />
  </>)
}
