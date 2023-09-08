import { defineStyleConfig } from "@chakra-ui/react";

export const cardStyles = defineStyleConfig({
  components: {
    Card: {
      baseStyle: {
        container: {
          borderRadius: "20px",
        },
        body: {
          borderRadius: "20px",
        }
      },
    },
  },
});
