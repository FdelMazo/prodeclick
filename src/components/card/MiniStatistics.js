import { Flex, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import Card from './Card';

export default function Default(props) {
	const { startContent, endContent, name, description, value } = props;
	const textColor = 'secondaryGray.900'
	const textColorSecondary = 'secondaryGray.600';

	return (
		<Card py={3}>
			<Flex
				my='auto'
				h='100%'
				align={{ base: 'center', xl: 'center' }}
				justify={{ base: 'center', xl: 'center' }}
			>
				{startContent}

				<Stat my='auto' ms={startContent ? '18px' : '0px'}>
					<StatLabel
						color={textColorSecondary}
						fontSize={{ base: 'sm' }}
					>
						{name}
					</StatLabel>
					<StatNumber
						color={textColor}
						fontSize={{ base: '2xl' }}
					>
						{value}
					</StatNumber>
					{description && (
						<Flex align='center'>
							<Text color='secondaryGray.600' fontSize='xs' fontWeight='400'>
								{description}
							</Text>
						</Flex>
					)}
				</Stat>
				<Flex ms='auto' w='max-content'>
					{endContent}
				</Flex>
			</Flex>
		</Card>
	);
}
