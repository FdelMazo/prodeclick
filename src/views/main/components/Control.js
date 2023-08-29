import React from 'react'

import {
  Icon, Input, Text,
} from '@chakra-ui/react'
import ControlButton from '../../../components/card/ControlButton'
import IconBox from '../../../components/icons/IconBox'
import {
  MdGroupAdd,
  MdLibraryAdd,
} from 'react-icons/md'
import { AddIcon } from '@chakra-ui/icons'

export default function Statistics() {
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
              as={MdLibraryAdd}
              color={brandColor}
            />
          }
        />
      }
      title="Creá una partida"
      link="/asd"
      description="Jugá con tus amigos, familia o con quien quieras!"
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
      endContent={<Input placeholder='Código de partida' bg="white" />}
    />
  </>)
}
