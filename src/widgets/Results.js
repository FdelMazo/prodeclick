import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ProdeContext } from "../logic/ProdeContext";
import PARTIDOS from "../logic/partidos";
import useParty from "../logic/useParty";
import { Diferencia, InlineProde, Partido } from "./ProdeComponents";

import dynamic from "next/dist/shared/lib/dynamic";
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

export default function Results(props) {
  const { isParty, user } = useParty();
  const { prode } = props;

  const [isEdit, setIsEdit] = React.useState(false);
  const { simulatedResults } = React.useContext(ProdeContext);
  const chartOptions = {
    // labels: PARTIDOS.map((p) => p.partido),
    // colors: PARTIDOS.map((p) => `var(--chakra-colors-${p.color}-200)`),
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + "%";
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },

    // hover: { mode: null },
    // fill: {
    // opacity: 1,
    // colors: PARTIDOS.map((p) => `var(--chakra-colors-${p.color}-400)`),
    // },
    // tooltip: {
    // enabled: !!prode,
    // theme: "light",
    // y: {
    // formatter: function (val) {
    // return val + "%";
    // },
    // },
    // },
  };

  const chartSeries = [
    {
      data: [
        {
          x: "Category A",
          y: 54,
          goals: [
            {
              name: "Expected",
              value: 10,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "Category B",
          y: 12,
          fillColor: "#EB8C87",
          strokeColor: "#C23829",
        },
        {
          x: "category C",
          y: 13,
        },
      ],
    },
  ];

  //   Object.fromEntries(
  //   PARTIDOS.map((p) => [p.id, prode?.[p.id] || p.defaultPercentage])
  // );

  const textColor = "darkgray.900";
  const cardColor = "white";
  const cardShadow = "0px 18px 40px rgba(112, 144, 176, 0.12)";
  return (
    <Card h="100%">
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="darkgray.900" fontSize="xl" fontWeight="700">
          {isParty && "Simular "} Resultados
        </Text>
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
        {JSON.stringify(props)}
        <Box fontSize="xl">
          <BarChart series={chartSeries} options={chartOptions} />
          {isParty && <InlineProde prode={simulatedResults} />}
        </Box>
        {isParty && (
          <Card
            bg={cardColor}
            boxShadow={cardShadow}
            p={2}
            overflowX="scroll"
            fontSize="xl"
          >
            <Diferencia prode={user?.prode} results={simulatedResults} />
          </Card>
        )}
      </CardBody>
    </Card>
  );
}
