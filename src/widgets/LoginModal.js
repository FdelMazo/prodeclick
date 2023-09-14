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
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { validProde } from "../logic";
import { checkUser, createUser, initParty } from "../logic/api";
import PARTIDOS from "../logic/partidos";
import useParty from "../logic/useParty";
import ProdeTable from "./ProdeTable";

export default function LoginModal({ isOpen, onClose }) {
  const { party, needsAdmin, mutate, login } = useParty();

  const [partyName, setPartyName] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [formStatus, setFormStatus] = React.useState("");
  const [showProde, setShowProde] = React.useState(needsAdmin);
  const [showPassword, setShowPassword] = React.useState(false);
  const [prode, setProde] = React.useState(
    Object.fromEntries(PARTIDOS.map((p) => [p.id, p.defaultPercentage]))
  );

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
        <ModalHeader>
          {needsAdmin ? (
            <>
              <Text>Bienvenido a prode.click</Text>
              <Text fontSize="md" color="darkgray.800">
                Creá una partida, invita a todas las personas que quieras!
              </Text>
            </>
          ) : (
            <>
              <Text>Estás en la partida {party.name}</Text>
            </>
          )}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            {needsAdmin && (
              <FormControl
                isInvalid={formStatus == "submitted" && !partyName.trim()}
              >
                <FormLabel>Nombre de la partida</FormLabel>
                <Input
                  size="sm"
                  borderRadius="md"
                  onChange={(e) => setPartyName(e.target.value)}
                />
              </FormControl>
            )}
            <VStack w="100%">
              <Flex gap={4} w="80%">
                <FormControl
                  isInvalid={
                    (formStatus == "submitted" && !name.trim()) ||
                    formStatus == "error"
                  }
                >
                  <FormLabel m={0}>Tu Nombre</FormLabel>
                  <Input
                    size="sm"
                    borderRadius="md"
                    isReadOnly={formStatus == "filled"}
                    variant={formStatus == "filled" ? "filled" : "outline"}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl
                  isInvalid={
                    (formStatus == "submitted" && !password) ||
                    formStatus == "error"
                  }
                >
                  <FormLabel m={0}>Contraseña</FormLabel>
                  <InputGroup justifyContent="center" size="sm">
                    <Input
                      size="sm"
                      borderRadius="md"
                      isReadOnly={formStatus == "filled"}
                      variant={formStatus == "filled" ? "filled" : "outline"}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
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
              {formStatus == "error" && (
                <Text color="red.400">
                  El nombre ya esta en uso o la contraseña es incorrecta
                </Text>
              )}
            </VStack>

            {showProde ? (
              <>
                <ProdeTable prode={prode} setProde={setProde} isEdit={true} />
                <Button
                  colorScheme="brand"
                  w="75%"
                  isLoading={formStatus == "loading"}
                  isDisabled={!validProde(prode)}
                  onClick={async () => {
                    setFormStatus("submitted");
                    if (
                      !name.trim() ||
                      !password ||
                      (needsAdmin && !partyName.trim())
                    )
                      return;

                    setFormStatus("loading");
                    const { userId } = await createUser(
                      party.id,
                      name,
                      password,
                      prode
                    );

                    login(userId);
                    if (needsAdmin) {
                      await initParty(party.id, partyName, userId);
                    }
                    mutate();
                    setFormStatus("");
                    onClose();
                  }}
                >
                  Guardar mi prode
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                colorScheme="brand"
                isLoading={formStatus == "loading"}
                onClick={async () => {
                  setFormStatus("submitted");
                  if (!name || !password) return;

                  setFormStatus("loading");
                  const { create, wrongPassword, userId } = await checkUser(
                    party.id,
                    name,
                    password
                  );

                  if (create) {
                    setShowProde(true);
                    setFormStatus("filled");
                  } else if (wrongPassword) {
                    setFormStatus("error");
                  } else if (userId) {
                    login(userId);
                    mutate();
                    setFormStatus("");
                  }

                  if (userId) {
                    onClose();
                  }
                }}
              >
                continuar
              </Button>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter w="80%" alignSelf="flex-end">
          {needsAdmin && (
            <Text fontSize="sm" textAlign="right">
              Podés invitar a más gente pasándoles el código de partida{" "}
              <Kbd>{party.id}</Kbd> o directamente un link a esta página
            </Text>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
