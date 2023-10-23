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
import { checkUser, createUser, updateParty } from "../logic/api";
import useParty from "../logic/useParty";
import { validProde } from "../logic/utils";
import ProdeTable from "./ProdeTable";

// TODO: desdoblar modal en una de crear partida y uno de armar tu prode
// asi el boton de "crear partida" no tarda mucho, y es simplemente abrir el modal,
// y recien el de continuar es el que tarda

export default function LoginModal({ isOpen, onClose }) {
  const { ELECCIONES, electionStatus } = React.useContext(ProdeContext);
  const { party, needsAdmin, mutate, login } = useParty();

  const [partyName, setPartyName] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [formStatus, setFormStatus] = React.useState("");
  const [showProde, setShowProde] = React.useState(needsAdmin);
  const [showPassword, setShowPassword] = React.useState(false);
  // TODO: Guardarse en el localstorage el ultimo prode que armo alguien, para que despues
  // sea el default en la proxima partida que armas
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
      onCloseComplete={() => {
        setPartyName("");
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
          <form onSubmit={(e) => e.preventDefault()}>
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
                      ? "el día de las elecciones!"
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
                      setFormStatus("submitted");
                      if (
                        !name.trim() ||
                        !password ||
                        (needsAdmin && !partyName.trim())
                      )
                        return;

                      setFormStatus("loading");
                      const { userId } = await createUser({
                        partyId: party.id,
                        name,
                        password,
                        prode,
                      });

                      login(userId);
                      if (needsAdmin) {
                        await updateParty(party.id, {
                          name: partyName,
                          admin: userId,
                        });
                      }
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
