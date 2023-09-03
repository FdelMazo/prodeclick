import { Flex, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import Card from '../components/card/Card';
import PieChart from '../components/charts/PieChart';
import PARTIDOS from '../logic/partidos';
import { Partido } from './ProdeComponents';

export default function Results({ prode }) {
	const pieChartOptions = {
		labels: PARTIDOS.map(p => p.partido),
		colors: PARTIDOS.map(p => `var(--chakra-colors-${p.color}-200)`),
		states: {
			hover: {
				filter: {
					type: "none",
				},
			},
			active: {
				filter: {
					type: "none",
				}
			}
		},
		legend: {
			show: false,
		},
		dataLabels: {
			enabled: false,
		},
		hover: { mode: null },
		fill: {
			opacity: 1,
			colors: PARTIDOS.map(p => `var(--chakra-colors-${p.color}-400)`),
		},
		tooltip: {
			enabled: !!prode,
			theme: "light",
			y: {
				formatter: function (val) {
					return val + "%";
				},
			}
		}
	};

	const pieChartData = PARTIDOS.map(p =>
		prode?.[p.id] || p.defaultPercentage
	)

	const textColor = 'darkgray.900'
	const cardColor = 'white'
	const cardShadow = '0px 18px 40px rgba(112, 144, 176, 0.12)'
	return (
		<Card p={4} alignItems='center' w='100%' h='100%' justifyContent="space-between">
			<Flex w="100%" justifyContent="space-between" alignItems="center">
				<Text
					px={2}
					color={textColor}
					fontSize="xl"
					fontWeight='700'
				>
					Resultados
				</Text>
			</Flex>
			<PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
			<Card bg={cardColor} boxShadow={cardShadow} p={2} overflowX="scroll">
				<SimpleGrid columns={{ base: 2, "xl": 3, "2xl": 2, "3xl": 3 }} spacing={5}>
					{PARTIDOS.map((p) => (
						<Flex alignItems="center" justifyContent="space-between" gap={2} key={p.id} w="100%">
							<Partido partido={p} showCandidatos={false} fontSize='md' boxSize={5} />
							<Text color={`${p.color}.600`} fontWeight='700'>
								{prode?.[p.id] || "??"}%
							</Text>
						</Flex>
					))}
				</SimpleGrid>
			</Card>
		</Card>
	);
}
