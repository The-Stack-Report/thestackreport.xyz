import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import PageLayout from 'components/PageLayout'
import {
    Heading,
    GridItem,
    SimpleGrid,
    Box,
    Text,
    Input
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import _ from "lodash"

const dashboardDescription = `


`


const DashboardsIndexPage = () => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Dashboards</title>
                <meta name="description" content="The Stack Report dashboards search page" />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                <Heading>Dashboards</Heading>
                <Link href="/dashboards/tezos">
                    Go to Tezos dashboards
                </Link>
            </Container>
        </PageLayout>
    )
}



export default DashboardsIndexPage