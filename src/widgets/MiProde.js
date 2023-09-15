import {
  Card,
  CardBody,
  CardHeader,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import { canBid, validProde } from "../logic";
import { updateUserProde } from "../logic/api";
import useParty from "../logic/useParty";
import ProdeTable from "./ProdeTable";

export default function MiProde() {
  const { user, mutate, isParty } = useParty();
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
        {isParty && bid && (
          <IconButton
            borderRadius="lg"
            bg="darkgray.300"
            color="brand.500"
            title={isEdit ? "Guardar predicciones" : "Editar predicciones"}
            isDisabled={isEdit && !validProde(prode)}
            icon={<Icon as={isEdit ? CheckIcon : EditIcon} boxSize={5} />}
            _hover={{ bg: "brand.100" }}
            onClick={
              isEdit
                ? async () => {
                    await updateUserProde(user?.id, prode);
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
        <ProdeTable prode={prode} setProde={setProde} isEdit={isEdit} />
      </CardBody>
    </Card>
  );
}
