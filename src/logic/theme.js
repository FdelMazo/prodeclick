import { defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const SimpleGrid = defineStyleConfig({
  defaultProps: {
    columns: 3,
  },
});

export default extendTheme({
  colors: {
    brand: {
      50: "#d6cdff",
      100: "#E9E3FF",
      200: "#7551FF",
      300: "#7551FF",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#02044A",
    },
    darkgray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    navy: {
      50: "#d0dcfb",
      100: "#aac0fe",
      200: "#a3b9f8",
      300: "#728fea",
      400: "#3652ba",
      500: "#1b3bbb",
      600: "#24388a",
      700: "#1B254B",
      800: "#111c44",
      900: "#0b1437",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode("darkgray.300", "navy.900")(props),
        fontFamily: "DM Sans",
        letterSpacing: "-0.5px",
      },
    }),
  },
  breakpoints: {
    sm: "320px",
    "2sm": "380px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1600px",
    "3xl": "1920px",
  },
  components: {
    SimpleGrid,
  },
});
