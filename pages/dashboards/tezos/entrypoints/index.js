import React, { useMemo } from "react"
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
import loadDataset from "utils/hooks/loadDataset"
import * as d3 from "d3"

const TezosEntrypointsIndexPage = ({
    previewEntrypoints=[],
    initial_search_term = ""
}) => {
    var {
        loading,
        loadingError,
        dataset,
        cardWidth = {base: "12rem"},
        data
    } = loadDataset("the-stack-report--tezos-entrypoints-rich-statistics-index", (rawText) => {
        var parsedData = d3.csvParse(rawText)
        parsedData = parsedData.map((row) => {
            row["transactions"] = _.toInteger(row.transactions)
            row["senders"] = _.toInteger(row.senders)
            row["targets"] = _.toInteger(row.targets)
            row["wallet_senders"] = _.toInteger(row.wallet_senders)
            row["contract_senders"] = _.toInteger(row.contract_senders)
            if(row["transactions"] === 0) row["transactions"] = false
            if(row["senders"] === 0) row["senders"] = false
            if(row["targets"] === 0) row["targets"] = false
            return row
        })
        parsedData = _.sortBy(parsedData, "transactions").reverse()
        return parsedData
    })

    var entrypoints = useMemo(() => {
        if(_.isArray(data) && data.length > 10) {
            return data
        } else {
            return previewEntrypoints
        }
    }, [data, previewEntrypoints])

    function searchTezosEntrypoints(searchTerm) {
        return new Promise((resolve) => {
            var searchResults = entrypoints.filter((entrypoint) => {
                return entrypoint.entrypoint.includes(searchTerm)
            })
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
                    searchConstruct="tezos-entrypoints"
                    debounceDelay={500}
                    renderResults={(results, searchParams, searching) => {
                        var showingResults = results.length > 0
                        var renderResults = results
                        var searchTerm = _.get(searchParams, "searchTerm", "")
                        var searchTermDebounced = _.get(searchParams, "searchTermDebounced", "")
                        if(searchTerm === initial_search_term   && entrypoints.length > 0) {
                            if(searchTerm === "") {
                                renderResults = renderResults
                                renderResults = entrypoints
                            } else {
                                renderResults = entrypoints
                                renderResults = renderResults.filter(e => e.entrypoint.includes(searchTermDebounced))
                            }
                        } else {
                            renderResults = results
                            if (searchTerm === "") {
                                renderResults = entrypoints
                            } else {
                                renderResults = renderResults.filter(e => e.entrypoint.includes(searchTermDebounced))
                            }
                        }
                        return (
                            <SimpleGrid columns={[1, 1, 2]} spacing="2rem">
                                <Box>
                                    <Text marginBottom="1rem" fontSize="0.7rem" fontWeight="bold" textTransform={"uppercase"}>
                                        Data preview
                                    </Text>
                                    {renderResults.length > 0 ? (
                                        <TezosEntrypointsPreview
                                            providedData={renderResults}
                                            highlightWords={[searchTerm]}
                                            />
                                    ): (
                                        <Text>
                                            {searching ? (
                                                "Searching..."
                                            ) : (
                                                <>No results found for search term: <i>{searchTerm}</i></>
                                            )}
                                        </Text>
                                    )}
                                    
                                </Box>
                                <Box
                                    maxWidth="40rem"
                                    >
                                    <Text marginBottom="1rem" fontSize="0.7rem" fontWeight="bold" textTransform={"uppercase"}>
                                        Table view
                                    </Text>
                                    {renderResults.length > 0 && (
                                        <DataTable
                                            data={renderResults}
                                            columns={["entrypoint", "transactions", "senders", "targets"]}
                                            rowKey={"entrypoint"}
                                            colLinks={{
                                                "entrypoint": (row) => {
                                                    return `/dashboards/tezos/entrypoints/${row.entrypoint}`
                                                }
                                            }}
                                            maxRows={10}
                                            highlightWords={[searchTerm]}
                                            />
                                    )}
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
        var entrypoints = data.map((row) => {
            row["transactions"] = _.toInteger(row.transactions)
            row["senders"] = _.toInteger(row.senders)
            row["targets"] = _.toInteger(row.targets)
            row["wallet_senders"] = _.toInteger(row.wallet_senders)
            row["contract_senders"] = _.toInteger(row.contract_senders)
            if(row["transactions"] === 0) row["transactions"] = false
            if(row["senders"] === 0) row["senders"] = false
            if(row["targets"] === 0) row["targets"] = false
            
            return row
        })

        entrypoints = _.sortBy(entrypoints, "transactions").reverse()

        return entrypoints
    }, false)

    var previewedData = file
    if (_.isArray(file) && file.length > 25) {
        previewedData = file.slice(0, 25)
    } else {
        previewedData = []
    }

    return {
        props: {
            previewEntrypoints: previewedData,
            initial_search_term: initial_term
        }
    }
}

export default TezosEntrypointsIndexPage