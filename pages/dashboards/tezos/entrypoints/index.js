import React from "react"
import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Heading,
    Text,
    Box,
    Divider,
    Container,
    SimpleGrid
} from "@chakra-ui/react"
import S_Dataset from "models/server/S_Dataset"
import _ from "lodash"
import DataTable from "components/DataTable"
import TezosEntrypointsPreview from "components/tezos/TezosEntrypointsPreview"
import DashboardsCategoriesNavigation from "components/DashboardsCategoriesNavigation"
import SearchContainer from "components/SearchContainer"


const TezosEntrypointsIndexPage = ({
    entrypoints=['test1', 'test2'],
    initial_search_term = ""
}) => {

    function searchTezosEntrypoints(searchTerm) {
        return new Promise((resolve) => {
            var searchResults = entrypoints.filter((entrypoint) => {
                return entrypoint.entrypoint.includes(searchTerm)
            })
            console.log("Resolving: ", searchResults)
            resolve(searchResults)
        })
    }
    return (
        <PageLayout>
            <Head>
                <title>Tezos entrypoints</title>
                <meta name="description" content="Tezos blockchain smart contract entrypoints." />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem" paddingBottom="8rem" id="page-top">
                <DashboardsCategoriesNavigation
                    categories={["contracts", "entrypoints", "chain"]}
                    urlPrefix={"/dashboards/tezos"}
                    />
                <Heading>
                    Tezos{" "}
                    <Text as="span" fontWeight="light">
                    Entrypoints
                    </Text>
                </Heading>
                <Divider />
                <SearchContainer
                    searchBoxLabel="Search through entrypoints by name"
                    searchBoxPlaceholder="e.g. transfer, mint, burn"
                    initialSearchTerm={initial_search_term}
                    sortOptions={[]}
                    fallbackResults={[]}
                    searchData={searchTezosEntrypoints}
                    renderResults={(results, searchTerm) => {
                        console.log("Rendering results: ", results)
                        var showingResults = results.length > 0
                        var renderResults = results.length > 0 ? results : entrypoints
                        return (
                            <SimpleGrid columns={[1, 1, 2]} spacing="2rem">
                                <Box>
                                    <Text marginBottom="1rem" fontSize="0.7rem" fontWeight="bold" textTransform={"uppercase"}>
                                        Data preview
                                    </Text>
                                    <TezosEntrypointsPreview providedData={renderResults.map(p => p.entrypoint)} />
                                </Box>
                                <Box
                                    maxWidth="40rem"
                                    >
                                    <Text marginBottom="1rem" fontSize="0.7rem" fontWeight="bold" textTransform={"uppercase"}>
                                        Table view
                                    </Text>
                                    <DataTable
                                        data={renderResults}
                                        columns={["entrypoint", "transactions", "senders", "targets"]}
                                        colLinks={{
                                            "entrypoint": (row) => {
                                                return `/dashboards/tezos/entrypoints/${row.entrypoint}`
                                            }
                                        }}
                                        maxRows={10}
                                        />
                                </Box>
                            </SimpleGrid>
                        )
                    }}
                    />
               
            </Container>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const initial_term = _.get(context, "query.search_term", "")

    var dataset = new S_Dataset()
    await dataset.from_identifier("the-stack-report--tezos-entrypoints-rich-statistics-index")
    var file = await dataset.load_file((data) => {
        return data.map((row) => {
            row["transactions"] = _.toNumber(row.transactions)
            row["senders"] = _.toNumber(row.senders)
            row["targets"] = _.toNumber(row.targets)
            if(row["transactions"] === 0) row["transactions"] = false
            if(row["senders"] === 0) row["senders"] = false
            if(row["targets"] === 0) row["targets"] = false
            
            return row
        })
    })
    return {
        props: {
            entrypoints: file,
            initial_search_term: initial_term
        }
    }
}

export default TezosEntrypointsIndexPage