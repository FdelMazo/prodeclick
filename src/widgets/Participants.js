import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";

import useParty from "../logic/useParty";
import { InlineProde } from "./ProdeComponents";

const columns = [
  {
    Header: "NOMBRE",
  },
  {
    Header: "PRODE",
  },
];

const ParticipantsTable = ({ data, userId }) => {
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
                <Flex
                  color="darkgray"
                  justifyContent={column.Header === "PRODE" && "center"}
                >
                  {column.render("Header")}
                </Flex>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <Tr
              {...row.getRowProps()}
              key={index}
              bg={row.original.id === userId && "gray.100"}
            >
              {row.cells.map((cell, index) => {
                let data;
                if (cell.column.Header === "NOMBRE") {
                  data = (
                    <Text color="darkgray.900" fontSize="sm" fontWeight="700">
                      {row.original.name}
                    </Text>
                  );
                } else if (cell.column.Header === "PRODE") {
                  data = (
                    <Flex justifyContent="center" gap={1} flexWrap="wrap">
                      <InlineProde prode={row.original.prode} />
                    </Flex>
                  );
                }
                return (
                  <Td {...cell.getCellProps()} key={index}>
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

export default function Participants() {
  const { party, user } = useParty();
  const data = party.users.map((u) => ({
    name: u.name,
    prode: u.prode,
    id: u.id,
  }));

  const [userId, setUserId] = React.useState(null);
  React.useEffect(() => {
    setUserId(user?.id);
  }, [user]);

  return (
    <Card p={4}>
      <CardHeader
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="darkgray.900" fontSize="xl" fontWeight="700">
          Participantes
        </Text>
      </CardHeader>

      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <ParticipantsTable data={data} userId={userId} />
      </CardBody>
    </Card>
  );
}
