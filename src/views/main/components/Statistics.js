import React from 'react'

import {
  Icon,
} from '@chakra-ui/react'
import MiniStatistics from '../../../components/card/MiniStatistics'
import IconBox from '../../../components/icons/IconBox'
import {
  MdAttachMoney,
  MdOutlineCalendarMonth,
  MdPeopleAlt
} from 'react-icons/md'

export default function Statistics({ participants }) {
  const brandColor = 'brand.500'
  const boxBg = 'secondaryGray.300'

  const daysUntilElections = React.useMemo(() => {
    const today = new Date()
    const electionDay = new Date("2023-10-22T00:00:00.000-03:00");
    const diffTime = electionDay - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [])

  // TODO: agregar dos stats
  // - nombre del administrador
  // - uno que sea "todavia no pagaste"/admin: x no pago
  return (<>
    <MiniStatistics
      startContent={
        <IconBox
          w='56px'
          h='56px'
          bg={boxBg}
          icon={
            <Icon
              w='32px'
              h='32px'
              as={MdAttachMoney}
              color={brandColor}
            />
          }
        />
      }
      name='El ganador se lleva...'
      value={"$" + (1000 * participants.length)}
    />
    <MiniStatistics
      startContent={
        <IconBox
          w='56px'
          h='56px'
          bg={boxBg}
          icon={
            <Icon
              w='32px'
              h='32px'
              as={MdPeopleAlt}
              color={brandColor}
            />
          }
        />
      }
      name='Participantes'
      value={participants.length}
      description={<span><b>$1000</b> por persona</span>}
    />
    {
      daysUntilElections > 0 ? (
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon
                  w='32px'
                  h='32px'
                  as={MdOutlineCalendarMonth}
                  color={brandColor}
                />
              }
            />
          }
          name='Días hasta las elecciones'
          value={daysUntilElections}
          // TODO: poner en rojo cuando ya no se puedan cambiar las apuestas, o incluso un timer
          description={<span>Se pueden cambiar las apuestas hasta el <b>viernes</b> pre-elecciones</span>}
        />
      ) : (
        // TODO: poner aca un coso que dice cuantas mesas ya estan escrutinadas y un link a resultados.gob.ar
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon
                  w='32px'
                  h='32px'
                  as={MdOutlineCalendarMonth}
                  color={brandColor}
                />
              }
            />
          }
        />
      )}
  </>)
}
