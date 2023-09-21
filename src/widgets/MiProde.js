import {
  Card,
  CardBody,
  CardHeader,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { updateUser } from "../logic/api";
import useParty from "../logic/useParty";
import { canBid, validProde } from "../logic/utils";
import ProdeTable from "./ProdeTable";

export default function MiProde() {
  const { user, mutate, isParty, isLogged } = useParty();
  const [isEdit, setIsEdit] = React.useState(false);
  const [prode, setProde] = React.useState(null);
  const bid = React.useMemo(canBid, []);

  React.useEffect(() => {
    setProde(user?.prode);
  }, [user]);

  return (
    <Card h="100%" p={4}>
      <CardHeader
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Text color="darkgray.900" fontSize="xl" fontWeight="700">
          Mi Prode
        </Text>
        {isParty && isLogged && bid && (
          <Tooltip
            label={isEdit ? "Guardar predicciones" : "Editar predicciones"}
            placement="top"
            hasArrow={true}
          >
            <IconButton
              borderRadius="lg"
              bg="darkgray.300"
              color="brand.500"
              isDisabled={isEdit && !validProde(prode)}
              icon={<Icon as={isEdit ? CheckIcon : EditIcon} boxSize={5} />}
              _hover={{ bg: "brand.100" }}
              onClick={
                isEdit
                  ? async () => {
                      await updateUser(user?.id, { prode });
                      mutate();
                      setIsEdit(false);
                    }
                  : () => setIsEdit(true)
              }
            />
          </Tooltip>
        )}
      </CardHeader>
      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <ProdeTable prode={prode} setProde={setProde} isEdit={isEdit} />
      </CardBody>
    </Card>
  );
}
