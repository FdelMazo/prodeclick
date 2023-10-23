import {
  Box,
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
import { Partido, Porcentaje, Suma } from "./ProdeComponents";
import { ProdeContext } from "../logic/ProdeContext";

const columns = [
  {
    Header: "FUERZA POLÍTICA",
  },
  {
    Header: "PORCENTAJE",
  },
];

export default function ProdeTable({ prode, setProde, isEdit }) {
  const {ELECCIONES} = React.useContext(ProdeContext)
  const data = ELECCIONES.partidos;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const { isParty, isLoading, isLogged } = useParty();
  return (
    <Box w="100%" key={isLoading} overflowX="auto">
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps()}
                  key={index}
                  borderColor="darkgray.400"
                >
                  <Flex
                    color="darkgray.800"
                    justifyContent={column.Header === "PORCENTAJE" && "center"}
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
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data;
                  if (cell.column.Header === "FUERZA POLÍTICA") {
                    data = <Partido partido={row.original} />;
                  } else if (cell.column.Header === "PORCENTAJE") {
                    data = (
                      <Porcentaje
                        partido={row.original}
                        prode={prode}
                        setProde={setProde}
                        isEdit={isEdit}
                        isLoading={isParty && isLoading}
                        isDummy={!isParty || !isLogged}
                      />
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {isEdit && (
        <>
          <Text
            color="darkgray.800"
            fontSize="sm"
            fontWeight={700}
            w="100%"
            textAlign="center"
          >
            En las elecciones generales no se contabilizan los votos en blanco!
          </Text>
          <Flex flexDir="column" w="50%" m="auto" my={2} alignItems="center">
            <Suma prode={prode} />
          </Flex>
        </>
      )}
    </Box>
  );
}
