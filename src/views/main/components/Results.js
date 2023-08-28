import { Box, Flex, Text, Select, Icon, SimpleGrid } from '@chakra-ui/react';
import Card from '../../../components/card/Card'
import PieChart from '../../../components/charts/PieChart'
import PARTIDOS from '../../../logic/partidos'
import { MdPlayCircle } from 'react-icons/md';

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
		colors: PARTIDOS.map(p => `var(--chakra-colors-${p.color}-400)`),
	},
	tooltip: {
		enabled: true,
		theme: "light",
		y: {
			formatter: function (val) {
				return val + "%";
			},
		}
	}
};

const pieChartData = PARTIDOS.map(p => p.percentage);

// TODO: dividr en dos tabs: "resultados | mis predicciones"
// TODO: overridear en hover de cada participante
export default function Results() {
	const textColor = 'secondaryGray.900'
	const cardColor = 'white'
	const cardShadow = '0px 18px 40px rgba(112, 144, 176, 0.12)'
	return (
		<Card p={4} alignItems='center' w='100%' h='100%' justifyContent="space-between">
			<Flex w="100%" justifyContent="space-between" alignItems="center">
				<Text
					px={2}
					color={textColor}
					fontSize="lg"
					fontWeight='700'
				>
					Mís Predicciones
				</Text>
				{/* <Select fontSize='sm' variant='subtle' defaultValue='monthly' width='unset' fontWeight='700'>
					<option value='daily'>Daily</option>
					<option value='monthly'>Monthly</option>
					<option value='yearly'>Yearly</option>
				</Select> */}
			</Flex>
			<PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
			<Card bg={cardColor} boxShadow={cardShadow} p={2} overflowX="scroll">
				<SimpleGrid columns={{ base: 2, "3xl": 3 }} spacing={5}>
					{PARTIDOS.map((p) => (
						<Flex alignItems="center" justifyContent="space-between" gap={2} key={p.id}>
							<Flex alignItems="center" gap={2}>
								<Icon as={MdPlayCircle} boxSize={5} color={`${p.color}.600`} />
								<Text color={textColor} fontWeight='700' lineHeight='100%'>
									{p.partido}
								</Text>
							</Flex>
							<Text color={`${p.color}.600`} fontWeight='700'>
								{p.percentage}%
							</Text>
						</Flex>
					))}
				</SimpleGrid>
			</Card>
		</Card>
	);
}
