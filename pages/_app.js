import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import PlausibleProvider from 'next-plausible'

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
    color: "green.600",
    textDecoration: "underline",
    _hover: {
      color: "white",
      background: "green.600"
    }
  },
  
}

const Button = {
  baseStyle: {
    background: "green.900",
    color: "black"
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
  return (
    <PlausibleProvider domain="thestackreport.xyz">
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
    </PlausibleProvider>
  )
}

export default MyApp
