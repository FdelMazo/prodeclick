import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ProdeContext } from "../logic/ProdeContext";
import { createParty, createUser, updateParty } from "../logic/api";
import { validProde } from "../logic/utils";
import ProdeTable from "./ProdeTable";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const { ELECCIONES, login } = React.useContext(ProdeContext);

  const [partyName, setPartyName] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [prode, setProde] = React.useState(
    Object.fromEntries(
      ELECCIONES.partidos.map((p) => [p.id, p.defaultPercentage])
    )
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
          <Text>Bienvenido a prode.click</Text>
          <Text fontSize="md" color="darkgray.800">
            Creá una partida, invita a todas las personas que quieras!
          </Text>
        </ModalHeader>
        {!loading && <ModalCloseButton />}
        <ModalBody>
          <form onSubmit={(e) => e.preventDefault()}>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>Nombre de la partida</FormLabel>
                <Input
                  size="sm"
                  borderRadius="md"
                  onChange={(e) => setPartyName(e.target.value)}
                />
              </FormControl>
              <VStack w="100%">
                <Flex gap={4} w="80%">
                  <FormControl>
                    <FormLabel m={0}>Tu Nombre</FormLabel>
                    <Input
                      size="sm"
                      borderRadius="md"
                      variant="outline"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel m={0}>Contraseña</FormLabel>
                    <InputGroup justifyContent="center" size="sm">
                      <Input
                        size="sm"
                        borderRadius="md"
                        variant="outline"
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                      />
                      <InputRightElement>
                        <IconButton
                          h="fit-content"
                          variant="link"
                          _hover={{ color: "darkgray.900" }}
                          onClick={() => setShowPassword(!showPassword)}
                          icon={
                            <Icon as={showPassword ? IoMdEyeOff : IoMdEye} />
                          }
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Flex>
              </VStack>

              <Accordion allowToggle={true}>
                <AccordionItem border="none" mx={8}>
                  <AccordionButton p={0}>
                    <Text color="darkgray.900" fontSize="sm" fontWeight={700}>
                      Gana el que tenga menor diferencia absoluta entre todas
                      sus predicciones y los resultados reales
                    </Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel p={0} textAlign="center">
                    <Text color="darkgray.800" fontSize="sm" fontWeight={700}>
                      Frente a un candidato que saca 20%, tanto el que predijo
                      15% como el que predijo 25% está a 5 puntos de diferencia
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <ProdeTable prode={prode} setProde={setProde} isEdit={true} />
              <Button
                type="submit"
                colorScheme="brand"
                w="75%"
                isLoading={loading}
                isDisabled={
                  !validProde(prode) ||
                  !partyName.trim() ||
                  !name.trim() ||
                  !password
                }
                onClick={async () => {
                  setLoading(true);

                  const { partyId } = await createParty();
                  const { userId } = await createUser({
                    partyId,
                    name,
                    password,
                    prode,
                  });
                  await updateParty(partyId, {
                    name: partyName,
                    admin: userId,
                  });

                  login(userId, partyId);
                  await router.push(`/${partyId}`);
                }}
              >
                Crear partida
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
