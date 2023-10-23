import React from "react";

import { SimpleGrid } from "@chakra-ui/react";
import MainLayout from "../layouts";
import { getKeys, getParty } from "../logic/db";
import Parties from "../widgets/Parties";

export default function AdminDashboard({ parties }) {
  return (
    <MainLayout>
      <SimpleGrid columns={{ base: 1 }} gap={4} w="100%">
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

  const partiesIds = await getKeys("party");
  const parties = (
    await Promise.all(partiesIds.map((p) => p.split(":")[1]).map(getParty))
  ).map((p) => ({
    id: p.id,
    name: p.name,
    creation: p.creation,
    electionsId: p.electionsId,
    nusers: p.users.length,
  }));

  return {
    props: {
      parties,
    },
  };
}
