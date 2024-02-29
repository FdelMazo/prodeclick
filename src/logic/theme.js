import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export default extendTheme({
  colors: {
    brand: {
      50: "#FFF5F5",
      100: "#FFEBEB",
      200: "#FFD1D1",
      300: "#FFB3B3",
      400: "#FF8A8A",
      500: "#FF6666",
      600: "#FF1A1A",
      700: "#E00000",
      800: "#BD0000",
      900: "#850000",
      950: "#6B0000",
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
});
