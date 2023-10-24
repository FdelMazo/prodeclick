import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { ProdeContext } from "../logic/ProdeContext";
import useParty from "../logic/useParty";
import { Diferencia, InlineProde, Suma } from "./ProdeComponents";

import dynamic from "next/dist/shared/lib/dynamic";
import useResults from "../logic/useResults";
import { rankUsers } from "../logic/utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Results() {
  const { isParty, party } = useParty();
  const { realResults, declareWinners } = useResults();
  const { ELECCIONES, user } = React.useContext(ProdeContext);

  const [simulatedResults, setSimulatedResults] = React.useState(
    Object.fromEntries(
      ELECCIONES.partidos.map((p) => [p.id, p.defaultPercentage])
    )
  );

  const results = React.useMemo(() => {
    return realResults ? realResults : simulatedResults;
  }, [realResults, simulatedResults]);

  const [selectedUserId, setSelectedUserId] = React.useState("");
  React.useEffect(() => {
    setSelectedUserId(user?.id || party?.users[0]?.id);
  }, [party, user]);

  const { users, winners } = React.useMemo(() => {
    return rankUsers(party?.users, results, declareWinners);
  }, [party, results, declareWinners]);

  const selectedUser = React.useMemo(() => {
    return users?.find((u) => u.id === selectedUserId);
  }, [users, selectedUserId]);

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "darken",
          value: 0.85,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + "%";
        },
      },
      forceNiceScale: true,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: isParty || realResults,
      custom: isParty
        ? function ({ seriesIndex, dataPointIndex, w }) {
            const series = w.globals.initialSeries[seriesIndex];
            const data = series.data[dataPointIndex];
            const goal = data.goals?.[0];
            const partido = ELECCIONES.partidos.find((p) => p.id === data.x);
            const title = `<div
              class="apexcharts-tooltip-title"
              style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; min-width: 200px"
            >
              ${partido.partido}
            </div>`;

            const item = (
              name,
              value,
              icon,
              color
            ) => `<div class="apexcharts-tooltip-goals-group" style="display: flex; justify-content: space-between">
              <div class="apexcharts-tooltip-text-goals-label">
                <span
                  class="apexcharts-tooltip-marker"
                  style="color: ${color}; line-height: 0.9; font-size: 18px"
                >${icon}</span>
                <span>${name}</span>
              </div>
              <div class="apexcharts-tooltip-text-goals-value">
                <div>${value}</div>
              </div>
            </div>`;

            const result = item(
              series.name,
              `${data.y.toFixed(1)}%`,
              "▬",
              data.fillColor
            );
            const prode = item(
              goal.name,
              `${goal.value.toFixed(1)}%`,
              "▭",
              goal.strokeColor
            );
            const dif = item(
              "diferencia",
              `${Math.abs(goal.value - data.y).toFixed(1)} pts`,
              goal.value == data.y ? "✔" : goal.value < data.y ? "▼" : "▲",
              "lightsalmon"
            );

            const body = `<div
              class="apexcharts-tooltip-series-group apexcharts-active"
              style="order: 1; display: flex;"
            >
              <div
                class="apexcharts-tooltip-text"
                style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; width: 100%;"
              >
                ${result + prode + dif}
              </div>
            </div>`;

            return title + body;
          }
        : undefined,
    },
  };

  const chartSeries = [
    {
      name: "resultados",
      data: ELECCIONES.partidos.map((partido) => {
        return {
          x: partido.id,
          y:
            isParty || realResults
              ? results[partido.id]
              : Math.random() * 40 + 10,
          fillColor: `var(--chakra-colors-${partido.color}-300)`,
          goals: isParty && [
            {
              name: `prode de ${selectedUser?.name}`,
              value: selectedUser?.prode?.[partido.id],
              strokeColor: "dimgray",
            },
          ],
        };
      }),
    },
  ];

  return (
    <Card h="100%" p={4}>
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Box>
          <Text color="darkgray.900" fontSize="xl" fontWeight={700}>
            {isParty && !realResults && "Simular"} Resultados
          </Text>
          {!isParty && !realResults && (
            <Text color="darkgray.800" fontSize="sm" fontWeight={700}>
              Se actualizarán en vivo el día de las elecciones
            </Text>
          )}
        </Box>
        {isParty && (
          <Flex alignItems="center" gap={1}>
            <Tooltip
              label={`con estos resultados ${selectedUser?.name} saldría ${
                winners.includes(selectedUserId)
                  ? "ganador/a"
                  : `#${users.indexOf(selectedUser) + 1}`
              }`}
            >
              {winners.includes(selectedUserId) ? (
                "🏆"
              ) : (
                <Badge colorScheme="green" fontSize="sm">
                  #{users.indexOf(selectedUser) + 1}
                </Badge>
              )}
            </Tooltip>
            <Select
              w="fit-content"
              maxW="12ch"
              color="brand.500"
              bg="darkgray.300"
              borderRadius="lg"
              size="sm"
              borderWidth={0}
              textOverflow="ellipsis"
              textAlign="center"
              fontWeight={600}
              _hover={{ bg: "brand.100" }}
              onChange={(e) => setSelectedUserId(e.target.value)}
              value={selectedUserId}
            >
              {users.map((us) => {
                const user = users.find((u) => u.id === us.id);
                return (
                  <option value={user.id} key={user.id}>
                    {user.name}
                  </option>
                );
              })}
            </Select>
          </Flex>
        )}
      </CardHeader>
      <CardBody display="flex" flexDirection="column" justifyContent="center">
        <Box fontSize="xl">
          {(isParty || realResults) && (
            <Flex flexWrap="wrap" justifyContent="space-around" gap={1}>
              <InlineProde
                prode={results}
                setProde={!realResults && setSimulatedResults}
                isEdit={!realResults}
                w={!realResults ? "7ch" : "fit-content"}
              />
            </Flex>
          )}
          {isParty && !realResults && (
            <Flex
              flexDir="column"
              w="100%"
              alignItems="flex-end"
              fontSize="sm"
              my={1}
            >
              <Suma prode={results} progressHeight={0} />
            </Flex>
          )}
          {(!isParty || selectedUser?.prode) && (
            <Chart series={chartSeries} options={chartOptions} type="bar" />
          )}
        </Box>

        {isParty && selectedUser?.prode && (
          <Card variant="outline">
            <CardBody p={2}>
              <Diferencia prode={selectedUser?.prode} results={results} />
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
}
