import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Button,
	Flex,
	FormControl,
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
import { checkUser, createUser, initParty } from '../logic/api';
import PARTIDOS from '../logic/partidos';
import useParty from '../logic/useParty';
import { validProde } from './ProdeComponents';
import ProdeTable from './ProdeTable';

export default function LoginModal({ isOpen, onClose }) {
	const { party, needsAdmin, mutate, login } = useParty()

	const [submitted, setSubmitted] = React.useState(false)
	const [saving, setSaving] = React.useState(false)
	const [partyName, setPartyName] = React.useState('')
	const [error, setError] = React.useState(false)
	const [name, setName] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [showProde, setShowProde] = React.useState(needsAdmin)
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
			<ModalContent m={4} p={4}>
				<ModalHeader>{needsAdmin ?
					<>
						<Text>Bienvenido a prode.click</Text>
						<Text fontSize="md" color="darkgray.900">Creá una partida, invita a todas las personas que quieras!</Text>
						<Text fontSize="sm" color="darkgray.900">Decidan un número entre todos y apuesten el futuro del país!</Text>
					</>
					:
					<>
						<Text>Estás en la partida {party.name}</Text>
						<Text fontSize="md" color="darkgray.900">La partida esta administrada por <b>{party.admin.name}</b></Text>
						<Text fontSize="sm" color="darkgray.900">Después de armar tu prode, no te olvides de darle la plata!</Text>
					</>
				}
				</ModalHeader>
				<ModalBody>
					<Flex flexDir="column" alignItems="center" gap={6}>
						{needsAdmin && (
							<FormControl isInvalid={submitted && !partyName}>
								<FormLabel>Nombre de la partida</FormLabel>
								<Input size="sm" borderRadius="md" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
							</FormControl>
						)}
						<Flex gap={4} w="80%" alignItems="flex-end">
							<FormControl isInvalid={(submitted && !name) || error}>
								<FormLabel m={0}>Tu Nombre</FormLabel>
								<Input size="sm" borderRadius="md" value={name} onChange={(e) => setName(e.target.value)} />
							</FormControl>
							<FormControl isInvalid={(submitted && !password) || error}>
								<FormLabel m={0}>Contraseña</FormLabel>
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
						{!showProde &&
							<Flex flexDir="column" gap={4} alignItems={"center"} >
								<Button
									colorScheme="brand"
									variant="link"
									isLoading={saving}
									size="md"
									onClick={async () => {
										setSubmitted(true)
										if (name && password) {
											setSaving(true)
											const { userId } = await checkUser(party.id, name, password)
											if (!userId) {
												setSaving(false)
												setError(true)
												setSubmitted(false)
												return
											}
											login(userId)
											mutate()
											onClose()
										}
									}}
								>
									iniciar sesión
								</Button>
								<Button
									size="lg"
									colorScheme="brand"
									isDisabled={saving}
									rightIcon={<ChevronDownIcon />}
									onClick={() => {
										setShowProde(true)
									}}
								>
									armar prode
								</Button>
							</Flex>
						}

						{showProde && <>
							<ProdeTable prode={prode} setProde={setProde} isEdit={true} />
							<Button
								colorScheme="brand"
								w="75%"
								m="auto"
								isLoading={saving}
								isDisabled={!validProde(prode)}
								onClick={async () => {
									setSubmitted(true)
									if (needsAdmin && !partyName) return

									if (name && password && validProde(prode)) {
										setSaving(true)
										const { userId } = await createUser(party.id, name, password, prode)
										login(userId)
										if (needsAdmin) {
											await initParty(party.id, partyName, userId)
										}
										mutate()
										onClose()
									}
								}}
							>
								Guardar mi prode
							</Button>
						</>}
					</Flex>
				</ModalBody>
				<ModalFooter w="80%" alignSelf={"flex-end"}>
					{needsAdmin && <Text fontSize="sm" textAlign="right">
						Podes invitar a más gente pasándoles el código de partida <Kbd>{party.id}</Kbd> o directamente un link a esta página
					</Text>}
				</ModalFooter>
			</ModalContent>
		</Modal >
	)
}
