import { Flex, IconButton, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import Card from './Card';

export default function Default({ startContent, bottomContent, topContent, name, description, value, ...rest }) {
	const textColor = 'darkgray.900'
	const textColorSecondary = 'darkgray.700';

	return (
		<Card p={2} w='100%' h='100%' justifyContent="space-between" {...rest}>
			{topContent}
			<Flex
				h='100%'
				align="center"
				justify="center"
			>
				{startContent}

				<Stat ms={startContent ? '18px' : '0px'}>
					<StatLabel
						color={textColorSecondary}
						fontSize="sm"
					>
						{name}
					</StatLabel>
					<StatNumber
						color={textColor}
						fontSize="2xl"
					>
						{value}
					</StatNumber>
					<StatHelpText
						color={textColorSecondary}
						fontSize={name ? 'xs' : 'sm'}
						m={0}
					>
						{description}
					</StatHelpText>
				</Stat>
			</Flex>
		</Card>
	);
}
