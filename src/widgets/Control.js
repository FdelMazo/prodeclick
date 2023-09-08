import React from 'react'

import { ArrowRightIcon } from '@chakra-ui/icons'
import {
  Box, Icon, IconButton, Input, InputGroup, InputRightElement, Spinner, Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  MdLibraryAdd,
  MdPeopleAlt
} from 'react-icons/md'
import MiniStatistics from '../components/MiniStatistics'
import { createParty } from '../logic/api'

export default function Control() {
  const [loadingCreate, setLoadingCreate] = React.useState(false)
  const [loadingJoin, setLoadingJoin] = React.useState(false)
  const router = useRouter()

  const iconBoxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: '50%',
    w: '56px',
    h: '56px',
    bg: 'darkgray.300',
    borderColor: 'darkgray.700',
    borderWidth: 1,
  }

  const iconProps = {
    w: '32px',
    h: '32px',
    color: 'brand.500',
  }

  const miniStatisticsProps = {
    bg: 'brand.100',
    borderColor: 'brand.400',
    borderWidth: 1
  }

  return (<>
    <MiniStatistics
      value="Creá una partida"
      description="Jugá con tus amigos, familia, o con quien quieras!"
      cursor="pointer"
      onClick={async () => {
        setLoadingCreate(true)
        await createParty().then(({ partyId }) => {
          router.push(`/${partyId}`)
        })
      }}
      startContent={
        <Box {...iconBoxProps}>
          <Icon
            {...iconProps}
            as={loadingCreate ? Spinner : MdLibraryAdd}
          />
        </Box>
      }
      {...miniStatisticsProps}
    />
    <MiniStatistics
      value="Sumate a una partida"
      description={
        <Box ml={1}>
          <Text>
            Pedile el código a quien la armó!
          </Text>
          <form onSubmit={(t) => {
            t.preventDefault()
            const partyId = t.target.partyId.value
            if (!partyId) return
            setLoadingJoin(true)
            router.push(`/${partyId}`)
          }}>
            <InputGroup w="20ch">
              <Input
                name="partyId"
                borderColor="darkgray.800"
                variant="flushed"
                placeholder="Código"
                color="darkgray.900"
                _placeholder={{ opacity: 0.9, color: 'darkgray.700' }}
              />
              <InputRightElement>
                <IconButton
                  type="submit"
                  h="fit-content"
                  variant="link"
                  color="darkgray.900"
                  icon={<ArrowRightIcon boxSize={3} />}
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>
      }
      startContent={
        <Box {...iconBoxProps}>
          <Icon
            {...iconProps}
            as={loadingJoin ? Spinner : MdPeopleAlt}
          />
        </Box>
      }
      {...miniStatisticsProps}
    />
  </>)
}
