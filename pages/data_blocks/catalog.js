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
import SilentVideo from "components/SilentVideo"


const DataBlocksCatalogPage = ({ blocks }) => {
    return (
        <div>
            <Head>
                <title>Data blocks - Catalog</title>
                <meta name="description" content="Catalog of all The Stack Report animated data visualisations." />

            </Head>
            <MainMenu />
            <Container maxW="container.xl" style={{paddingTop: 100}}>
                <Heading as="h1" fontWeight="thin">
                    Data blocks - Catalog
                </Heading>
                <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="20px">
                    {blocks.map(block => {
                        const spaces_url = _.get(block, "spaces_url", false)
                        return (
                            <Box
                                key={block._id}
                                border="1px solid rgb(220,220,220)"
                                as="a"
                                href={`/data_blocks/block?block=${block.vid_key}`}
                                >
                                <Text>
                                    {block.title}
                                </Text>
                                <Text>
                                    {block.name}
                                </Text>
                                <Text>
                                    {block.merged_frames_at}
                                </Text>
                                {spaces_url && (
                                    <SilentVideo src={spaces_url} resolution={block.video_meta} />
                                )}
                                
                            </Box>
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
            .find()
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