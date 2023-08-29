import { Flex, Input, LinkBox, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import Card from './Card';

export default function Default(props) {
	const { startContent, endContent, title, onClick, description } = props;
	const textColor = 'secondaryGray.900'
	const textColorSecondary = 'secondaryGray.700';

	return (
		<Card py={3} bg="brand.100" borderColor="brand.400" borderWidth={1} h="100%" cursor={onClick && "pointer"} onClick={onClick}>
			<Flex
				my='auto'
				h='100%'
				align={{ base: 'center', xl: 'center' }}
				justify={{ base: 'center', xl: 'center' }}
			>
				{startContent}
				<Stat my='auto' ms={startContent ? '18px' : '0px'}>
					<StatLabel
						color={textColor}
						fontSize={{ base: '2xl' }}
					>
						{title}
					</StatLabel>
					{description && (
						<Flex align='center'>
							<Text color={textColorSecondary} fontSize='sm'>
								{description}
							</Text>
						</Flex>
					)}
					{endContent}
				</Stat>
			</Flex>
		</Card>
	);
}
