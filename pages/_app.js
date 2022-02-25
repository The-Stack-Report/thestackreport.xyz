import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import PlausibleProvider from 'next-plausible'
import _ from 'lodash'

const colors = {

}

const fonts = {
  heading: "Roboto Mono",
  body: "Roboto Mono"
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
  colors,
  fonts,
  textStyles,
  styles,
  components
})


function MyApp({ Component, pageProps }) {
  console.log("app render Component: ", _.get(Component, "name"))
  if(process.env.NEXT_PUBLIC_ANALYTICS == "true") {
    return (
      <PlausibleProvider
        domain="thestackreport.xyz"
        >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
      </PlausibleProvider>
    )
  } else {
    console.log("render without wrapping.")
    return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    )
  }
  
}

export default MyApp
