import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html lang='en'>
      <Head>
        <link href="https://github.com/FdelMazo/" rel="author" />
        <link href="https://fede.dm/prode/" rel="canonical" />
        <link rel='icon' type="image/png" href='img/favicon.png' />
      </Head>
      <body id='root'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
