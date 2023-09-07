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
import MiniStatistics from '../components/card/MiniStatistics'
import { daysUntilElections } from '../logic'
import { updatePartyBounty } from '../logic/api'
import useParty from '../logic/useParty'

const BountyInput = ({ editBounty, setEditBounty }) => {
  const format = (value) => `$${value}`
  return (<NumberInput
    w="10ch"
    min={0}
    value={format(editBounty || 0)}
    onChange={(value) => {
      setEditBounty(value)
    }}
  >
    <NumberInputField
      fontWeight={500}
    />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>)
}

export default function Statistics() {
  const { party, mutate, isAdmin } = useParty()

  const [isEditBounty, setisEditBounty] = React.useState(false)
  const [editBounty, setEditBounty] = React.useState(party?.bounty || 1000)

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
      value={isEditBounty ? <BountyInput editBounty={editBounty} setEditBounty={setEditBounty} /> : "$" + (party.bounty * party.users.length)}
      topContent={isAdmin && (
        <IconButton
          borderRadius='lg'
          bg='darkgray.300'
          color='brand.500'
          position="absolute"
          right={2}
          size="sm"
          title={'Editar apuesta por participante'}
          icon={<Icon as={isEditBounty ? CheckIcon : EditIcon} boxSize={4} />}
          onClick={isEditBounty ? async () => {
            await updatePartyBounty(party.id, editBounty)
            mutate()
            setisEditBounty(false)
          } : () => setisEditBounty(true)}
        />
      )
      }
    />
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
      description={<span><b>${party.bounty}</b> por persona</span>}
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
