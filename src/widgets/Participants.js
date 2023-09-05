import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table'

import Card from '../components/card/Card'

import useParty from '../logic/useParty'
import { InlineProde } from './ProdeComponents'

const columns = [
  {
    Header: "NOMBRE",
  },
  {
    Header: "PRODE",
  }
];

export default function Participants() {
  const { party } = useParty()
  const data = party.users.map(u => ({ name: u.name, prode: Object.entries(u.prode) }))

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState
  } = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )
  initialState.pageSize = party.users.length

  return (
    <Card p={4} w='100%' h='100%' justifyContent="space-between">
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Text
          px={2}
          color='darkgray.900'
          fontSize="xl"
          fontWeight='700'
        >
          Participantes
        </Text>
      </Flex>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps()}
                  key={index}
                  borderColor='gray.200'
                >
                  <Flex color='darkgray' justifyContent={column.Header === "PRODE" && "center"}>
                    {column.render('Header')}
                  </Flex>
                </Th>
              ))}
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
                  if (cell.column.Header === 'NOMBRE') {
                    data = (
                      <Text color='darkgray.900' fontSize='sm' fontWeight='700'>
                        {row.original.name}
                      </Text>
                    )
                  } else if (cell.column.Header === 'PRODE') {
                    data = <InlineProde prode={row.original.prode} />
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
