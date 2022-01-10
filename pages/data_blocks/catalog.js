import Head from 'next/head'
import MainMenu from 'components/MainMenu'

import { Container, Divider, UnorderedList, ListItem } from '@chakra-ui/layout'
import {
    Button,
    Text,
    Heading,
    SimpleGrid,
    Box
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import Footer from "components/Footer"
import DataBlock from "components/DataBlock"
import SilentVideo from "components/SilentVideo"
import Link from "next/link"


const DataBlocksCatalogPage = ({ blocks }) => {
    return (
        <div>
            <Head>
                <title>Data blocks - Catalog</title>
                <meta name="description" content="Catalog of all The Stack Report animated data visualisations." />

            </Head>
            <MainMenu />
            <Container maxW="container.xl" style={{paddingTop: 100}}>
                <Heading as="h1" fontWeight="thin" marginBottom="2rem">
                    Data blocks - Catalog
                </Heading>
                <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="20px">
                    {blocks.map((block, block_i) => {
                        const spaces_url = _.get(block, "spaces_url", false)
                        return (
                                <DataBlock
                                    key={block._id}
                                    block={block}
                                    z_i={blocks.length + 10 - block_i}
                                    />
                        )
                    })}
                </SimpleGrid>
            </Container>
            <Footer />
        </div>
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
            .find().limit(100)
            .toArray()
        
        blocks = blocks.map(block => {
            return {
                ...block,
                _id: block._id.toString()
            }
        })
        blocks = _.sortBy(blocks, "vid_key")
        blocksCache = blocks
        return { props: {blocks: blocks}}
    }
}

export default DataBlocksCatalogPage