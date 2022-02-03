import Head from 'next/head'
import MainMenu from 'components/MainMenu'

import { Container } from '@chakra-ui/layout'
import {
    Text,
    Heading,
    Box
} from "@chakra-ui/react"
import _ from "lodash"
import { connectToDatabase } from "utils/mongo_db"
import DataBlock from "components/DataBlock"
import WrappedLink from "components/WrappedLink"

import Footer from "components/Footer"
const BlockPage = ({block, error, errorMessage="Error"}) => {
    const spaces_url = _.get(block, "spaces_url", false)
    const parent_vid_key = _.get(block ,"parent_vid_key", false)
    var pageError = false
    if(error) pageError = true
    if(!_.isObject(block)) pageError = true
    return (
        <div>
            <Head>
                <title>Data block</title>
                <meta name="description" content="Data block animation." />
                <meta name="twitter:card" content="player" />
                <meta name="twitter:site" content="@thestackreport" />
                <meta name="twitter:title" content={_.get(block, "name", "Unknown visual")} />
                <meta name="twitter:description" content={_.get(block, "title", "Unknown visual")} />
                <meta name="twitter:player" content={`https://thestackreport.xyz/data_blocks/iframe?block=${_.get(block, "vid_key", "unknown-visual")}`} />
                <meta name="twitter:player:width" content={_.get(block, "video_meta.width", 300)} />
                <meta name="twitter:player:height" content={_.get(block, "video_meta.height", 300)} />
            </Head>
            <MainMenu />
            <Container maxW="container.md" style={{paddingBottom: "8rem"}}>
                {pageError ? (
                    <Container paddingTop="100px">
                    <Heading
                        marginTop={{
                            base: "4rem",
                            md: "6rem"
                        }}
                        marginBottom="2rem"
                        fontWeight="bold"
                        fontSize="1rem"
                        >
                        Error loading block.
                    </Heading>
                    <Text>{errorMessage}</Text>
                    <WrappedLink href="/data_blocks" fontSize="0.7rem">
                        To visuals overview
                    </WrappedLink>
                    </Container>
                ) : (
                <Container paddingTop="100px">
                    <Box
                        position="absolute"
                        paddingTop={{
                            base: "0rem",
                            md: "1rem"
                        }}
                        >
                    <WrappedLink href="/data_blocks" fontSize="0.7rem">
                        To visuals overview
                    </WrappedLink>
                    </Box>
                    <Heading
                        marginTop={{
                            base: "4rem",
                            md: "6rem"
                        }}
                        marginBottom="2rem"
                        fontWeight="thin"
                        fontSize="1rem"
                        >
                        {block.name}|{block.title}
                    </Heading>
                    <div style={{marginTop: "2rem", marginBottom: "2rem"}}>
                        <DataBlock block={block} />
                    </div>
                </Container>
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
                return {
                    props: {
                        block: JSON.parse(JSON.stringify(block)),
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