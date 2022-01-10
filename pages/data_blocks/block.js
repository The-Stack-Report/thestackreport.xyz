import Head from 'next/head'
import MainMenu from 'components/MainMenu'

import { Container } from '@chakra-ui/layout'
import {
    Text,
    Heading,
    Divider
} from "@chakra-ui/react"
import _ from "lodash"
import { connectToDatabase } from "utils/mongo_db"
import DataBlock from "components/DataBlock"

import Footer from "components/Footer"
const BlockPage = ({block, error, errorMessage="Error"}) => {
    const spaces_url = _.get(block, "spaces_url", false)
    const parent_vid_key = _.get(block ,"parent_vid_key", false)
    return (
        <div>
            <Head>
                <title>Data block</title>
                <meta name="description" content="Data block animation." />
                <meta name="twitter:card" content={`${block.name} | ${block.title}`} />
                <meta name="twitter:site" content="@thestackreport" />
                <meta name="twitter:title" content={block.name} />
                <meta name="twitter:description" content={block.title} />
                <meta name="twitter:player:stream" content={spaces_url} />
            </Head>
            <MainMenu />
            <Container maxW="container.md" style={{paddingTop: "8rem", paddingBottom: "8rem"}}>
                {error ? (
                    <div>
                    <Text>{errorMessage}</Text>
                    <Text as="a" href="/data_blocks/catalog">
                        Back to catalog.
                    </Text>
                    </div>
                ) : (
                    <div>
                        <Divider />
                    <Heading as="h4" fontWeight="bold" size="md" marginBottom="1rem">
                        Data block
                    </Heading>
                    <Heading as="h1" fontWeight="light" size="md">
                        {block.name}|{block.title}
                    </Heading>
                    <div style={{marginTop: "2rem", marginBottom: "2rem"}}>
                        <DataBlock block={block} />
                    </div>
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