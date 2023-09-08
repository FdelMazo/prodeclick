import {
	Box,
	Flex,
	SimpleGrid,
	Text,
	Card,
	CardBody
} from '@chakra-ui/react';
import React from 'react';
import PieChart from '../components/PieChart';
import { ProdeContext } from '../logic/ProdeContext';
import PARTIDOS from '../logic/partidos';
import useParty from '../logic/useParty';
import { Diferencia, InlineProde, Partido } from './ProdeComponents';

export default function Results({ prode }) {
	const { isParty, user } = useParty()
	const [isEdit, setIsEdit] = React.useState(false)
	const { simulatedResults } = React.useContext(ProdeContext)
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
		<Card>
			<CardBody p={4} alignItems='center' w='100%' h='100%' justifyContent="space-between">
			<Flex w="100%" justifyContent="space-between" alignItems="center">
				<Text
					px={2}
					color={textColor}
					fontSize="xl"
					fontWeight='700'
				>
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
			</Flex>

			<Box fontSize="xl">
				<PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
				{isParty && <InlineProde prode={simulatedResults} />}
			</Box>
			{isParty ? (
				<Card bg={cardColor} boxShadow={cardShadow} p={2} overflowX="scroll" fontSize="xl">
					<Diferencia prode={user?.prode} results={simulatedResults} />
				</Card>
			) : <>
				<SimpleGrid columns={{ base: 1, md: 2, "xl": 3, "2xl": 2, "3xl": 3 }} spacing={5}>
					{PARTIDOS.map((p) => (
						<Flex alignItems="center" justifyContent="space-between" gap={2} key={p.id} w="100%">
							<Partido partido={p} showCandidatos={false} fontSize='md' boxSize={5} />
							<Text color={`${p.color}.600`} fontWeight='700'>
								{prode?.[p.id] || "??"}%
							</Text>
						</Flex>
					))}
				</SimpleGrid>
			</>
			}
			</CardBody>
		</Card>
	);
}
