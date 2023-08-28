import {
  Flex,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  Icon
} from '@chakra-ui/react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

import Card from '../../../components/card/Card'
import PARTIDOS from '../../../logic/partidos'
import { MdPlayCircle } from 'react-icons/md'

// TODO: agregar columna de resultados reales y diff el dia de las elecciones
// TODO: agregar submitbutton, editbutton
// TODO: fix error de matching tbody
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


export default function MiProde() {
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
  } = tableInstance

  const textColor = 'secondaryGray.900'
  const borderColor = 'gray.200'
  return (
    <Card p={4} w='100%' h='100%' justifyContent="space-between">
      <Text
        px={2}
        color={textColor}
        fontSize="xl"
        fontWeight='700'
      >
        Mís Predicciones
      </Text>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map(
                (
                  column,
                  index
                ) => (
                  <Th
                    {...column.getHeaderProps()}
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex color='secondaryGray'>
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
                    data = (
                      <Text
                        color={textColor}
                        fontWeight='700'
                      >
                        {cell.value}%
                      </Text>
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
    </Card>
  )
}
