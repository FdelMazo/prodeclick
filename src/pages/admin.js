import React from "react";

import { SimpleGrid } from "@chakra-ui/react";
import MainLayout from "../layouts";
import { getAll, getParty } from "../logic/db";
import Parties from "../widgets/Parties";

export default function AdminDashboard({ parties }) {
  return (
    <MainLayout>
      <SimpleGrid columns={{ base: 1 }} gap={4} w="100%">
        {/* TODO: add lista de prodes aca */}
        <Parties parties={parties} />
      </SimpleGrid>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const env = process.env.NODE_ENV;
  if (env !== "development") {
    return {
      notFound: true,
    };
  }

  // TODO: evitar el 'getParty' para no traer tantos datos que la pagina esta pesada
  const partiesIds = await getAll("party");
  const parties = (
    await Promise.all(partiesIds.map((p) => p.split(":")[1]).map(getParty))
  )
  return {
    props: {
      parties,
    },
  };
}
