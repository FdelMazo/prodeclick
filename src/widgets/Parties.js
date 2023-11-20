import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  IconButton,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { usePagination, useSortBy, useTable } from "react-table";
import { ProdeContext } from "../logic/ProdeContext";
import { deleteParty } from "../logic/api";
import useResults from "../logic/useResults";
import { diff, sum } from "../logic/utils";
import { InlineProde } from "./ProdeComponents";

const PartiesTable = ({ data, columns }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 50,
        sortBy: [
          {
            id: "nusers",
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <Box overflowX="auto">
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={index}
                  borderColor="gray.200"
                  justifyContent={column.Header === "ADMINISTRAR" && "center"}
                >
                  <Flex color="darkgray">
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon mx={1} />
                      ) : (
                        <TriangleUpIcon mx={1} />
                      )
                    ) : null}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  let data;
                  if (cell.column.Header === "CREACIÓN") {
                    data = (
                      <Text color="darkgray.900" fontSize="sm" fontWeight={700}>
                        {new Date(row.original.creation)?.toLocaleString(
                          "es-AR"
                        )}
                      </Text>
                    );
                  } else if (cell.column.Header === "ID") {
                    data = (
                      <Link href={`/${row.original.id}`} isExternal>
                        <Text
                          color="darkgray.900"
                          fontSize="sm"
                          fontWeight={700}
                        >
                          {row.original.id}
                        </Text>
                      </Link>
                    );
                  } else if (cell.column.Header === "NOMBRE") {
                    data = (
                      <Text color="darkgray.900" fontSize="sm" fontWeight={700}>
                        {row.original.name} ({row.original.nusers})
                      </Text>
                    );
                  } else if (cell.column.Header === "ELECCIONES") {
                    data = (
                      <Text color="darkgray.800" fontSize="sm" fontWeight={700}>
                        {row.original.electionsId}
                      </Text>
                    );
                  } else if (cell.column.Header === "ADMINISTRAR") {
                    data = (
                      <Flex justifyContent="center">
                        <Tooltip
                          label={"Borrar partida"}
                          placement="top"
                          hasArrow={true}
                        >
                          <IconButton
                            borderRadius="lg"
                            bg="red.400"
                            color="white"
                            icon={<Icon as={MdDeleteOutline} boxSize={5} />}
                            _hover={{ bg: "red.500" }}
                            onClick={async () => {
                              await deleteParty(row.original.id);
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    );
                  }

                  return (
                    <Td {...cell.getCellProps()} key={cellIndex}>
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {(canPreviousPage || canNextPage) && (
        <Flex justifyContent="flex-end" my={2} gap={2}>
          <Tooltip label="Página anterior">
            <IconButton
              size="sm"
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon boxSize={5} />}
            />
          </Tooltip>
          <Tooltip label="Página siguiente">
            <IconButton
              size="sm"
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon boxSize={5} />}
            />
          </Tooltip>
        </Flex>
      )}
    </Box>
  );
};

export default function Parties({ parties }) {
  const columns = [
    {
      Header: "CREACIÓN",
      accessor: "creation",
    },
    {
      Header: "ID",
    },
    {
      Header: "NOMBRE",
      accessor: "nusers",
      sortType: (rowA, rowB) => {
        return rowA.original.nusers - rowB.original.nusers;
      },
    },
    {
      Header: "ELECCIONES",
      accessor: "electionsId",
    },
    {
      Header: "ADMINISTRAR",
    },
  ];

  // Traer todos los usuarios y todos los prodes es muuuy pesado, así que esto
  // se habilita y deshabilita a manopla.
  // Para ver stats de los prodes, cambiar el `getParty` que popula esta tabla
  // por un `getParty` full
  const { ELECCIONES } = React.useContext(ProdeContext);
  const { realResults } = useResults();

  const prodePromedio = React.useMemo(() => {
    if (!parties[0].users[0].name) return null;

    const allProdes = parties
      .filter((p) => p.electionsId === ELECCIONES.id)
      .flatMap((p) => p.users)
      .map((u) => u.prode);

    return Object.fromEntries(
      ELECCIONES.partidos.map((p) => [
        p.id,
        (allProdes.reduce((a, b) => a + b[p.id], 0) / allProdes.length).toFixed(
          2
        ),
      ])
    );
  }, [parties, realResults]);

  const prodeCercano = React.useMemo(() => {
    if (!parties[0].users[0].name || !realResults) return null;

    const users = parties
      .filter((p) => p.electionsId === ELECCIONES.id)
      .flatMap((p) => p.users)
      .map((u) => ({
        dif: sum(diff(u.prode, realResults)),
        ...u,
      }))
      .sort((a, b) => a.dif - b.dif);

    return users[0];
  }, [parties, realResults]);

  return (
    <Card p={4}>
      <CardHeader
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="darkgray.900" fontSize="xl" fontWeight={700}>
          Partidas
        </Text>
        <Flex gap={2} alignItems="center">
          {prodePromedio && (
            <Card variant="outline">
              <CardBody
                color="darkgray.900"
                fontSize="lg"
                fontWeight={700}
                p={2}
                textAlign="center"
              >
                Prode Promedio
                <Flex gap={2} justifyContent="center">
                  <InlineProde prode={prodePromedio} />
                </Flex>
              </CardBody>
            </Card>
          )}
          {prodeCercano && (
            <Card variant="outline">
              <CardBody
                color="darkgray.900"
                fontSize="lg"
                fontWeight={700}
                p={2}
                textAlign="center"
              >
                Prode Más Cercano
                <br />"{prodeCercano.name}"
                <Flex gap={2} justifyContent="center">
                  <InlineProde prode={prodeCercano.prode} />
                </Flex>
              </CardBody>
            </Card>
          )}
        </Flex>
      </CardHeader>
      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <PartiesTable data={parties} columns={columns} />
      </CardBody>
    </Card>
  );
}
