import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BsGithub } from "react-icons/bs";
import { ProdeContext, ProdeProvider } from "../logic/ProdeContext";

const FooterLink = ({ link, text, left, title }) => {
  return (
    <Tooltip label={title} placement="top" hasArrow={true}>
      <Link
        href={link}
        isExternal
        display="flex"
        alignItems="center"
        _hover={{ textTransform: "none" }}
      >
        {left}
        <Heading color="gray.600" fontSize="md" ml={2}>
          {text}
        </Heading>
      </Link>
    </Tooltip>
  );
};

function MainLayout({ children }) {
  const { ELECCIONES } = React.useContext(ProdeContext);
  return (
    <>
      <Box p={6} minH="99vh">
        <Link href="/" _hover={{ textTransform: "none" }}>
          <Heading>prode.click</Heading>
        </Link>
        <Heading color="gray.600" fontSize="xl">
          {ELECCIONES.title} {ELECCIONES.flag}
        </Heading>

        <VStack spacing={6} py={6}>
          {children}
        </VStack>
      </Box>

      <Flex
        position="absolute"
        bottom={0}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        px={2}
      >
        <Flex gap={4} alignItems="center">
          <FooterLink
            text="source code"
            link="https://github.com/fdelmazo/prode"
            left={<Icon boxSize={6} as={BsGithub} />}
          />
          •
          <FooterLink
            text="fede.dm"
            link="https://fede.dm"
            left={
              <Image src="img/deadmona.png" boxSize={7} display={"inline"} />
            }
          />
        </Flex>
        <FooterLink
          text=""
          title="invitame un cafecito"
          link="https://cafecito.app/fdelmazo"
          left={<Image src="img/cafecito.png" boxSize={9} display={"inline"} />}
        />
      </Flex>
    </>
  );
}

export default function Layout(props) {
  return (
    <ProdeProvider>
      <MainLayout {...props} />
    </ProdeProvider>
  );
}
