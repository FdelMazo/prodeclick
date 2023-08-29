import React from 'react'

import { useRouter } from 'next/router'
import {
  Icon, Input, Spinner, Text,
} from '@chakra-ui/react'
import ControlButton from '../../../components/card/ControlButton'
import IconBox from '../../../components/icons/IconBox'
import {
  MdGroupAdd,
  MdLibraryAdd,
} from 'react-icons/md'
import { createParty } from '../../../logic/db'

export default function Statistics() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const brandColor = 'brand.500'
  const boxBg = 'secondaryGray.300'
  const borderColor = 'secondaryGray.700'

  // TODO: agregar dos stats
  // - nombre del administrador
  // - uno que sea "todavia no pagaste"/admin: x no pago
  return (<>
    <ControlButton
      startContent={
        <IconBox
          w='56px'
          h='56px'
          bg={boxBg}
          borderColor={borderColor}
          borderWidth={1}
          icon={
            <Icon
              w='28px'
              h='28px'
              as={loading ? Spinner : MdLibraryAdd}
              color={brandColor}
            />
          }
        />
      }
      title="Creá una partida"
      onClick={async () => {
        setLoading(true)
        const partyId = await createParty()
        router.push(`/${partyId}`)
      }}
      description="Jugá con tus amigos, familia, o con quien quieras!"
    />
    <ControlButton
      startContent={
        <IconBox
          w='56px'
          h='56px'
          bg={boxBg}
          borderColor={borderColor}
          borderWidth={1}
          icon={
            <Icon
              w='28px'
              h='28px'
              as={MdGroupAdd}
              color={brandColor}
            />
          }
        />
      }
      title="Sumate a una partida"
      description="Pedile el código a quien la armó!"
      endContent={<Input borderColor={borderColor} borderWidth={1} placeholder='Código de partida' bg="white" />}
    />
  </>)
}
