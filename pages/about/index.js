import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Container
} from "@chakra-ui/layout"

const AboutPage = () => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - About</title>
                <meta name="description" content="Data driven reporting and visualisations from within the Tezos ecosystem." />
            </Head>
            <Container
                maxW="container.xl"
                paddingTop="8rem"
                >
            <h1>
                About the stack report.
            </h1>
            </Container>
        </PageLayout>
    )
}

export default AboutPage