import React, { useState, useEffect } from "react"
import Head from 'next/head'
import { Container } from '@chakra-ui/layout'
import {
    Heading,
    Input,
    Text,
    Box,
    Button
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import PageLayout from 'components/PageLayout'
import BlocksGrid from "components/BlocksGrid"
import useDebounce from "utils/useDebounce"
import MarkdownWrapper from "components/MarkdownWrapper"
import { Link } from "@chakra-ui/next-js"

const replacementMessage = _.trim(`
The Data Blocks were an experiment in pre-rendered charts but is currently discontinued.
Instead, a new more scalable and more creative approach for social sharing of charts and metrics is being developed.

In the mean time, check out the [dashboards](/dashboards/tezos) for the latest data visualizations with continuously updating metrics.

`)



function searchBlocksApi(search) {
    return fetch(`/api/data_blocks/search?search_query=${search}`).then(resp => {
        if(resp.status === 200) {
            return resp.json()
        } else {
            return {
                "error": "error"
            }
        }
    }).then(data => {
        return data.docs
    })
}

const DataBlocksCatalogPage = ({ blocks }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState(false)
    const [searchErrorMessage, setSearchErrorMessage] = useState(false)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    
    useEffect(() => {
        if(debouncedSearchTerm === "") {
            setSearchResults(false)
        } else {
            setIsSearching(true)
            searchBlocksApi(debouncedSearchTerm).then((results) => {
                console.log(results)
                if(_.isArray(results)) {
                    setSearchResults(results)
                }
            })
        }
    }, [debouncedSearchTerm])
    
    var blocksForGrid = blocks
    if(_.isArray(searchResults)) {
        blocksForGrid = searchResults
    }

    return (
        <PageLayout>
            <Head>
                <title>Data blocks - Catalog</title>
                <meta name="description" content="Catalog of all The Stack Report animated data visualisations." />

            </Head>
            <Container maxW="container.xl" style={{paddingTop: 100, paddingBottom: 200}}>
                <Heading
                    as="h1"
                    fontWeight="thin"
                    marginBottom="2rem"
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    >
                    Data blocks
                </Heading>

                <Box padding="1rem" boxShadow="md" border="1px solid rgb(220,220,220)" borderRadius="5px" marginBottom="2rem">
                    <MarkdownWrapper markdownText={replacementMessage} />
                    <Link href="/dashboards/tezos">
                        <Button
                            bg="black"
                            color="white"
                            _hover={{
                                bg: "black",
                                textDecoration: "underline"
                            }}
                            >
                            Dashboards
                        </Button>
                    </Link>
                </Box>
                <Input
                    placeholder="search visuals"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value)}}
                    marginBottom="2rem"
                    />
                <Text>
                    {}
                </Text>
                {blocksForGrid.length > 0 ? (
                    <BlocksGrid blocks={blocksForGrid} />
                ) : (
                    <Text>
                        No entries found for search:
                        <Text as="span" fontStyle="italic">
                        {searchTerm}
                        </Text>
                    </Text>
                )}
                
            </Container>
        </PageLayout>
    )
}

var blocksCache = false

export async function getServerSideProps(context) {
    try {
        if(blocksCache) {
            console.log("using blocks cache in catalog page.")
            return { props: {blocks: blocksCache}}
        } else {
            const { db } = await connectToDatabase()
            var blocks = await db.collection("data_blocks")
                .find()
                .sort({"endDate": -1})
                .limit(20)
                .toArray()
            
            blocks = blocks.map(block => {
                return JSON.parse(JSON.stringify(block))
            })
            // blocks = _.sortBy(blocks, "endDate")
    
            blocksCache = blocks
    
            return { props: {blocks: blocks}}
        }
    } catch(err) {
        console.log("error in data blocks index page server side render: ", err)
        return { props: {blocks: []}}
    }
    
}

export default DataBlocksCatalogPage