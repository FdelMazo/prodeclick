import { ChakraProvider, LightMode } from "@chakra-ui/react";
import React from "react";
import theme from "../logic/theme";

import Head from "next/head";

import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <LightMode>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />

          <meta content="https://prodeclick.vercel.app/" property="og:url" />
          <meta content="prode-click" property="og:title" />

          <meta
            content="https://prodeclick.vercel.app/img/screen.png"
            property="og:image"
          />
          <meta
            content="Predecí las elecciones argentinas!"
            name="description"
          />
          <meta
            content="Predecí las elecciones argentinas!"
            name="og: description"
          />

          <title>prode-click · Prode Electoral Argentino</title>
        </Head>
        <React.StrictMode>
          <Component {...pageProps} />
        </React.StrictMode>
      </LightMode>
    </ChakraProvider>
  );
}

export default MyApp;
