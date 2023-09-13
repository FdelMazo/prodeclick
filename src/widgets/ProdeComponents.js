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
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

import { MdPlayCircle } from "react-icons/md";
import { sum } from "../logic";
import PARTIDOS from "../logic/partidos";

export const Porcentaje = ({
  partido,
  prode,
  setProde,
  isEdit,
  isLoading,
  isDummy,
}) => {
  return isEdit ? (
    <NumberInput
      w="10ch"
      m="auto"
      min={0}
      max={100}
      step={0.1}
      precision={1}
      defaultValue={prode?.[partido.id] || 0}
      onChange={(value) => {
        setProde({
          ...prode,
          [partido.id]: parseFloat(value),
        });
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
      {isLoading ? (
        <Spinner size="xs" />
      ) : (
        <Text fontWeight="700">{isDummy ? "??" : prode?.[partido.id]}%</Text>
      )}
    </Box>
  );
};

export const Suma = ({ prode }) => {
  if (!prode) return null;
  const suma = React.useMemo(() => {
    const n = sum(prode);
    const color = n < 100 ? "pink" : n > 100 ? "red" : "green";
    return {
      n,
      color,
    };
  }, [prode]);

  return (
    <Flex flexDir="column" w="50%" m="auto" my={2} alignItems="center">
      <Progress
        hasStripe
        bg="gray.300"
        colorScheme={suma.color}
        value={suma.n}
        w="100%"
        h={3}
        borderRadius={4}
      />
      <Box>
        <Text as="span" fontWeight={600}>
          Suma:
        </Text>
        <Text as="span" fontWeight={600} color={`${suma.color}.600`} ml={1}>
          {suma.n}%
        </Text>
      </Box>
    </Flex>
  );
};

export const Partido = ({ partido }) => {
  return (
    <Flex alignItems="center" gap={3}>
      <Icon as={MdPlayCircle} boxSize={6} color={`${partido.color}.600`} />
      <Box fontWeight="700">
        <Text color="darkgray.900" fontSize="lg">
          {partido.partido}
        </Text>
        <Text color="darkgray.800" fontSize="sm">
          {partido.candidatos}
        </Text>
      </Box>
    </Flex>
  );
};

export const InlineProde = ({ prode }) => {
  return (
    <Flex justifyContent="center" gap={2}>
      {Object.entries(prode).map(([partidoId, porcentaje]) => {
        const partido = PARTIDOS.find((p) => p.id === partidoId);
        return (
          <Tooltip label={partido.partido} key={partidoId}>
            <Text color={`${partido.color}.600`} fontWeight={600}>
              {porcentaje}%
            </Text>
          </Tooltip>
        );
      })}
    </Flex>
  );
};

export const Diferencia = ({ prode, results }) => {
  if (!prode || !results) return null;

  const diferencia = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(prode).map(([partidoId, porcentaje]) => {
        const diff = Math.abs((porcentaje - results[partidoId]).toFixed(1));
        return [partidoId, diff];
      })
    );
  }, [prode, results]);

  return (
    <Stat>
      <StatLabel>Diferencia</StatLabel>
      <StatNumber>
        <Text>{sum(diferencia)} puntos</Text>
      </StatNumber>
      <StatHelpText>Mientras menos diferencia, mejor!</StatHelpText>
    </Stat>
  );
};
