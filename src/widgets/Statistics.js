import React from 'react'

import {
  Box,
  Icon
} from '@chakra-ui/react'
import {
  MdAttachMoney,
  MdOutlineCalendarMonth,
  MdPeopleAlt
} from 'react-icons/md'
import MiniStatistics from '../components/card/MiniStatistics'
import { daysUntilElections } from '../logic'

export default function Statistics({ stats }) {
  const days = React.useMemo(daysUntilElections, [])
  const iconBoxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: '50%',
    w: '56px',
    h: '56px',
    bg: 'darkgray.300',
    borderColor: 'darkgray.700',
    borderWidth: 1,
  }

  const iconProps = {
    w: '32px',
    h: '32px',
    color: 'brand.500',
  }

  return (<>
    <MiniStatistics
      name='Armá tu partida y apostá con tus amigos'
      value="$1000 por participante"
      startContent={
        <Box {...iconBoxProps}>
          <Icon
            {...iconProps}
            as={MdAttachMoney}
          />
        </Box>
      }
    />
    {days > 0 && (
      <MiniStatistics
        name='Días hasta las elecciones'
        value={days}
        description={<span>Se pueden cambiar las predicciones hasta el <b>viernes</b> pre-elecciones</span>}
        startContent={
          <Box {...iconBoxProps}>
            <Icon
              {...iconProps}
              as={MdOutlineCalendarMonth}
            />
          </Box>
        }
      />
    )}
    <MiniStatistics
      name='Participantes'
      value={stats.users}
      description={<span>En <b>{stats.parties}</b> partidas</span>}
      startContent={
        <Box {...iconBoxProps}>
          <Icon
            {...iconProps}
            as={MdPeopleAlt}
          />
        </Box>
      }
    />
  </>)
}
