import React from "react";

import { Kbd, Link, Text } from "@chakra-ui/react";
import useParty from "../logic/useParty";

import { Control } from "./ControlPanel";

export default function PartyInfo() {
  const { party } = useParty();

  return (
    <Control
      textAlign="center"
      title={`Estás en la partida ${party.name || "de prode.click"}`}
      body={
        <>
          <Text fontSize="md" fontWeight={500}>
            Podés invitar a más gente pasándoles el código de partida{" "}
            <Kbd>{party.id}</Kbd> o directamente un link a esta página
          </Text>
          <Text fontSize="md" fontWeight={500}>
            Podés crear mas partidas en{" "}
            <Link href="/" color="gray.700">
              la página principal
            </Link>
          </Text>
        </>
      }
    />
  );
}
