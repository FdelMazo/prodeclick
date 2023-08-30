import { ChakraProvider, GlobalStyle, LightMode } from '@chakra-ui/react'
import React from 'react'
import theme from '../theme/theme'
import './styles.css'

import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <LightMode>
        <GlobalStyle />
        <Head>
          <meta charSet="utf-8" />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='theme-color' content='#000000' />

          <meta content="https://prode.ar/" property="og:url" />
          <meta content="prode.ar" property="og:title" />

          <meta
            content="https://prode.ar/img/screen.png"
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

          <title>prode.ar</title>
        </Head>
        <React.StrictMode>
          <Component {...pageProps} />
        </React.StrictMode>
      </LightMode>
    </ChakraProvider>
  )
}

export default MyApp
