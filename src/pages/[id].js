import { useDisclosure } from "@chakra-ui/react";
import React from "react";

import { GridItem, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { SWRConfig } from "swr";
import MainLayout from "../layouts";
import { getAll, getParty } from "../logic/db";
import useParty from "../logic/useParty";
import { isElectionsDay } from "../logic/utils";
import LoginModal from "../widgets/LoginModal";
import MiProde from "../widgets/MiProde";
import Participants from "../widgets/Participants";
import PartyInfo from "../widgets/PartyInfo";
import Results from "../widgets/Results";
import Statistics from "../widgets/Statistics";

function PartyDashboard() {
  const { savedUsers, party, isLoading } = useParty();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const electionsDay = React.useMemo(isElectionsDay, []);

  React.useEffect(() => {
    if (isLoading) return;
    if (!Object.keys(savedUsers).includes(party.id)) {
      onOpen();
    }
  }, [isLoading, savedUsers]);

  return (
    <MainLayout>
      {party.name && (
        <Head>
          <title>{`prode.click - ${party.name}`}</title>
        </Head>
      )}

      <LoginModal isOpen={isOpen} onClose={onClose} />
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
        <GridItem colSpan={{ base: 1, lg: 4 }} order={electionsDay && "-1"}>
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

  const parties = await getAll("party");
  if (!parties.includes(`party:${partyId}`)) {
    return {
      notFound: true,
    };
  }

  const party = await getParty(partyId);
  const url = `/api/party/${partyId}`;
  return {
    props: {
      fallback: {
        [url]: party,
      },
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const parties = await getAll("party");
  return {
    paths: parties.map((p) => ({ params: { id: p.split(":")[1] } })),
    fallback: "blocking",
  };
}
