import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Center,
    SimpleGrid,
    Select,
    Box,
    Divider
} from "@chakra-ui/react"
import {
    SearchIcon
} from "@chakra-ui/icons"
import { connectToDatabase } from "utils/mongo_db"
import PageLayout from 'components/PageLayout'
import ContractsCardsTable from "components/ContractsCardsTable"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import useDebounce from "utils/useDebounce"
import {
    insertUrlParam,
    getUrlParam,
    removeQueryParamsFromRouter
} from "utils/urlQueryParams"
import { useRouter } from 'next/router'

const sortOptions = [
    {
        key: "past_14_days.total_calls",
        label: "Calls in past 14 days"
    },
    {
        key: "TransactionsCount",
        label: "Calls total"
    },
]

function searchTezosContractsApi(search) {
    return fetch(`/api/contracts?search_term=${search}&sort_key=sort_positions.by_calls_past_14_days`).then(resp => {
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
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [queriedSearchTerm, setQueriedSearchTerm] = useState("")
    const [query, setQuery] = useState(false)
    const [searchResults, setSearchResults] = useState(false)
    const [searchTermInitialized, setSearchTermInitialized] = useState(false)
    // const router = useRouter()

    
    useEffect(() => {
        if(initial_search_term !== "" && searchTermInitialized === false) {
            setSearchTerm(initial_search_term)
            setSearchTermInitialized(true)
        }
    }, [
        initial_search_term, 
        searchTermInitialized,
        searchTerm
    ])

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    useEffect(() => {
        if(debouncedSearchTerm === "") {
            setQuery(false)
            setSearchResults(false)
            if(getUrlParam("search_term") !== undefined) {
                // removeQueryParamsFromRouter(router, ["search_term"])

            }
        } else if(debouncedSearchTerm !== queriedSearchTerm) {
            setIsSearching(true)
            setQueriedSearchTerm(debouncedSearchTerm)
            // router.push(
            //     insertUrlParam("search_term", debouncedSearchTerm),
            //     undefined,
            //     { shallow: true}
            // )
            


            searchTezosContractsApi(debouncedSearchTerm).then((results) => {
                if(_.isArray(results)) {
                    setSearchResults(results)
                }
                setIsSearching(false)
            })
        }
    }, [
        debouncedSearchTerm,
        queriedSearchTerm,
        // router
    ])

    const contractsToShow = _.isArray(searchResults) ? searchResults : top_contracts

    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Contracts</title>
                <meta name="description" content="Tezos contracts dashboards by The Stack Report" />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                <Heading>
                    Tezos Dashboards
                </Heading>
                <Text>
                    Search through tezos contracts and view dashboards with graphs showing contract usage history.
                </Text>
                <Divider />
                <SimpleGrid
                    columns={{sm: 1, md: 2}}
                    marginTop="1rem"
                    marginBottom="1rem"
                    >
                    <Box
                        paddingRight="1rem"
                        paddingBottom="1rem"
                        >
                        <Text
                            fontSize="0.7rem"
                            color="gray.500"
                            >
                            Search contract dashboards:
                        </Text>
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            color='gray.300'
                            >
                            <SearchIcon color='gray.500' />
                        </InputLeftElement>
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by contract alias or address"
                            
                            />
                    </InputGroup>
                    </Box>
                    <Box
                        maxW="400px"
                        >
                            <Text
                            fontSize="0.7rem"
                            color="gray.500"
                            >
                            Sorted by:
                        </Text>
                        <Select>
                            {sortOptions.map(option => {
                                return (
                                    <option
                                        value={option.key}
                                        key={option.key}
                                        >
                                        {option.label}
                                    </option>
                                )
                            })}
                        </Select>
                    </Box>
                </SimpleGrid>
                
                {isSearching ? (
                    <Center
                        h="200px"
                        >
                    <Spinner />
                    </Center>
                ) : (
                    <React.Fragment>
                        {contractsToShow.length > 0 ? (
                            <ContractsCardsTable
                                contracts={contractsToShow}
                                highlightTerm={searchTerm}
                                />
                        ) : (
                            <p>
                                No contract dashboards found for term: {debouncedSearchTerm}
                            </p>
                        )}
                    </React.Fragment>
                )}
                
                
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

        var cursor = await db.collection("contracts_metadata")
            .find({"sort_positions.by_calls_past_14_days": {$exists: true}})
            .sort([
                ["sort_positions.by_calls_past_14_days", 1],
                ["address", -1]
            ])
            .limit(100)
        
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