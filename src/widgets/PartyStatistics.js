import React from 'react'

import {
  Box,
  Icon,
  Spinner
} from '@chakra-ui/react'
import {
  MdAttachMoney,
  MdOutlineCalendarMonth,
  MdPeopleAlt
} from 'react-icons/md'
import MiniStatistics from '../components/card/MiniStatistics'
import { daysUntilElections } from '../logic'


export default function Statistics({ party, isLoading }) {
  const brandColor = 'brand.500'
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
      startContent={
        <Box {...iconBoxProps}>
          <Icon
            {...iconProps}
            as={MdAttachMoney}
          />
        </Box>
      }
      name='El ganador se lleva...'
      value={isLoading ? <Spinner size="sm" /> : "$" + (party.bounty * party.users.length)}
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
      value={isLoading ? <Spinner size="sm" /> : party.users.length}
      description={isLoading ? <br /> : <span><b>{party.bounty}</b> por persona</span>}
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
