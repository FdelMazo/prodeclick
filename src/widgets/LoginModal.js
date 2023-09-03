import {
	Button,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Kbd,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text
} from '@chakra-ui/react';
import React from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { createUser } from '../logic/api';
import PARTIDOS from '../logic/partidos';
import ProdeTable from './ProdeTable';
import useParty from '../logic/useParty';
import { validProde } from './ProdeComponents';

export default function LoginModal({ isOpen, onClose }) {
	const { party, user, isLoading, mutate, login, isLogged } = useParty()

	const [submitted, setSubmitted] = React.useState(false)
	const [name, setName] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [showPassword, setShowPassword] = React.useState(false)
	const [prode, setProde] = React.useState(
		Object.fromEntries(PARTIDOS.map(p => [p.id, p.defaultPercentage]))
	)

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="2xl"
			closeOnOverlayClick={false}
			closeOnEsc={false}
		>
			<ModalOverlay />
			<ModalContent mx={4} my={4} p={4}>
				<ModalHeader>Bienvenido a prode.ar</ModalHeader>
				<ModalBody>
					<Flex flexDir="column" alignItems="center" gap={6}>
						<Flex gap={4} w="80%" alignItems="flex-end">
							<FormControl isRequired isInvalid={submitted && !name}>
								<FormLabel>Nombre</FormLabel>
								<Input size="sm" borderRadius="md" value={name} onChange={(e) => setName(e.target.value)} />
							</FormControl>
							<FormControl isRequired isInvalid={submitted && !password}>
								<FormLabel m={0}>Palabra clave</FormLabel>
								<FormHelperText m={0}>Para editar tu prode más adelante</FormHelperText>
								<InputGroup justifyContent="center" size="sm">
									<Input
										value={password} onChange={(e) => setPassword(e.target.value)}
										borderRadius="md"
										type={showPassword ? 'text' : 'password'}
									/>
									<InputRightElement>
										<IconButton
											h="fit-content"
											variant="link"
											_hover={{ color: "darkgray.900" }}
											onClick={() => setShowPassword(!showPassword)}
											icon={<Icon as={showPassword ? IoMdEyeOff : IoMdEye} />}
										/>
									</InputRightElement>
								</InputGroup>
							</FormControl>
						</Flex>
						<ProdeTable prode={prode} setProde={setProde} isEdit={true} />
						<Button
							colorScheme="brand"
							w="75%"
							m="auto"
							isDisabled={!validProde(prode)}
							onClick={async () => {
								setSubmitted(true)
								if (name && password && validProde(prode)) {
									const { userId } = await createUser(party.id, name, password, prode)
									login(userId)
									mutate()
									onClose()
								}
							}}
						>
							Guardar mi prode
						</Button>
					</Flex>
				</ModalBody>
				<ModalFooter w="80%" alignSelf={"flex-end"}>
					{!isLoading && <Text fontSize="sm" textAlign="right">
						Podes invitar a más gente pasandoles el código de partida <Kbd>{party.id}</Kbd> o directamente un link a esta página
					</Text>}
				</ModalFooter>
			</ModalContent>
		</Modal >
	)
}
