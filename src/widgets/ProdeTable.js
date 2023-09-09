import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import React from 'react'
import {
  useTable
} from 'react-table'

import PARTIDOS from '../logic/partidos'
import { Partido, Porcentaje, Suma } from './ProdeComponents'

const data = PARTIDOS

const columns = [
  {
    Header: "FUERZA POLÍTICA",
  },
  {
    Header: "PORCENTAJE",
  },
];


export default function ProdeTable({ prode, setProde, isEdit }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <Box w="100%">
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map(
                (column, index) => (
                  <Th
                    {...column.getHeaderProps()}
                    key={index}
                    borderColor={'gray.200'}
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
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data
                  if (cell.column.Header === 'FUERZA POLÍTICA') {
                    data = <Partido partido={row.original} />
                  } else if (cell.column.Header === 'PORCENTAJE') {
                    data = <Porcentaje partido={row.original} editProde={prode} setEditProde={setProde} isEdit={isEdit} />
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
          {isEdit && <Suma prode={prode} />}
    </Box>
  )
}
