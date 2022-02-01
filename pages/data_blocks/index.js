import React, { useState, useEffect } from "react"
import Head from 'next/head'
import { Container } from '@chakra-ui/layout'
import {
    Heading,
    Input,
    Text
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import PageLayout from 'components/PageLayout'
import BlocksGrid from "components/BlocksGrid"
import useDebounce from "utils/useDebounce"


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
    const [query, setQuery] = useState(false)
    const [searchResults, setSearchResults] = useState(false)
    const [searchErrorMessage, setSearchErrorMessage] = useState(false)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    
    useEffect(() => {
        console.log(debouncedSearchTerm)
        if(debouncedSearchTerm) {
            setIsSearching(true)
            searchBlocksApi(debouncedSearchTerm).then((results) => {
                console.log(results)
                if(_.isArray(results) && results.length > 0) {
                    if(results.length > 0) {
                        setSearchResults(results)
                        setSearchErrorMessage(false)
                    } else {
                        setSearchErrorMessage("0 results found.")
                    }
                    
                }
                
            })

        }
    }, [debouncedSearchTerm])
    var blocksForGrid = blocks
    if(searchResults) {
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
                <BlocksGrid blocks={blocksForGrid} />
            </Container>
        </PageLayout>
    )
}

var blocksCache = false

export async function getServerSideProps(context) {
    if(blocksCache) {
        console.log("using blocks cache in catalog page.")
        return { props: {blocks: blocksCache}}
    } else {
        const { db } = await connectToDatabase()
        var blocks = await db.collection("data_blocks")
            .find().limit(50)
            .toArray()
        
        blocks = blocks.map(block => {
            return JSON.parse(JSON.stringify(block))
        })
        blocks = _.sortBy(blocks, "vid_key")

        // blocksCache = blocks

        return { props: {blocks: blocks}}
    }
}

export default DataBlocksCatalogPage