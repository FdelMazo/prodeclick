import { Box, Flex, Heading, Icon, Image, Link } from '@chakra-ui/react'
import { BsGithub } from 'react-icons/bs'

const FooterLink = ({ link, text, left }) => {
  return (
    <Link href={link} isExternal _hover={{ textDecoration: 'underline' }}>
      <Flex alignItems="center">
        {left}
        <Heading color="gray.600" fontSize="md" ml={2}>{text}</Heading>
      </Flex>
    </Link>
  )
}

export default function Layout(props) {
  const { children } = props
  return (
    <Box
      transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
      transitionDuration='.2s, .2s, .35s'
      transitionProperty='top, bottom, width'
      transitionTimingFunction='linear, linear, ease'
      p={{ base: '20px', md: '30px' }}
      minH='99vh'
    >
      <Heading>prode.click</Heading>
      <Heading color="gray.600" fontSize="xl">Elecciones Generales 2023 🇦🇷</Heading>

      <Box py={6}>
        {children}
      </Box>

      <Flex position="absolute" bottom={1} gap={4} alignItems="center">
        <FooterLink text="source code" link="https://github.com/fdelmazo/prode" left={<Icon boxSize={6} as={BsGithub} />} />
        •
        <FooterLink text="fede.dm" link="https://fede.dm" left={<Image src="img/deadmona.png" boxSize={7} display={"inline"} />} />
      </Flex>
    </Box>
  )
}
