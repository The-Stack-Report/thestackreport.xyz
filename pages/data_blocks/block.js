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
import _ from "lodash"
import { connectToDatabase } from "utils/mongo_db"
import SilentVideo from "components/SilentVideo"

import Footer from "components/Footer"
const BlockPage = ({block, error, errorMessage="Error"}) => {
    const spaces_url = _.get(block, "spaces_url", false)
    const parent_vid_key = _.get(block ,"parent_vid_key", false)
    return (
        <div>
            <Head>
                <title>Data block</title>
                <meta name="description" content="Data block animation." />

            </Head>
            <MainMenu />
            <Container maxW="container.lg" style={{paddingTop: 100, paddingBottom: 100}}>
                {error ? (
                    <div>
                    <Text>{errorMessage}</Text>
                    <Text as="a" href="/data_blocks/catalog">
                        Back to catalog.
                    </Text>
                    </div>
                ) : (
                    <div>
                    <Heading as="h4" fontWeight="bold">
                        Data block
                    </Heading>
                    <Heading as="h1" fontWeight="light">
                        {block.title}
                    </Heading>
                    {spaces_url && (
                        <SilentVideo src={spaces_url} />
                    )}
                    {parent_vid_key && (
                        <Text
                            as="a"
                            href={`/data_blocks/block?block=${parent_vid_key}`}
                            fontWeight="bold"
                            >
                                Part of: {parent_vid_key}
                        </Text>
                    )}
                </div>
                )}
                
            </Container>
            <Footer />
        </div>
    )
}

var blocksCache = {}

export async function getServerSideProps(context) {
    const data_key = _.get(context, "query.block", false)
    if(data_key) {
        if(_.has(blocksCache, data_key)) {
            console.log("using blocks cache for: ", data_key)
            return {
                props: {
                    block: blocksCache[data_key],
                    error: false
                }
            }
        } else {
            const { db } = await connectToDatabase()
            var block = await db.collection("data_blocks")
                .findOne({"vid_key": data_key})
            if (!_.has(block, "_id")) {
                return { props: {errorMessage: "Incorrect block key.", error: true} }
            } else {
                block._id = block._id.toString()
                blocksCache[data_key] = block
                return {
                    props: {
                        block: block,
                        error: false
                    }
                }
            }
        }
        
        
    } else {
        return { props: {errorMessage: "Missing block key.", error: true} }
    }   
    
}

export default BlockPage