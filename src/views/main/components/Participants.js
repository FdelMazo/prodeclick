import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table'

import Card from '../../../components/card/Card'
import Menu from '../../../components/menu/MainMenu'

import { MdCheckCircle, MdCancel } from 'react-icons/md'


// TODO: agregar columna de participacion
// TODO: convertir prode en una multi-progressbar con tooltips en hover
// TODO: sacar columna de si pago/no pago?
const columns = [
  {
    Header: "NOMBRE",
    accessor: "name",
  },
  {
    Header: "PAGO",
    accessor: "pago",
  },
  {
    Header: "PRODE",
    accessor: "prode",
  }
];


const data = [
  {
    "name": "Fede",
    "prode": 15.5,
    "pago": true,
  },
  {
    "name": "Fede2",
    "prode": 80.5,
    "pago": false,
  },
]


// TODO: convertir en lista de participantes
export default function Participants(props) {
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
    initialState
  } = tableInstance
  initialState.pageSize = 5

  const textColor = 'secondaryGray.900'
  const borderColor = 'gray.200'
  return (
    <Card
      flexDirection='column'
      w='100%'
      px='0px'
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'
        >
          Participantes
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'
                  >
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
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    )
                  } else if (cell.column.Header === 'PAGO') {
                    data = (
                      <Flex align='center'>
                        <Icon
                          w='24px'
                          h='24px'
                          me='5px'
                          color={
                            cell.value ? 'green.500' : 'red.500'
                          }
                          as={
                            cell.value ? MdCheckCircle : MdCancel
                          }
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value ? "Ya pagó" : "Todavía no pagó"}
                        </Text>
                      </Flex>
                    )
                  } else if (cell.column.Header === 'PRODE') {
                    data = (
                      <Flex align='center'>
                        <Progress
                          variant='table'
                          colorScheme='brandScheme'
                          h='8px'
                          w='108px'
                          value={cell.value}
                        />
                      </Flex>
                    )
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: '14px' }}
                      maxH='30px !important'
                      py='8px'
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
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
