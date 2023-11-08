import React from "react";

import { ArrowRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
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

const SelectParties = ({ savedParties, setLoading }) => {
  const savedPartiesByElections = savedParties.reduce(
    (acc, party) => ({
      ...acc,
      [party.electionsId]: [...(acc[party.electionsId] || []), party],
    }),
    {}
  );

  const elections = Object.keys(savedPartiesByElections).sort((a, b) => {
    return ELECCIONES_DATA.order.indexOf(a) - ELECCIONES_DATA.order.indexOf(b);
  });

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon color="black" />}
        variant="ghost"
        borderBottomWidth={1}
        borderBottomRadius={0}
        borderColor="darkgray.800"
        color="gray.600"
        fontWeight={400}
        px={2}
      >
        Seleccionar partida
      </MenuButton>
      <MenuList>
        {elections.map((electionsId) => (
          <MenuGroup
            key={electionsId}
            color="gray.800"
            title={
              ELECCIONES_DATA.elecciones[electionsId]?.flag +
              " " +
              ELECCIONES_DATA.elecciones[electionsId]?.title
            }
          >
            {savedPartiesByElections[electionsId].map((p) => (
              <NextLink href={`/${p.id}`} key={p.id}>
                <MenuItem
                  value={p.id}
                  color="gray.600"
                  onClick={(e) => {
                    setLoading("existing");
                  }}
                >
                  {p.name}
                </MenuItem>
              </NextLink>
            ))}
            {elections.indexOf(electionsId) < elections.length - 1 && (
              <MenuDivider />
            )}
          </MenuGroup>
        ))}
      </MenuList>
    </Menu>
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
      {!!savedParties?.length && (
        <Control
          title="Tus partidas"
          _hover={{
            bg: "brand.50",
            transition: "all 0.2s ease-in-out",
          }}
          body={
            <SelectParties
              savedParties={savedParties}
              setLoading={setLoading}
            />
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
