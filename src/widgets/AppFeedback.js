import React from "react";

import { Button, Icon, Link, Text, Tooltip } from "@chakra-ui/react";

import { SiGoogleforms } from "react-icons/si";
import { ProdeContext } from "../logic/ProdeContext";
import { Control } from "./ControlPanel";

export default function AppFeedback() {
  const { electionStatus } = React.useContext(ProdeContext);

  if (electionStatus !== "POST") return null;
  return (
    <Control
      w="100%"
      maxWidth="550px"
      textAlign="center"
      title={`¿Y ahora?`}
      body={
        <>
          <Text fontSize="md" fontWeight={500}>
            Guardate el link y nos vemos en unos años para las próximas
            elecciones!
          </Text>

          <Link
            href={`https://docs.google.com/forms/d/e/1FAIpQLSdnOhWlS2au9T4RLs1m2ve-hsGGN_hbomJ2xaFJ0qSNdcYV5Q/viewform?usp=pp_url&entry.1604575804=prode.click`}
            isExternal
          >
            <Button
              colorScheme="purple"
              leftIcon={<Icon as={SiGoogleforms} boxSize={7} />}
              mt={1}
              mb={4}
            >
              Sugerencias
            </Button>
          </Link>

          <Text fontSize="sm" fontWeight={500}>
            Muchas gracias por participar de este experimento. Si te gustó,
            podes revisar mis{" "}
            <Link href="https://fede.dm" isExternal>
              otros proyectos
            </Link>
            , o{" "}
            <Link href="mailto:fede@fede.dm" isExternal>
              <Tooltip label="fede@fede.dm" hasArrow>
                contactarme
              </Tooltip>
            </Link>{" "}
            para que hagamos algo juntos.
          </Text>
        </>
      }
    />
  );
}
