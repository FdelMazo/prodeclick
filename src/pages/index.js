import React from "react";

import {
  GridItem,
  SimpleGrid,
  Wrap,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import MainLayout from "../layouts";
import { getKeys, getParty } from "../logic/db";
import ControlPanel from "../widgets/ControlPanel";
import CreatePartyModal from "../widgets/CreatePartyModal";
import MiProde from "../widgets/MiProde";
import Results from "../widgets/Results";
import Statistics from "../widgets/Statistics";

/*
TODO: FUTURO
- Guardarse en el localstorage el ultimo prode que armo alguien, para que despues
  sea el default en la proxima partida que arma
- Agregar prode de participacion electoral/
  votos en blanco/ otras estadisticas que no influyen en el main prode
  y hacerlo configurable por partida
- Permitir que las partidas sean configurables
  - Agrupar partidos minoristas en otros si/no
  - Ocultar/mostrar los prodes del resto
*/

export default function MainDashboard({ stats }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <CreatePartyModal isOpen={isOpen} onClose={onClose} />

      <SimpleGrid columns={{ base: 2 }} gap={4}>
        <Statistics stats={stats} />
      </SimpleGrid>

      <Wrap justify="center" spacing={4}>
        <ControlPanel onOpenCreateParty={onOpen} />
      </Wrap>

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
    (await getKeys("party")).map((p) => getParty(p.split(":")[1]))
  );

  const stats = {
    parties: parties.length,
    users: parties.flatMap((p) => p.users).length,
  };

  return {
    props: {
      stats,
    },
    revalidate: 300,
  };
}
