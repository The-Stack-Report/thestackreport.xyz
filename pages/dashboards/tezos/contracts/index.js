import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    GridItem,
    SimpleGrid,
    Box,
    Text
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import PageLayout from 'components/PageLayout'
import WrappedLink from "components/WrappedLink"
import ContractsCardsTable from "components/ContractsCardsTable"


const ContractsDashboardIndexPage = ({ top_contracts = [] }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Contracts</title>
                <meta name="description" content="Tezos contracts dashboards by The Stack Report" />
            </Head>
            <Container maxW="container.xl"style={{paddingTop: 100}}>
                <Heading>
                    Top Tezos contracts
                </Heading>
                <ContractsCardsTable contracts={top_contracts} />
            </Container>
        </PageLayout>
    )
}

var cache = false

export async function getServerSideProps(context) {
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

export default ContractsDashboardIndexPage