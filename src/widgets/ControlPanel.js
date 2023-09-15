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
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdLibraryAdd, MdPeopleAlt } from "react-icons/md";
import { createParty } from "../logic/api";

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

export default function ControlPanel({ partyIds }) {
  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [loadingJoin, setLoadingJoin] = React.useState(false);
  const [joinError, setJoinError] = React.useState(false);
  const router = useRouter();

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
      <Control
        title="Creá una partida"
        body="Jugá con tus amigos, familia, o con quien quieras!"
        cursor="pointer"
        onClick={async () => {
          setLoadingCreate(true);
          await createParty().then(({ partyId }) => {
            router.push(`/${partyId}`);
          });
        }}
        _hover={{
          bg: "brand.50",
          transition: "all 0.2s ease-in-out",
        }}
        startContent={
          <Box {...iconBoxProps}>
            <Icon {...iconProps} as={loadingCreate ? Spinner : MdLibraryAdd} />
          </Box>
        }
      />
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
              onSubmit={(t) => {
                t.preventDefault();
                const partyId = t.target.partyId.value.trim();
                if (!partyId) return;
                if (!partyIds.includes(partyId)) {
                  setJoinError(true);
                  return;
                }

                setLoadingJoin(true);
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
            <Icon {...iconProps} as={loadingJoin ? Spinner : MdPeopleAlt} />
          </Box>
        }
      />
    </>
  );
}
