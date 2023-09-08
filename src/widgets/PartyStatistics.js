import React from 'react'

import { CheckIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Icon,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react'
import {
  MdAttachMoney,
  MdOutlineCalendarMonth,
  MdPeopleAlt
} from 'react-icons/md'
import MiniStatistics from '../components/MiniStatistics'
import { daysUntilElections } from '../logic'
import useParty from '../logic/useParty'

export default function Statistics() {
  const { party, mutate, isAdmin } = useParty()

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
    {days > 0 && (
      <MiniStatistics
        name='Días hasta las elecciones'
        value={days}
        description={<span>Se pueden cambiar las predicciones hasta el <b>sábado</b> pre-elecciones</span>}
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
      value={party.users.length}
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
