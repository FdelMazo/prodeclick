import React from "react";

import { GridItem, SimpleGrid } from "@chakra-ui/react";
import MainLayout from "../layouts";
import { getAll, getN } from "../logic/db";
import ControlPanel from "../widgets/ControlPanel";
import MiProde from "../widgets/MiProde";
import Results from "../widgets/Results";
import Statistics from "../widgets/Statistics";

/*
TODO: FUTURO
- Agregar prode de participacion electoral
- Permitir que las partidas sean configurables
  - Participacion si/no
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

export default function MainDashboard({ stats, partyIds }) {
  return (
    <MainLayout>
      <SimpleGrid w="100%" columns={{ base: 1, lg: 3 }} gap={4}>
        <Statistics stats={stats} />
      </SimpleGrid>

      <SimpleGrid w="80%" columns={{ base: 1, lg: 2 }} gap={4}>
        <ControlPanel partyIds={partyIds} />
      </SimpleGrid>

      <SimpleGrid w="100%" columns={{ base: 1, md: 4 }} gap={4}>
        <GridItem colSpan={{ md: 2, "2xl": 3 }}>
          <MiProde />
        </GridItem>
        <GridItem colSpan={{ md: 2, "2xl": 1 }}>
          <Results />
        </GridItem>
      </SimpleGrid>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const partyIds = await getAll("party").then((parties) =>
    parties.map((id) => id.split(":")[1])
  );
  const stats = {
    parties: partyIds.length,
    users: await getN("user"),
  };

  return {
    props: {
      stats,
      partyIds,
    },
  };
}
