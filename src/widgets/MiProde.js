import {
  Box,
  Flex,
  Icon,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import React from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

import { CheckIcon, EditIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { MdPlayCircle } from 'react-icons/md'
import Card from '../components/card/Card'
import { setProde } from '../logic'
import PARTIDOS from '../logic/partidos'

const data = PARTIDOS

const columns = [
  {
    Header: "PARTIDO",
    accessor: "partido",
  },
  {
    Header: "PORCENTAJE",
    accessor: "percentage",
  },
];


export default function MiProde({ prode, isLoading }) {
  const router = useRouter()
  const isParty = !!router.query.id
  const [isEdit, setIsEdit] = React.useState(false)
  const [editProde, setEditProde] = React.useState(prode)

  const suma = React.useMemo(() => {
    if (!editProde) {
      return {
        sum: 0,
        color: 'gray'
      }
    }
    const sum = (Object.values(editProde).reduce((a, b) => a + b, 0)).toFixed(1)
    const color = sum < 100 ? 'pink' : sum > 100 ? 'red' : 'green'
    return {
      sum,
      color
    }
  }, [editProde, isLoading])

  const tableInstance = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance
  initialState.pageSize = PARTIDOS.length

  const textColor = 'darkgray.900'
  const borderColor = 'gray.200'
  const iconColor = 'brand.500'
  const bgButton = 'darkgray.300'

  const format = (val) => `${val}%`

  return (
    <Card p={4} w='100%' h='100%' justifyContent="space-between">
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Text
          px={2}
          color={textColor}
          fontSize="xl"
          fontWeight='700'
        >
          {isEdit && 'Armar'} Mi Prode
        </Text>
        {isParty && <IconButton
          borderRadius='lg'
          bg={bgButton}
          color={iconColor}
          title={isEdit ? 'Guardar predicciones' : 'Editar predicciones'}
          isDisabled={isEdit && suma.sum != 100.0}
          icon={<Icon as={isEdit ? CheckIcon : EditIcon} boxSize={5} />}
          onClick={isEdit ? () => {
            if (suma.sum != 100.0) {
              return
            }
            setProde(editProde)
            setIsEdit(false)
          } : () => setIsEdit(true)}
        />}
      </Flex>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map(
                (column, index) => (
                  <Th
                    {...column.getHeaderProps()}
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex color='darkgray'>
                      {column.render('Header')}
                    </Flex>
                  </Th>
                )
              )}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data
                  if (cell.column.Header === 'PARTIDO') {
                    data = (
                      <Flex alignItems="center">
                        <Icon as={MdPlayCircle} boxSize={6} mr={2} color={`${row.original.color}.600`} />
                        <Box>
                          <Text color={textColor} fontSize='lg' fontWeight='700'>
                            {cell.value}
                          </Text>
                          <Text color="gray" fontSize='sm' fontWeight='700'>
                            {row.original.candidatos}
                          </Text>
                        </Box>
                      </Flex>
                    )
                  } else if (cell.column.Header === 'PORCENTAJE') {
                    data = isEdit ? (
                      <NumberInput
                        w="10ch"
                        min={0}
                        max={100}
                        step={0.1}
                        precision={1}
                        value={format(editProde[row.original.id])}
                        onChange={(value) => {
                          setEditProde({
                            ...editProde,
                            [row.original.id]: parseFloat(value),
                          })
                        }}
                      >
                        <NumberInputField textAlign="center" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    ) : (
                        <Box color={`${row.original.color}.600`}>
                          {(isLoading || (isParty && !prode)) ? <Spinner size="xs" /> : (
                            <Text
                              fontWeight='700'
                            >
                              {isParty ? prode?.[row.original.id] : "??"}%
                            </Text>
                          )}
                        </Box>
                    )
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      borderColor='transparent'
                    >
                      {data}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      {isEdit && (
        <Flex flexDir="column" alignSelf="flex-end" mt={4} mr={2}>
          <Progress hasStripe bg="gray.200" colorScheme={suma.color} value={suma.sum} w="100%" h={2} borderRadius={4} />
          <Box>
            <Text as="span" fontWeight={600}>Suma:</Text>
            <Text as="span" fontWeight={600} color={`${suma.color}.600`} ml={1}>{suma.sum}%</Text>
          </Box>
        </Flex>
      )}
    </Card>
  )
}
