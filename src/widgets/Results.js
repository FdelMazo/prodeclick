import { Box, Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import React from "react";
import { ProdeContext } from "../logic/ProdeContext";
import useParty from "../logic/useParty";
import { Diferencia, InlineProde } from "./ProdeComponents";

import dynamic from "next/dist/shared/lib/dynamic";
import PARTIDOS from "../logic/partidos";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      series: props.series,
    };
  }

  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="bar"
      />
    );
  }
}

export default function Results() {
  const { isParty, user, party } = useParty();
  const { simulatedResults } = React.useContext(ProdeContext);

  const [isEdit, setIsEdit] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState("");

  React.useEffect(() => {
    setSelectedUser(user?.id);
  }, [user]);

  const prode = React.useMemo(() => {
    return party?.users?.find((u) => u.id === selectedUser)?.prode;
  }, [selectedUser]);

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
      enabled: !!isParty,
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const series = w.globals.initialSeries[seriesIndex];
        const data = series.data[dataPointIndex];
        const goal = data.goals?.[0];
        const partido = PARTIDOS.find((p) => p.id === data.x);
        const title = `<div
          class="apexcharts-tooltip-title"
          style="font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600;"
        >
          ${partido.partido}
        </div>`;

        const item = (
          name,
          value,
          icon,
          color
        ) => `<div class="apexcharts-tooltip-goals-group" style="display: flex; justify-content: space-between" >

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
      },
    },
  };

  const chartSeries = [
    {
      name: "resultados",
      data: Object.entries(simulatedResults).map(([partidoId, porcentaje]) => {
        const partido = PARTIDOS.find((p) => p.id === partidoId);
        return {
          x: partido.id,
          y: isParty ? porcentaje : Math.random() * 40 + 10,
          fillColor: `var(--chakra-colors-${partido.color}-300)`,
          goals: isParty && [
            {
              name: "tu prode",
              value: prode?.[partidoId],
              strokeColor: "dimgray",
            },
          ],
        };
      }),
    },
  ];

  return (
    <Card h="100%">
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Text color="darkgray.900" fontSize="xl" fontWeight="700">
            {isParty && "Simular "} Resultados
          </Text>
          {!isParty && (
            <Text color="darkgray.800" fontSize="sm" fontWeight="700">
              Se actualizarán en vivo el día de las elecciones
            </Text>
          )}
        </Box>
        {/* {isParty && <IconButton
					borderRadius='lg'
					bg='darkgray.300'
					color='brand.500'
					title={'Simular resultados'}
					// isDisabled={isEdit && !validProde(editProde)}
					icon={<Icon as={MdBarChart} boxSize={5} />}
					onClick={isEdit ? () => {
						// if (!validProde(editProde)) {
						// 	return
						// }
						setIsEdit(false)
					} : () => setIsEdit(true)}
				/>} */}
      </CardHeader>
      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box fontSize="xl">
          {isParty && <InlineProde prode={simulatedResults} />}
          {(!isParty || prode) && (
            <BarChart series={chartSeries} options={chartOptions} />
          )}
        </Box>
        {isParty && prode && (
          <Card p={2} overflowX="scroll" fontSize="xl">
            <Diferencia prode={prode} results={simulatedResults} />
          </Card>
        )}
      </CardBody>
    </Card>
  );
}
