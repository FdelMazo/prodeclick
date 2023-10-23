import { useDisclosure } from "@chakra-ui/react";
import React from "react";

import { GridItem, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { SWRConfig } from "swr";
import MainLayout from "../layouts";
import { exists, getKeys, getParty } from "../logic/db";
import useParty from "../logic/useParty";
import LoginModal from "../widgets/LoginModal";
import MiProde from "../widgets/MiProde";
import Participants from "../widgets/Participants";
import PartyInfo from "../widgets/PartyInfo";
import Results from "../widgets/Results";
import Statistics from "../widgets/Statistics";

function PartyDashboard() {
  const { party } = useParty();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <MainLayout>
      {party.name && (
        <Head>
          <title>{`prode.click · ${party.name}`}</title>
        </Head>
      )}

      <LoginModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      <SimpleGrid columns={{ base: 2 }} gap={4}>
        <Statistics stats={{ users: party.users.length }} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1 }} gap={4}>
        <PartyInfo />
      </SimpleGrid>

      <SimpleGrid w="100%" columns={{ base: 1, lg: 4 }} gap={4}>
        <GridItem colSpan={{ lg: 2, "2xl": 3 }}>
          <MiProde />
        </GridItem>
        <GridItem colSpan={{ lg: 2, "2xl": 1 }}>
          <Results />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 4 }}>
          <Participants onOpen={onOpen} />
        </GridItem>
      </SimpleGrid>
    </MainLayout>
  );
}

export default function Index({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <PartyDashboard />
    </SWRConfig>
  );
}

export async function getStaticProps({ params }) {
  const partyId = params.id;

  if (!(await exists(`party:${partyId}`))) {
    return {
      notFound: true,
    };
  }

  const party = await getParty(partyId, true);
  const url = `/api/party/${partyId}`;
  return {
    props: {
      fallback: {
        [url]: party,
      },
    },
  };
}

export async function getStaticPaths() {
  const parties = await getKeys("party");
  return {
    paths: parties.map((p) => ({ params: { id: p.split(":")[1] } })),
    fallback: "blocking",
  };
}
