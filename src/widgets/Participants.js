import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  IconButton,
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
import { useTable } from "react-table";

import { MdDeleteOutline, MdLogin, MdLogout } from "react-icons/md";
import { deleteUser } from "../logic/api";
import useParty from "../logic/useParty";
import { canBid, diff, sum } from "../logic/utils";
import { InlineProde } from "./ProdeComponents";

const ParticipantsTable = ({ data, columns, userId, results, winners }) => {
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
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <Tr
              {...row.getRowProps()}
              key={rowIndex}
              bg={row.original.id === userId && "gray.100"}
            >
              {row.cells.map((cell, cellIndex) => {
                let data;
                if (cell.column.Header === "NOMBRE") {
                  data = (
                    <Flex gap={2}>
                      {results && (
                        <>
                          {winners.includes(row.original.id) ? (
                            "🏆"
                          ) : (
                            <Badge colorScheme="green" fontSize="sm">
                              #{rowIndex + 1}
                            </Badge>
                          )}
                        </>
                      )}
                      <Text color="darkgray.900" fontSize="sm" fontWeight="700">
                        {row.original.name}
                      </Text>
                    </Flex>
                  );
                } else if (cell.column.Header === "PRODE") {
                  data = (
                    <Flex justifyContent="center" gap={1} flexWrap="wrap">
                      <InlineProde prode={row.original.prode} />
                    </Flex>
                  );
                } else if (cell.column.Header === "DIFERENCIA") {
                  data = (
                    <Text color="red.500" fontSize="sm" fontWeight="700">
                      {row.original.dif} puntos
                    </Text>
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

export default function Participants({ onOpen }) {
  const { party, user, logout, mutate, isAdmin, isLogged } = useParty();
  // TODO: USE RESULTS!!!
  const { realResults, tablesPercent } = {};
  // const { realResults, tablesPercent } = useResults();

  const bid = React.useMemo(canBid, []);

  const columns = [
    {
      Header: "NOMBRE",
    },
    {
      Header: "PRODE",
    },
    realResults
      ? {
          Header: "DIFERENCIA",
        }
      : undefined,
  ].filter((c) => c);

  const data = React.useMemo(() => {
    return party.users
      .map((u) => {
        let user = {
          name: u.name,
          prode: u.prode,
          id: u.id,
        };
        if (realResults) {
          user["dif"] = sum(diff(u.prode, realResults));
        }
        return user;
      })
      .sort((a, b) => {
        if (!realResults) return 0;
        return a.dif - b.dif;
      });
  }, [party, realResults]);

  const winners = React.useMemo(() => {
    if (tablesPercent < 90) return [];
    return data?.filter((u) => u.dif === data[0].dif).map((u) => u.id);
  }, [data, tablesPercent]);

  return (
    <Card p={4}>
      <CardHeader
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Text color="darkgray.900" fontSize="xl" fontWeight="700">
            Participantes
          </Text>
          <Accordion allowToggle={true}>
            <AccordionItem border="none">
              <AccordionButton p={0} textAlign={"left"}>
                <Text color="darkgray.800" fontSize="sm" fontWeight="700">
                  Gana el que tenga menor diferencia absoluta entre todas sus
                  predicciones y los resultados reales.
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={0} textAlign={"left"}>
                <Text color="darkgray.800" fontSize="sm" fontWeight="700">
                  Frente a un candidato que saca 20%, tanto el que predijo 15%
                  como el que predijo 25% está a 5 puntos de diferencia.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        <Flex gap={1}>
          {isLogged ? (
            <>
              <Tooltip
                label={"Salir de la partida"}
                placement="top"
                hasArrow={true}
              >
                <IconButton
                  borderRadius="lg"
                  bg="darkgray.300"
                  color="brand.500"
                  icon={<Icon as={MdLogout} boxSize={5} />}
                  _hover={{ bg: "brand.100" }}
                  onClick={logout}
                />
              </Tooltip>
              {!isAdmin && bid && (
                <Tooltip
                  label={"Borrarme de la partida"}
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
                      await deleteUser(party.id, user.id)
                        .then(logout)
                        .then(mutate);
                    }}
                  />
                </Tooltip>
              )}
            </>
          ) : (
            <Tooltip
              label={"Sumarme a la partida"}
              placement="top"
              hasArrow={true}
            >
              <IconButton
                borderRadius="lg"
                bg="darkgray.300"
                color="brand.500"
                icon={<Icon as={MdLogin} boxSize={5} />}
                _hover={{ bg: "brand.100" }}
                onClick={onOpen}
              />
            </Tooltip>
          )}
        </Flex>
      </CardHeader>

      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <ParticipantsTable
          data={data}
          columns={columns}
          userId={user?.id}
          results={realResults}
          winners={winners}
        />
      </CardBody>
    </Card>
  );
}
