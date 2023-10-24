import React from "react";

import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdLibraryAdd, MdPeopleAlt, MdPersonSearch } from "react-icons/md";
import { ProdeContext } from "../logic/ProdeContext";
import { getParty } from "../logic/api";
import ELECCIONES_DATA from "../logic/elecciones";

export const Control = ({ startContent, body, title, ...rest }) => {
  return (
    <Card
      bg="brand.100"
      borderColor="brand.400"
      borderWidth={1}
      direction="row"
      alignItems="center"
      gap={4}
      p={2}
      w="400px"
      {...rest}
    >
      {startContent}
      <CardBody p={0}>
        <Text fontSize="2xl" fontWeight={600}>
          {title}
        </Text>
        <Box color="darkgray.800" fontSize="sm">
          {body}
        </Box>
      </CardBody>
    </Card>
  );
};

export default function ControlPanel({ onOpenCreateParty }) {
  const router = useRouter();
  const { electionStatus, savedParties } = React.useContext(ProdeContext);

  const [loading, setLoading] = React.useState("");
  const [joinError, setJoinError] = React.useState(false);

  const iconBoxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    w: 14,
    h: 14,
    bg: "darkgray.300",
    borderColor: "darkgray.700",
    borderWidth: 1,
  };

  const iconProps = {
    w: 8,
    h: 8,
    color: "brand.500",
  };

  return (
    <>
      {electionStatus === "PRE" && (
        <Control
          title="Creá una partida"
          body="Jugá con tus amigos, con gente del trabajo, con quien quieras!"
          cursor="pointer"
          onClick={onOpenCreateParty}
          _hover={{
            bg: "brand.50",
            transition: "all 0.2s ease-in-out",
          }}
          startContent={
            <Box {...iconBoxProps}>
              <Icon {...iconProps} as={MdLibraryAdd} />
            </Box>
          }
        />
      )}
      {!!savedParties.filter((p) => p.electionsId === ELECCIONES_DATA.current)
        .length && (
        <Control
          title="Tus partidas"
          _hover={{
            bg: "brand.50",
            transition: "all 0.2s ease-in-out",
          }}
          body={
            <Box ml={1}>
              <Select
                w="20ch"
                borderColor="darkgray.800"
                variant="flushed"
                placeholder="Seleccionar partida"
                color="darkgray.900"
                onChange={(e) => {
                  setLoading("existing");
                  router.push(`/${e.target.value}`);
                }}
              >
                {savedParties
                  .filter((p) => p.electionsId === ELECCIONES_DATA.current)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </Select>
            </Box>
          }
          startContent={
            <Box {...iconBoxProps}>
              <Icon
                {...iconProps}
                as={loading === "existing" ? Spinner : MdPeopleAlt}
              />
            </Box>
          }
        />
      )}
      <Control
        title="Sumate a una partida"
        _hover={{
          bg: "brand.50",
          transition: "all 0.2s ease-in-out",
        }}
        body={
          <Box ml={1}>
            <Text color={joinError && "red.400"}>
              {joinError
                ? "La partida no existe"
                : "Pedile el código a quien la armó!"}
            </Text>
            <form
              onSubmit={async (t) => {
                t.preventDefault();
                const partyId = t.target.partyId.value.trim();
                if (!partyId) return;
                const { error } = await getParty(partyId);
                if (error) {
                  setJoinError(true);
                  return;
                }

                setLoading("join");
                router.push(`/${partyId}`);
              }}
            >
              <InputGroup w="20ch">
                <Input
                  name="partyId"
                  borderColor="darkgray.800"
                  variant="flushed"
                  placeholder="Código"
                  color="darkgray.900"
                  _placeholder={{
                    opacity: 0.9,
                    color: "darkgray.700",
                    textTransform: "none",
                  }}
                  css={{
                    textTransform: "uppercase",
                  }}
                />
                <InputRightElement>
                  <IconButton
                    type="submit"
                    h="fit-content"
                    variant="link"
                    color="darkgray.900"
                    icon={<ArrowRightIcon boxSize={3} />}
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </Box>
        }
        startContent={
          <Box {...iconBoxProps}>
            <Icon
              {...iconProps}
              as={loading === "join" ? Spinner : MdPersonSearch}
            />
          </Box>
        }
      />
    </>
  );
}
