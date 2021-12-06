import Head from 'next/head'
import MainMenu from 'components/MainMenu'
import SilentVideo from 'components/SilentVideo'
import { Container,
  Text,
  Heading,
  Center,
  Divider,
  Button
} from "@chakra-ui/react"
import Link from "next/link"
import Footer from 'components/Footer'
import styles from '../styles/Home.module.scss'

const buttonProps = {
  background: "black",
  color: "white",
  marginBottom: 25,
  width: "100%",
  as:"a",
  _hover: {bg: "rgb(0,0,0,0.8)"}
}


export default function Home() {
  return (
    <div>
      <Head>
        <title>The Stack Report</title>
        <meta name="description" content="Data driven reporting and visualisations from within the Tezos ecosystem." />
        
        
      </Head>
      <MainMenu />
      <main>
      <div className={styles["responsive-video-bump"]}></div>
      <div style={{
        width: "100vw",
        height: "56.25vw"
      }}>
      <iframe
        src="https://player.vimeo.com/video/653495414?title=0&byline=0&portrait=0&muted=1&autoplay=1&autopause=0&controls=0&loop=1"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen={true}>

      </iframe>
      </div>
        <div style={{borderTop: "1px solid rgb(220,220,220)", margin: 0}}>
        <Center height='50px'>
          <Divider orientation='vertical' />
        </Center>
        <Divider marginBottom={50} />
          <Container>
          <Heading as="h1" fontSize="4xl" fontWeight="light" lineHeight={"4rem"} marginBottom={0}>
            The Stack Report<br />
          </Heading>
          <Text fontSize="xl">
            Covering stories in the Tezos ecosystem through blockchain data visualisation.
          </Text>
          <br />
          <Text fontSize="xl">
            Launching early 2022.
          </Text>
          <br />
          <Button
            {...buttonProps}
            _hover={{bg: "blue"}}
            href="/blog/announcement"
            >
            Read the announcement
          </Button>
          <Divider marginTop={25} marginBottom={25} />
          <p>{`Don't miss out by following the`} <i>The Stack Report</i> on:</p>
          <br />
          <Button
            {...buttonProps}
            _hover={{bg: "twitter.700"}}
            href="https://twitter.com/thestackreport"
            >
            Twitter
          </Button>
          <Button
            {...buttonProps}
            _hover={{bg: "#e1306c"}}
            href="https://www.instagram.com/stackreport/"
            >
            Instagram
          </Button>
          <Button
            {...buttonProps}
            _hover={{bg: "linkedin.300"}}
            href="https://www.linkedin.com/company/the-stack-report"
            >
            LinkedIn
          </Button>
          <Divider
                    marginBottom={25}
                    />
                <Text>
                  If you are excited about this initiative and want to contribute, feel free to watch and share this video teaser!
                </Text>
                <div style={{
                    padding: "75% 0 0 0",
                    position:"relative"
                }}>
                    <iframe
                        src="https://player.vimeo.com/video/653497706?h=3935981d26&badge=0&autopause=0&player_id=0&app_id=58479"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }}
                        title="The Stack Report - Announcement teaser">
                    </iframe>
                </div>
          </Container>
        </div>
        <Footer />
      </main>
    </div>
  )
}
