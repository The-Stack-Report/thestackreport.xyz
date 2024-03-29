import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import PlausibleProvider from 'next-plausible'
import { WalletContextProvider } from "components/Wallet"
import _ from 'lodash'

const fonts = {
  heading: "Roboto Mono, monospace",
  body: "Roboto Mono, monospace"
}

const fontSizes = [
  10,
  12,
  14,
  16,
  18,
  20
]

fontSizes.lg = "50px"

const textStyles = {
  h1: {
    // you can also use responsive styles
    fontSize: ['48px', '72px'],
    fontWeight: 'bold',
    lineHeight: '110%',
    letterSpacing: '-2%'
  },
  h2: {
    fontSize: ['36px', '48px'],
    fontWeight: 'semibold',
    lineHeight: '110%',
    letterSpacing: '-1%',
  }
}

const Link = {
  baseStyle: {
    color: "black",
    textDecoration: "underline",
    _hover: {
      color: "white",
      background: "black",
      fill: "white"
    }
  },
  
}

const Button = {
  baseStyle: {
    background: "green.900",
    color: "black",
    width: "100%",
    marginBottom: "0.35rem",
    borderRadius: 0
  }
}

const Divider = {
  baseStyle: {
    marginTop: "1rem",
    marginBottom: "1rem"
  }
}

const components = {
  Link,
  Button,
  Divider
}

const styles = {
  global: {
    // a: {
    //   color: "green.600",
    //   textDecoration: 'underline',
    //   fontWeight: "light",
    //   _hover: {
    //     background: "green.600",
    //     color: "white"
    //   }
    // }
  }
}

const theme = extendTheme({
  fonts,
  textStyles,
  styles,
  components,
  initialColorMode: "dark",
  useSystemColorMode: false
})


function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {

  var pageContent = (
    
      <ChakraProvider theme={theme}>
        <WalletContextProvider>
          <Component {...pageProps} />
        </WalletContextProvider>
      </ChakraProvider>
  )
  if(process.env.NEXT_PUBLIC_ANALYTICS == "true") {
    return (
      <PlausibleProvider
        domain="thestackreport.xyz"
        >
        {pageContent}
      </PlausibleProvider>
    )
  } else {
    return (
        <>
          {pageContent}
        </>
    )
  }
  
}

export default MyApp
