import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Container
} from "@chakra-ui/layout"
import {
    Box,
    Heading
} from "@chakra-ui/react"
import { CMS_URL } from 'constants/cms'
import MarkdownWrapper from "components/MarkdownWrapper"
import _ from "lodash"
import SocialsLinkList from "components/socials/SocialsLinkList"

const AboutPage = ({ landing }) => {
    const aboutText = _.get(landing, "attributes.about_tsr", "")
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - About</title>
                <meta name="description" content="Data driven reporting and visualisations from within the Tezos ecosystem." />
            </Head>
            <Container
                maxW="container.xl"
                paddingTop="100px"
                paddingBottom="8rem"
                >
            <Box maxW="60rem" marginBottom="4rem">
                <Heading
                    fontWeight="thin"
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    marginBottom="2rem"
                    >
                    About The Stack Report
                </Heading>
                <MarkdownWrapper
                    markdownText={aboutText}
                    />
            </Box>
            <Heading
                fontWeight="thin"
                marginTop={{
                    base: "2rem",
                    md: "4rem"
                }}
                marginBottom="2rem"
                >
                Follow on:
            </Heading>
            <Box maxW="20rem">
            <SocialsLinkList />
            </Box>
            </Container>
        </PageLayout>
    )
}

const landingPageContent = "/landing-page?populate=*"

export async function getServerSideProps(context) {
    const resp = await fetch(CMS_URL + landingPageContent)
    const data = await resp.json()

    return {
        props: {
            landing: data.data
        }
    }
}

export default AboutPage