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
  StatNumber,
  Text,
  Tooltip,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";

import { MdPlayCircle } from "react-icons/md";
import ELECCIONES_DATA from "../logic/elecciones";
import { diff, sum } from "../logic/utils";

const ELECCIONES = ELECCIONES_DATA.elecciones[ELECCIONES_DATA.current];
const PARTIDOS = ELECCIONES.partidos;

export const Porcentaje = ({
  partido,
  prode,
  setProde,
  isEdit,
  isLoading,
  isDummy,
  fontWeight = 700,
  tooltip,
}) => {
  return isEdit ? (
    <NumberInput
      minW="7ch"
      maxW="10ch"
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
      onKeyDown={(e) => {
        // Replace the comma for a dot
        if (e.code === "Comma") {
          e.preventDefault();
          const ch = e.target.selectionStart;
          e.target.value =
            e.target.value.slice(0, ch) + "." + e.target.value.slice(ch);
          e.target.selectionStart = ch + 1;
          e.target.selectionEnd = ch + 1;
        }
      }}
    >
      <Tooltip label={tooltip}>
        <NumberInputField
          textAlign="center"
          color={`${partido.color}.600`}
          fontWeight={500}
        />
      </Tooltip>
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  ) : (
    <Tooltip label={tooltip}>
      <Box color={`${partido.color}.600`} textAlign="center">
        {isLoading ? (
          <Spinner size="xs" />
        ) : (
          <Text fontWeight={fontWeight}>
            {isDummy ? "??" : prode?.[partido.id].toFixed(1)}%
          </Text>
        )}
      </Box>
    </Tooltip>
  );
};

export const Suma = ({ prode, progressHeight = 3 }) => {
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
    <>
      <Progress
        hasStripe
        bg="gray.300"
        colorScheme={suma.color}
        value={suma.n}
        w="100%"
        h={progressHeight}
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
    </>
  );
};

export const Partido = ({ partido }) => {
  return (
    <Flex alignItems="center" gap={3}>
      <Icon as={MdPlayCircle} boxSize={6} color={`${partido.color}.600`} />
      <Box fontWeight={700}>
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

export const InlineProde = ({ prode, setProde, isEdit, ...rest }) => {
  if (!prode) return null;
  return PARTIDOS.map((partido) => {
    return (
      <WrapItem key={partido.id} justifyContent="center" {...rest}>
        <Porcentaje
          partido={partido}
          prode={prode}
          isEdit={isEdit}
          setProde={setProde}
          fontWeight={600}
          tooltip={partido.partido}
        />
      </WrapItem>
    );
  });
};

export const Diferencia = ({ prode, results }) => {
  if (!prode || !results) return null;

  const diferencia = React.useMemo(() => {
    return diff(prode, results);
  }, [prode, results]);

  return (
    <Stat>
      <StatNumber fontSize="xl">
        <Text>Diferencia: {sum(diferencia)} puntos</Text>
      </StatNumber>
      <StatHelpText>Mientras menos diferencia, mejor</StatHelpText>
    </Stat>
  );
};
