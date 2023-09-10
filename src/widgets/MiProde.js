import {
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
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { updateUserProde } from "../logic/api";
import PARTIDOS from "../logic/partidos";
import useParty from "../logic/useParty";
import { Partido, Porcentaje, Suma, validProde } from "./ProdeComponents";

const data = PARTIDOS;
const columns = [
  {
    Header: "FUERZA POLÍTICA",
  },
  {
    Header: "PORCENTAJE",
  },
];

export default function MiProde() {
  const { user, mutate, isParty } = useParty();
  const [isEdit, setIsEdit] = React.useState(false);
  const [editProde, setEditProde] = React.useState(user?.prode);
  React.useEffect(() => {
    setEditProde(user?.prode);
  }, [user]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Card h="100%">
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="darkgray.900" fontSize="xl" fontWeight="700">
          Mi Prode
        </Text>
        {isParty && (
          <IconButton
            borderRadius="lg"
            bg="darkgray.300"
            color="brand.500"
            title={isEdit ? "Guardar predicciones" : "Editar predicciones"}
            isDisabled={isEdit && !validProde(editProde)}
            icon={<Icon as={isEdit ? CheckIcon : EditIcon} boxSize={5} />}
            onClick={
              isEdit
                ? async () => {
                    if (!validProde(editProde)) {
                      return;
                    }
                    await updateUserProde(user?.id, editProde);
                    mutate();
                    setIsEdit(false);
                  }
                : () => setIsEdit(true)
            }
          />
        )}
      </CardHeader>
      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
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
                      justifyContent={
                        column.Header === "PORCENTAJE" && "center"
                      }
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
                          prode={user?.prode}
                          editProde={editProde}
                          setEditProde={setEditProde}
                          isEdit={isEdit}
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
        {isEdit && <Suma prode={editProde} />}
      </CardBody>
    </Card>
  );
}
