import {
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
import { useTable } from "react-table";
import { deleteParty } from "../logic/api";
import ELECCIONES_DATA from "../logic/elecciones";
import { InlineProde } from "./ProdeComponents";

const ELECCIONES = ELECCIONES_DATA.elecciones[ELECCIONES_DATA.current];
const PARTIDOS = ELECCIONES.partidos;

const PartiesTable = ({ data, columns }) => {
  // TODO: hacer las columnas sorteables
  // TODO: pagination
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup, index) => (
          <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <Th
                {...column.getHeaderProps()}
                key={index}
                borderColor="gray.200"
              >
                <Flex color="darkgray">{column.render("Header")}</Flex>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>

      <Tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()} key={rowIndex}>
              {row.cells.map((cell, cellIndex) => {
                let data;
                if (cell.column.Header === "CREACIÓN") {
                  data = (
                    <Text color="darkgray.900" fontSize="xs" fontWeight={700}>
                      {new Date(row.original.creation)?.toLocaleString("es-AR")}
                    </Text>
                  );
                } else if (cell.column.Header === "ID") {
                  data = (
                    <Link href={`/${row.original.id}`} isExternal>
                      <Text color="darkgray.900" fontSize="xs" fontWeight={700}>
                        {row.original.id}
                      </Text>
                    </Link>
                  );
                } else if (cell.column.Header === "NOMBRE") {
                  data = (
                    <Text color="darkgray.900" fontSize="sm" fontWeight={700}>
                      {row.original.name}
                    </Text>
                  );
                } else if (cell.column.Header === "ELECCIONES") {
                  data = (
                    <Text color="darkgray.800" fontSize="sm" fontWeight={700}>
                      {row.original.electionsId}
                    </Text>
                  );
                } else if (cell.column.Header === "USUARIOS") {
                  data = (
                    <Text color="darkgray.900" fontSize="sm" fontWeight={700}>
                      {row.original.users.map((u) => u.name).join(", ")}
                    </Text>
                  );
                } else if (cell.column.Header === "ADMINISTRAR") {
                  data = (
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
  );
};

export default function Parties({ parties }) {
  const columns = [
    {
      Header: "CREACIÓN",
    },
    {
      Header: "ID",
    },
    {
      Header: "NOMBRE",
    },
    {
      Header: "ELECCIONES",
    },
    {
      Header: "USUARIOS",
    },
    {
      Header: "ADMINISTRAR",
    },
  ];

  const prodePromedio = React.useMemo(() => {
    const allProdes = parties.flatMap((p) => p.users).map((u) => u.prode);

    return Object.fromEntries(
      PARTIDOS.map((p) => [
        p.id,
        (allProdes.reduce((a, b) => a + b[p.id], 0) / allProdes.length).toFixed(
          2
        ),
      ])
    );
  }, [parties]);

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
        <Card variant="outline">
          <CardBody
            color="darkgray.900"
            fontSize="lg"
            fontWeight={700}
            p={2}
            textAlign="center"
          >
            Prode Promedio
            <Flex gap={2}>
              <InlineProde prode={prodePromedio} />
            </Flex>
          </CardBody>
        </Card>
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
