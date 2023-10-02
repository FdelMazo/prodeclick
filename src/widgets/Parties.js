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

const PartiesTable = ({ data, columns }) => {
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
                      {/* TODO: fix poner GMT-3 */}
                      {row.original.creation}
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
