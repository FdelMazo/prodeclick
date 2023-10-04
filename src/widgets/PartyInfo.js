import React from "react";

import { Button, Icon, Kbd, Link, Text } from "@chakra-ui/react";
import useParty from "../logic/useParty";

import { MdWhatsapp } from "react-icons/md";
import { Control } from "./ControlPanel";

export default function PartyInfo() {
  const { party } = useParty();

  const link = `https://prode.click/${party.id}`;

  return (
    <Control
      textAlign="center"
      title={`Estás en la partida ${party.name || "de prode.click"}`}
      body={
        <>
          <Link
            href={`https://wa.me/?text=Sumate a la partida ${
              party.name || ""
            } de prodeclick: ${link}`}
            isExternal
          >
            <Button
              colorScheme="whatsapp"
              leftIcon={<Icon as={MdWhatsapp} boxSize={7} />}
              my={1}
            >
              Invitá a más personas
            </Button>
          </Link>

          <Text fontSize="md" fontWeight={500}>
            Podés pasarles el código de partida{" "}
            <Kbd fontSize="md">{party.id}</Kbd> o directamente un link a esta
            página
          </Text>
          <Text fontSize="md" fontWeight={500}>
            Creá más partidas en{" "}
            <Link href="/" color="gray.700">
              la página principal
            </Link>
          </Text>
        </>
      }
    />
  );
}
