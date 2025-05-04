import React from "react";

import { Button, Icon, Kbd, Link, Text } from "@chakra-ui/react";
import useParty from "../logic/useParty";

import { MdWhatsapp } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { Control } from "./ControlPanel";
import { ProdeContext } from "../logic/ProdeContext";

export default function PartyInfo() {
  const { party } = useParty();

  const link = `https://prodeclick.vercel.app/${party.id}`;

  const { electionStatus } = React.useContext(ProdeContext);

  return electionStatus === "POST" ? (
    <></>
    // <Control
    //   w="100%"
    //   textAlign="center"
    //   title={`¿Qué te pareció?`}
    //   body={
    //     <>
    //       <Link
    //         href={`https://docs.google.com/forms/d/e/1FAIpQLSdnOhWlS2au9T4RLs1m2ve-hsGGN_hbomJ2xaFJ0qSNdcYV5Q/viewform?usp=pp_url&entry.1604575804=prode.click`}
    //         isExternal
    //       >
    //         <Button
    //           colorScheme="brand"
    //           leftIcon={<Icon as={SiGoogleforms} boxSize={7} />}
    //           my={1}
    //         >
    //           Feedback
    //         </Button>
    //       </Link>

    //       <Text fontSize="md" fontWeight={500}>
    //         Si tenés alguna sugerencia, me encantaría escucharla!
    //       </Text>
    //     </>
    //   }
    // />
  ) : (
    <Control
      w="100%"
      textAlign="center"
      title={`Estás en la partida ${party.name || "de prode-click"}`}
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
