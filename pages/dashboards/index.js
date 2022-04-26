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
import WrappedLink from "components/WrappedLink"
import ContractsCardsTable from "components/ContractsCardsTable"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"

const dashboardDescription = `


`


const DashboardsIndexPage = ({ top_contracts = [] }) => {
    console.log("dashboards index page")
    console.log(top_contracts)
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Dashboards</title>
                <meta name="description" content="The Stack Report dashboards search page" />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                <Heading>Dashboards</Heading>
                <ContractsCardsTable contracts={top_contracts} />
            </Container>
        </PageLayout>
    )
}


var cache = false

export async function getServerSideProps(context) {
    console.log("dashboards serverside")
    if(cache) {
        return {
            props: {
                top_contracts: cache
            }
        }
    } else {
        const { db } = await connectToDatabase()

        var top_contracts = await db.collection("contracts_metadata")
            .find()
            .sort({
                transactions_count: -1
            })
            .limit(100)
            .toArray()
        top_contracts = JSON.parse(JSON.stringify(top_contracts))
        return {
            props: {
                top_contracts: top_contracts
            }
        }

    }
}


export default DashboardsIndexPage