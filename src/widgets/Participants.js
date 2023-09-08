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

import Card from '../components/Card'

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

const ParticipantsTable = ({ data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
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
        {rows.map((row, index) => {
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
  )
}

export default function Participants() {
  const { party } = useParty()
  const data = party.users.map(u => ({ name: u.name, prode: u.prode }))

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
      <ParticipantsTable data={data} />
    </Card>
  )
}
