import { Box, Flex, Heading, Image, Link, VStack } from "@chakra-ui/react";
import { ProdeProvider } from "../logic/ProdeContext";

const FooterLink = ({ link, text, left }) => {
  return (
    <Link href={link} isExternal display="flex" alignItems="center">
      {left}
      <Heading color="gray.600" fontSize="md" ml={2}>
        {text}
      </Heading>
    </Link>
  );
};

function MainLayout(props) {
  const { children } = props;
  return (
    <Box p={6} minH="99vh">
      <Heading>prode.click</Heading>
      <Heading color="gray.600" fontSize="xl">
        Elecciones Generales 2023 🇦🇷
      </Heading>

      <VStack spacing={6} py={6}>
        {children}
      </VStack>

      <Flex position="absolute" bottom={1} gap={4} alignItems="center">
        {/* <FooterLink
          text="source code"
          link="https://github.com/fdelmazo/prode"
          left={<Icon boxSize={6} as={BsGithub} />}
        />
        • */}
        <FooterLink
          text="fede.dm"
          link="https://fede.dm"
          left={<Image src="img/deadmona.png" boxSize={7} display={"inline"} />}
        />
      </Flex>
    </Box>
  );
}

export default function Layout(props) {
  return (
    <ProdeProvider>
      <MainLayout {...props} />
    </ProdeProvider>
  );
}
