import {
  Box,
  Card,
  CardBody,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MdOutlineCalendarMonth, MdPeopleAlt } from "react-icons/md";
import { daysUntilElections } from "../logic";

const MiniStat = ({
  startContent,
  bottomContent,
  topContent,
  name,
  description,
  value,
}) => {
  const textColor = "darkgray.900";
  const textColorSecondary = "darkgray.700";

  return (
    <Card direction="row" alignItems="center" p={2} gap={4}>
      {startContent}

      <CardBody p={0}>
        <Stat>
          <StatLabel color={textColorSecondary}>{name}</StatLabel>
          <StatNumber color={textColor}>{value}</StatNumber>
          <StatHelpText color={textColorSecondary} fontSize="xs">
            {description}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );
};

export default function Statistics({ stats }) {
  const { parties, users } = stats;
  const days = React.useMemo(daysUntilElections, []);
  const iconBoxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    w: 14,
    h: 14,
    bg: "darkgray.300",
    borderColor: "darkgray.700",
    borderWidth: 1,
  };

  const iconProps = {
    w: 8,
    h: 8,
    color: "brand.500",
  };

  return (
    <>
      <MiniStat
        name="Participantes"
        value={users}
        description={
          parties && (
            <Text>
              En <b>{parties}</b> partidas
            </Text>
          )
        }
        startContent={
          <Box {...iconBoxProps}>
            <Icon {...iconProps} as={MdPeopleAlt} />
          </Box>
        }
      />
      <MiniStat
        name="Días hasta las elecciones"
        value={days}
        description={
          <Text>
            Se pueden cambiar las predicciones hasta el <b>sábado</b>{" "}
            pre-elecciones
          </Text>
        }
        startContent={
          <Box {...iconBoxProps}>
            <Icon {...iconProps} as={MdOutlineCalendarMonth} />
          </Box>
        }
      />
    </>
  );
}
