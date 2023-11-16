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
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { ProdeContext } from "../logic/ProdeContext";
import { checkUser, createUser } from "../logic/api";
import useParty from "../logic/useParty";
import { validProde } from "../logic/utils";
import ProdeTable from "./ProdeTable";

export default function LoginModal({ isOpen, onClose, onOpen }) {
  const { ELECCIONES, electionStatus, login, isLogged, savedParties } =
    React.useContext(ProdeContext);
  const { party, mutate, isLoading } = useParty();

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [formStatus, setFormStatus] = React.useState("");
  const [showProde, setShowProde] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [prode, setProde] = React.useState(
    Object.fromEntries(
      ELECCIONES.partidos.map((p) => [p.id, p.defaultPercentage])
    )
  );

  React.useEffect(() => {
    if (isLoading || !savedParties) return;
    if (!isLogged) {
      onOpen();
    }
  }, [isLoading, isLogged, savedParties]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
      onCloseComplete={() => {
        setName("");
        setPassword("");
        setFormStatus("");
        setShowProde(false);
        setShowPassword(false);
        setProde(
          Object.fromEntries(
            ELECCIONES.partidos.map((p) => [p.id, p.defaultPercentage])
          )
        );
        mutate();
      }}
    >
      <ModalOverlay />
      <ModalContent m={4} p={4}>
        <ModalHeader>
          <Text>Estás en la partida {party.name}</Text>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={(e) => e.preventDefault()}>
            <VStack spacing={6}>
              <VStack w="100%">
                <Flex gap={4} w="80%">
                  <FormControl isInvalid={formStatus == "error"}>
                    <FormLabel m={0}>Tu Nombre</FormLabel>
                    <Input
                      size="sm"
                      borderRadius="md"
                      isReadOnly={formStatus == "filled"}
                      variant={formStatus == "filled" ? "filled" : "outline"}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl isInvalid={formStatus == "error"}>
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
                          icon={
                            <Icon as={showPassword ? IoMdEyeOff : IoMdEye} />
                          }
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
                {formStatus == "no-new-users" && (
                  <Text color="red.400">
                    No se pueden sumar nuevas personas{" "}
                    {electionStatus === "DAY"
                      ? "tan cerca de las elecciones!"
                      : "después de las elecciones!"}
                  </Text>
                )}
              </VStack>

              {showProde ? (
                <>
                  <Accordion allowToggle={true}>
                    <AccordionItem border="none" mx={8}>
                      <AccordionButton p={0}>
                        <Text
                          color="darkgray.900"
                          fontSize="sm"
                          fontWeight={700}
                        >
                          Gana el que tenga menor diferencia absoluta entre
                          todas sus predicciones y los resultados reales
                        </Text>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel p={0} textAlign="center">
                        <Text
                          color="darkgray.800"
                          fontSize="sm"
                          fontWeight={700}
                        >
                          Frente a un candidato que saca 20%, tanto el que
                          predijo 15% como el que predijo 25% está a 5 puntos de
                          diferencia
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                  <ProdeTable prode={prode} setProde={setProde} isEdit={true} />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    w="75%"
                    isLoading={formStatus == "loading"}
                    isDisabled={!validProde(prode)}
                    onClick={async () => {
                      setFormStatus("loading");
                      const { userId } = await createUser({
                        partyId: party.id,
                        name,
                        password,
                        prode,
                      });

                      login(userId);
                      onClose();
                    }}
                  >
                    Guardar mi prode
                  </Button>
                </>
              ) : (
                <Flex align="center" flexDir="column" gap={2}>
                  <Text color="darkgray.800" fontSize="sm" fontWeight={600}>
                    si ya armaste tu prode, usá el mismo nombre y contraseña!
                  </Text>
                  <Button
                    type="submit"
                    size="lg"
                    colorScheme="brand"
                    isLoading={formStatus == "loading"}
                    isDisabled={!name.trim() || !password}
                    onClick={async () => {
                      setFormStatus("loading");
                      const { create, wrongPassword, userId } = await checkUser(
                        party.id,
                        name,
                        password
                      );

                      if (create) {
                        if (
                          electionStatus === "DAY" ||
                          electionStatus === "POST"
                        ) {
                          setFormStatus("no-new-users");
                        } else {
                          setShowProde(true);
                          setFormStatus("filled");
                        }
                      } else if (wrongPassword) {
                        setFormStatus("error");
                      } else if (userId) {
                        login(userId);
                      }

                      if (userId) {
                        onClose();
                      }
                    }}
                  >
                    continuar
                  </Button>
                  <Button color="brand.500" variant="link" onClick={onClose}>
                    solo quiero ver
                  </Button>
                </Flex>
              )}
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
