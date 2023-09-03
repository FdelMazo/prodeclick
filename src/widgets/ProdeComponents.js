import {
  Box,
  Flex,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Spinner,
  Text
} from '@chakra-ui/react'
import React from 'react'

import { MdPlayCircle } from 'react-icons/md'
import useParty from '../logic/useParty'

export const Porcentaje = ({ partido, prode, setProde, isEdit, isLoading }) => {
  const { isParty } = useParty()
  const format = (val) => `${val}%`

  return isEdit ? (
    <NumberInput
      w="10ch"
      m="auto"
      min={0}
      max={100}
      step={0.1}
      precision={1}
      value={format(prode[partido.id] || 0)}
      onChange={(value) => {
        setProde({
          ...prode,
          [partido.id]: parseFloat(value),
        })
      }}
    >
      <NumberInputField
        textAlign="center"
        color={`${partido.color}.600`}
        fontWeight={500}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  ) : (
    <Box color={`${partido.color}.600`} textAlign="center">
      {isLoading || (isParty && !prode) ? <Spinner size="xs" /> : (
        <Text fontWeight='700'>
          {isParty ? prode?.[partido.id] : "??"}%
        </Text>
      )}
    </Box>
  )
}

export const Suma = ({ prode }) => {
  if (!prode) return null
  const suma = React.useMemo(() => {
    const sum = (Object.values(prode).reduce((a, b) => (a || 0) + (b || 0), 0)).toFixed(1)
    const color = sum < 100 ? 'pink' : sum > 100 ? 'red' : 'green'
    return {
      sum,
      color
    }
  }, [prode])

  return (
    <Flex flexDir="column" w="40%" m="auto" my={2} alignItems="center">
      <Progress hasStripe bg="gray.200" colorScheme={suma.color} value={suma.sum} w="100%" h={2} borderRadius={4} />
      <Box>
        <Text as="span" fontWeight={600}>Suma:</Text>
        <Text as="span" fontWeight={600} color={`${suma.color}.600`} ml={1}>{suma.sum}%</Text>
      </Box>
    </Flex>
  )
}

export const Partido = ({ partido, showCandidatos = true, fontSize = "lg", boxSize = 6 }) => {
  return (
    <Flex alignItems="center" gap={2}>
      <Icon as={MdPlayCircle} boxSize={boxSize} color={`${partido.color}.600`} />
      <Box>
        <Text color={'darkgray.900'} fontSize={fontSize} fontWeight='700'>
          {partido.partido}
        </Text>
        {showCandidatos && (
          <Text color="gray" fontSize='sm' fontWeight='700'>
            {partido.candidatos}
          </Text>
        )}
      </Box>
    </Flex>
  )
}

export const validProde = (prode) => {
  return (((Object.values(prode).reduce((a, b) => a + b, 0)).toFixed(1)) == 100.0)
}
