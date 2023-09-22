import React from "react";

import { GridItem, SimpleGrid, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import MainLayout from "../layouts";
import { getAll, getN, getParty } from "../logic/db";
import useParty from "../logic/useParty";
import ControlPanel from "../widgets/ControlPanel";
import MiProde from "../widgets/MiProde";
import Results from "../widgets/Results";
import Statistics from "../widgets/Statistics";

/*
TODO: FUTURO
- Hacer que funcione para mas de una eleccion
  (ej: PASO, ballotage, legislativas), sin perder los datos anteriores!
- Usar party.electionsId en varios lugares en vez de defaultear a "current"
- Poner un dropdown en el header para elegir la eleccion
- Subir como proyecto a fede.dm
- Agregar prode de participacion electoral/
  votos en blanco/ otras estadisticas que no influyen en el main prode
  y hacerlo configurable por partida
- Permitir que las partidas sean configurables
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
- Encontrar alternativa gratarola a vercel/kv
*/

export default function MainDashboard({ stats, partyNames }) {
  const { hasParties } = useParty();
  const router = useRouter();
  const toast = useToast();
  const toastId = "error";
  React.useEffect(() => {
    if (router.query.error && !toast.isActive(toastId)) {
      toast({
        description: "La partida que buscas no existe, creá una nueva!",
        status: "error",
        isClosable: true,
        position: "top-end",
        id: toastId,
      });
    }
    router.replace("/", undefined, { shallow: true });
  }, [router.query.error]);

  return (
    <MainLayout>
      <SimpleGrid columns={{ base: 2 }} gap={4}>
        <Statistics stats={stats} />
      </SimpleGrid>

      <SimpleGrid
        columns={{
          base: 1,
          lg: hasParties ? 3 : 2,
        }}
        gap={4}
      >
        <ControlPanel partyNames={partyNames} />
      </SimpleGrid>

      <SimpleGrid w="100%" columns={{ base: 1, lg: 4 }} gap={4}>
        <GridItem colSpan={{ lg: 2, "2xl": 3 }}>
          <MiProde />
        </GridItem>
        <GridItem colSpan={{ lg: 2, "2xl": 1 }}>
          <Results />
        </GridItem>
      </SimpleGrid>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const parties = await Promise.all(
    (await getAll("party")).map((p) => getParty(p.split(":")[1]))
  );
  const partyNames = Object.fromEntries(parties.map((p) => [p.id, p.name]));

  const stats = {
    parties: parties.length,
    users: await getN("user"),
  };

  return {
    props: {
      stats,
      partyNames,
    },
  };
}
