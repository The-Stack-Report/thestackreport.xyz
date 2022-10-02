import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Container
} from "@chakra-ui/layout"
import {
    Box,
    Heading,
    Text
} from "@chakra-ui/react"
import _ from "lodash"
import MarkdownWrapper from "components/MarkdownWrapper"
import { interpretationLayerContent } from "content/interpretation-layer-content"

const InterpretationLayerPage = ({ pageContent }) => {
    return (
        <PageLayout>
            <Head>
                <title>{_.get(pageContent, "title", 'Interpretation Layer')}</title>
                <meta name="description" content={_.get(pageContent, "meta_description", "not-found")} />
            </Head>
            <Container
                maxW="container.lg"
                minH="100vh"
                paddingTop="8rem"
                >
                <Heading
                    fontWeight="thin"
                    marginBottom="2rem"
                    >
                    Interpretation Layer
                </Heading>
                <Box maxW="container.md" paddingBottom="4rem">
                    <MarkdownWrapper markdownText={interpretationLayerContent} />
                </Box>
            </Container>
        </PageLayout>
    )
}

export default InterpretationLayerPage