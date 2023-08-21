import React from "react"
import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Divider
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import PageLayout from 'components/PageLayout'
import ContractsCardsTable from "components/ContractsCardsTable"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import DashboardsCategoriesNavigation from "components/DashboardsCategoriesNavigation"
import SearchContainer from "components/SearchContainer"


const sortOptions = [
    {
        key: "sort_positions.by_calls_past_14_days",
        label: "Calls in past 2 weeks"
    },
    {
        key: "sort_positions.by_total_calls",
        label: "Calls total"
    },
]

function searchTezosContractsApi(search, sortKey) {
    var windowLocation = _.get(window, "location", 'no-window-location')
    return fetch(`/api/contracts?search_term=${search}&sort_key=${sortKey}&from_domain=${windowLocation}`).then(resp => {
        if(resp.status === 200) {
            return resp.json()
        } else {
            throw new Error(resp.status)
        }
    }).then(data => {
        return data
    })
}

const TezosIndexPage = ({ top_contracts = [], initial_search_term = "" }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Contracts</title>
                <meta name="description" content="Tezos contracts dashboards by The Stack Report" />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                <DashboardsCategoriesNavigation
                    categories={["contracts", "entrypoints", "chain"]}
                    urlPrefix={"/dashboards/tezos"}
                    />
                <Heading>
                    Tezos{" "}
                    <Text as="span" fontWeight="light">
                    Smart Contracts
                    </Text>
                </Heading>
                <Text paddingTop="1rem" fontSize="0.8rem">
                    Search through tezos contracts and view dashboards with graphs showing contract usage history.
                </Text>
                <Divider />
                <SearchContainer
                    searchBoxLabel="Search contracts:"
                    searchBoxPlaceholder="Search by contract alias or address"
                    initialSearchTerm={initial_search_term}
                    searchData={searchTezosContractsApi}
                    sortOptions={sortOptions}
                    fallbackResults={top_contracts}
                    renderResults={(results, searchTerm) => {
                        if (results.length > 0) {
                        return (
                            <ContractsCardsTable
                                contracts={results}
                                highlightTerm={searchTerm}
                                />
                        )} else {
                        return (
                            <p>
                                No contract dashboards found for term: {searchTerm}
                            </p>
                        )
                        }
                    }}
                    />
                
                
            </Container>
        </PageLayout>
    )
}

var cache = false

export async function getServerSideProps(context) {
    const initial_term = _.get(context, "query.search_term", "")
    if(cache) {
        return {
            props: {
                top_contracts: cache,
                initial_search_term: initial_term
            }
        }
    } else {
        const { db } = await connectToDatabase()

        var findParams = {
            "sort_positions.by_calls_past_14_days":
            {$exists: true}
        }
        if(_.isString(initial_term)) {
            if(initial_term.length > 0) {
                findParams["$or"] = [
                    {"tzkt_account_data.alias": {"$regex":initial_term, "$options": "i"}},
                    {"address": {"$regex":initial_term, "$options": "xi"}}
                ]
            }
        }

        var cursor = await db.collection("contracts_metadata")
            .find(findParams)
            .sort([
                ["sort_positions.by_calls_past_14_days", 1],
            ])
            .limit(25)
        
        var top_contracts = await cursor.toArray()
        await cursor.close()
        
        top_contracts.forEach(contract => {
            contract._preparedDailyStats = prepareContractDailyStats(_.get(contract, "past_14_days", false))
        })
        top_contracts = JSON.parse(JSON.stringify(top_contracts))
        return {
            props: {
                top_contracts: top_contracts,
                initial_search_term: initial_term
            }
        }

    }
}

export default TezosIndexPage